/* jshint esversion : 6 */
define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser','text!data/mazePaths','ClingoParser'],function(scene,_,SpeechBubble,Actor,Room,Phaser,mazePaths,ClingoParser){
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
        
        /** All Rooms */
        this.maze = Array(mazeSize).fill(0).map(d=>Array(mazeSize).fill(0).map(d=>null));
        /** Maze paths loaded from clingo output as answer sets of fact tuples */
        this.mazePaths = ClingoParser(mazePaths,'used');
        //room size:
        this.roomSize = [this.game.width,this.game.height];

        /** All Actors */
        this.actors = {};

        /** The Reasoning System */
        this.rete = null;
        
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
        console.log("GameState create");
        this.game.time.desiredFps = this.fps;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cameraOffset = [this.game.width/2,this.game.height/2];
        
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;
        
        //set the boundaries of the game world:
        //larger than the world itself so the camera can centre on a room
        //this.game.world.setBounds(0,0,(mazeSize+4) * this.roomSize[0],(mazeSize+4) * this.roomSize[1]);
        //Set world boundaries
        this.physics.arcade.setBounds(0,0,(mazeSize+1)*this.roomSize[0],(mazeSize+1)*this.roomSize[1]);

        //select an answer set and build room around from it
        _.sample(this.mazePaths).forEach(function(d){
            if(this.maze[parseInt(d[0])][parseInt(d[1])] !== null){
                //room has already been built
                return;
            }
            let randomRoomDescription = _.sample(scene),
                position = this.gridPositionToWorldPosition(parseInt(d[0]), parseInt(d[1])),
                size = this.roomSize,
                newRoom = this.buildRoom(randomRoomDescription,position,size);
            this.maze[parseInt(d[0])][parseInt(d[1])] = newRoom;
        },this);

        //Set the camera to the first room:
        this.game.camera.bounds = null;
        this.game.camera.setSize(this.roomSize[0],this.roomSize[1]);
        this.roomMovement = {};
        this.roomMovement.current = [0,0];
        this.centreCameraOnCurrentRoom();

        //Register room movement presses
        this.roomMovement.left = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
        this.roomMovement.right = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
        this.roomMovement.up = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
        this.roomMovement.down = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.roomMovement.showAll = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        
        //this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.J,Phaser.Keyboard.L,Phaser.Keyboard.I,Phaser.Keyboard.K]);
    };

    /**
       Called each tick, updating the room and moving the controllable actor
       @method
     */
    GameState.prototype.update = function(){
        //Update the room

        //**** ACTOR CONTROL
        if(this.controllableActor){
            //this.controllableActor.move();
            //get the cursor keys, move the playable character as necessary
            //get interaction key
            //run reasoning for each character, register actions for them to perform
            if(this.cursors.up.isDown){
                console.log(this.controllableActor);
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
    
    GameState.prototype.buildRoom = function(room,position,size){
        //console.log("Building Room:",room);
        var newRoom = new Room(this.game,room,position,size);
        this.game.world.add(newRoom);
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

    GameState.prototype.centreOfRoom = function(i,j){
        let position = this.gridPositionToWorldPosition(i,j);
        position[0] += this.roomSize[0];
        position[1] += this.roomSize[1];
        return position;
    };

    GameState.prototype.moveRoom = function(i,j){
        if(this.roomMovement.movedRecently){ return; }
        let newPos = [this.roomMovement.current[0] + i,
                      this.roomMovement.current[1] + j];
        if(0 <= newPos[0]  && newPos[0] < mazeSize
           && 0 <= newPos[1] && newPos[1] < mazeSize
          && this.maze[newPos[0]][newPos[1]] !== null){
            this.roomMovement.current = newPos;
        }
        this.roomMovement.movedRecently = true;
        this.centreCameraOnCurrentRoom();
    };
    
    GameState.prototype.centreCameraOnCurrentRoom = function(){
        let roomCentre = this.centreOfRoom(this.roomMovement.current[0],this.roomMovement.current[1]),
            newPosition = [roomCentre[0]-this.cameraOffset[0],roomCentre[1]-this.cameraOffset[1]];
        this.game.camera.focusOnXY(newPosition[0],newPosition[1]);
    };
    
    return GameState;
});
