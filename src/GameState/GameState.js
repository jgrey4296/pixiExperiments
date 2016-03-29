/* jshint esversion : 6 */
define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser','text!data/mazePaths','ClingoParser'],function(scene,_,SpeechBubble,Actor,Room,Phaser,mazeSets,ClingoParser){
    var mazeSize = 8;
    
    /**
       Main state of a game. In this case emulating BoI, loaded from data/scene1.json
       @constructor
       @alias GameStates/GameState
       @implements Phaser.State
     */
    var GameState = function(game){
        /** The physics type of the game */
        this.physicsType = Phaser.Physics.ARCADE;
        /** A Reference to the game */
        this.game = game;
        /** The amount of gravity */
        this.gravityAmnt = 0;
        /** The Current room the player is located in */
        this.currentRoom = null;
        /** The Current actor the player controls */
        this.controllableActor = null;
        /** The FPS of the game */
        this.fps = 30;
        /** All Rooms in a grid */
        this.maze = Array(mazeSize).fill(0).map(d=>Array(mazeSize).fill(0).map(d=>null));
        /** All Rooms in a flat array */
        this.allRooms = [];
        /** Maze paths loaded from clingo output as answer sets of fact tuples */
        this.mazeSets = ClingoParser(mazeSets,'used');
        //room size:
        this.roomSize = [this.game.width,this.game.height];
        //room movement details:
        this.roomMovement = {
            //the current room indices for the maze
            current : [0,0],
            //key listeners
            left : null,
            right: null,
            up : null,
            down : null,
            //toggle for map view listener
            showAll : null,
            //whether the map toggle has been used recently
            mapRecent : false,
            //display the map view
            showMap : false,
            //moved recently toggle, for if the room has changed recently
            movedRecently : false,
        };

        //cursor listeners
        this.cursors = null;
        
        
        /** All Actors */
        this.actors = {};
        if(scene !== undefined){
            this.scene = scene;
        }
    };

    /**
       Called on creation, after ctor
       @method 
     */
    GameState.prototype.init = function(){
        console.log("GameState init:",scene);
        //Setup the reasoning system / RETE
    };


    /**
       Setup the gamestate, setting the fps, physics and gravity,
       Registers cursor keys, and creates the actor and the defined rooms.
       @method
     */
    GameState.prototype.create = function(){
        this.game.time.desiredFps = this.fps;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cameraOffset = [this.game.width/2,this.game.height/2];
        
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;
        this.physics.arcade.setBounds(0,0,(mazeSize+1)*this.roomSize[0],(mazeSize+1)*this.roomSize[1]);        

        //select an answer set maze base and build rooms for it
        _.sample(this.mazeSets).forEach(function(d){
            if(this.maze[parseInt(d[0])][parseInt(d[1])] !== null){
                //room has already been built, don't bother
                return;
            }
            //create a new room
            let randomRoomDescription = _.sample(scene),
                indices = [parseInt(d[0]),parseInt(d[1])],
                position = this.gridPositionToWorldPosition(indices[0],indices[1]),
                size = this.roomSize,
                newRoom = this.buildRoom(randomRoomDescription,position,size,indices);
            //store the room
            this.maze[parseInt(d[0])][parseInt(d[1])] = newRoom;
        },this);

        //generate doors;
        this.addDoors();
        
        //Set the camera to the first room:
        this.game.camera.bounds = null;
        this.game.camera.setSize(this.roomSize[0],this.roomSize[1]);
        this.centreCameraOnCurrentRoom();

        //Register room movement presses
        this.roomMovement.left = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
        this.roomMovement.right = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
        this.roomMovement.up = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
        this.roomMovement.down = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.roomMovement.showAll = this.game.input.keyboard.addKey(Phaser.Keyboard.M);

        //Create an add the controllable actor:
        this.controllableActor = new Actor(this.game,
                                           this.roomSize[0]/8,
                                           this.roomSize[1]/8,
                                           'pig',0,
                                           'anActor', 'right',true,
                                           100,100);
        this.game.physics.enable(this.controllableActor);
        this.game.world.add(this.controllableActor);
        this.controllableActor.say("this is a test");

        
        //add the CA to the current room
        let x = this.roomMovement.current[0],
            y = this.roomMovement.current[1],
            room = this.maze[x][y];
        // if(room){
        //     room.addAndToGroup('actors',this.controllableActor.name,this.controllableActor);
        // }

        //modify the world update function to ignore inactive items:
        this.game.world.update = function(){
            //console.log("New world update");
            let i = this.children.length,
                curr;
            while(i--){
                curr = this.children[i];
                if(curr.isInactive){
                    continue;
                }
                curr.update();
            }

        };
    };

    /**
       Called each tick, moving the controllable actor, updating map position etc
       @method
     */
    GameState.prototype.update = function(){
        //console.log("Game State update");
        
        //**** ACTOR CONTROL
        if(this.controllableActor){
            //get the cursor keys, move the playable character as necessary
            //get interaction key
            if(this.cursors.up.isDown){
                this.controllableActor.move('up');
            }else if(this.cursors.down.isDown){
                this.controllableActor.move('down');
            }
            if(this.cursors.left.isDown){
                this.controllableActor.move('left');
            }else if(this.cursors.right.isDown){
                this.controllableActor.move('right');
            }
        }
        //**** SHOW ENTIRE MAP
        if(this.roomMovement.showAll.downDuration(200)){
            if(this.roomMovement.mapRecent) { return; }
            if(!this.roomMovement.showMap){
                //show the whole map
                this.game.camera.setSize(this.roomSize[0] * mazeSize,this.roomSize[1] * mazeSize);
                this.game.camera.scale.x = 1/mazeSize;
                this.game.camera.scale.y = 1/mazeSize;
                this.game.camera.setPosition(0,0);
                this.roomMovement.showMap = true;
            }else{
                //go back to showing just a room
                this.game.camera.setSize(this.roomSize[0],this.roomSize[1]);
                this.game.camera.scale.x = 1;
                this.game.camera.scale.y = 1;
                this.roomMovement.showMap = false;
                this.centreCameraOnCurrentRoom();
            }
            this.roomMovement.mapRecent = true;
        }else{
            this.roomMovement.mapRecent = false;
        }

        //**** MOVE MAP
        if(!this.roomMovement.showMap){
            if(this.roomMovement.left.downDuration(200)){
                this.moveRoom(-1,0);
            }else if(this.roomMovement.right.downDuration(200)){
                this.moveRoom(1,0);
            }else if(this.roomMovement.up.downDuration(200)){
                this.moveRoom(0,-1);
            }else if(this.roomMovement.down.downDuration(200)){
                this.moveRoom(0,1);
            }else{
                this.roomMovement.movedRecently = false;
            }
        }
    };

    //------------------------------
    
    /**
       Takes a description of a room and instantiates it for display and game logic
       @see {Room}
       @method
     */
    
    GameState.prototype.buildRoom = function(room,position,size,indices){
        //console.log("Building Room:",room);
        var newRoom = new Room(this.game,room,position,size,indices);
        this.game.world.add(newRoom);
        this.allRooms.push(newRoom);
        return newRoom;
    };

    /**
       Utility render method for debugging:
       @method
     */
    GameState.prototype.render = function(){
        //this.game.debug.cameraInfo(this.game.camera,500,32);
        //this.game.debug.body(this.controllableActor);

    };

    /**
       Utility method to convert an element of this.maze to world coordinates,
       ie: getting this.maze[i][j] -> [x,y]
       @param i
       @param j
     */
    GameState.prototype.gridPositionToWorldPosition = function(i,j){
        let position = [
            i * this.roomSize[0],
            j * this.roomSize[1]
        ];
        return position;
    };

    //calculate the top right position of a room, to be offset so that the camera
    //is centred.
    //TODO: fix this misnomer
    GameState.prototype.centreOfRoom = function(i,j){
        let position = this.gridPositionToWorldPosition(i,j);
        position[0] += this.roomSize[0];
        position[1] += this.roomSize[1];
        return position;
    };

    //deactivate current room, move to a new room, activate it
    GameState.prototype.moveRoom = function(i,j){
        if(this.roomMovement.movedRecently){ return; }
        let newPos = [this.roomMovement.current[0] + i,
                      this.roomMovement.current[1] + j];
        if(0 <= newPos[0]  && newPos[0] < mazeSize
           && 0 <= newPos[1] && newPos[1] < mazeSize
           && this.maze[newPos[0]][newPos[1]] !== null){
            //deactivate
            this.maze[this.roomMovement.current[0]][this.roomMovement.current[1]].switchActiveStatus();
            this.roomMovement.current = newPos;
            //activate
            this.maze[this.roomMovement.current[0]][this.roomMovement.current[1]].switchActiveStatus();
        }
        this.roomMovement.movedRecently = true;
        this.centreCameraOnCurrentRoom();
    };

    //Move the camera to the centre of the room that is currently occupied.
    GameState.prototype.centreCameraOnCurrentRoom = function(){
        let roomCentre = this.centreOfRoom(this.roomMovement.current[0],this.roomMovement.current[1]),
            newPosition = [roomCentre[0]-this.cameraOffset[0],roomCentre[1]-this.cameraOffset[1]];
        this.game.camera.focusOnXY(newPosition[0],newPosition[1]);
    };

    GameState.prototype.addDoors = function(){
        console.log("Adding Doors");
        //note: could be optimised to add pairs of doors at a time
        let maze = this.maze;
        //for each room
        this.allRooms.forEach(function(room){
            let neighbourIndices = room.getNeighbours();
            //for each neighbour
            neighbourIndices.map(function(indexPair){
                let row = maze[indexPair[0]] || [],
                    column = row[indexPair[1]] || null;
                if(column !== null){
                    room.buildDoor(indexPair);
                }
            });
        });
    };
    
    return GameState;
});
