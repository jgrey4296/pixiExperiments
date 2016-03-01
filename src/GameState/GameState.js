define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser'],function(scene,_,SpeechBubble,Actor,Room,Phaser){
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
        this.rooms = {};
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
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;

        //Create each room,
        //and add the origin room
        scene.forEach(function(d){
            var newRoom = this.buildRoom(d);
            //Only add the current room which is the origin, to the world
            if(d.origin){
                this.currentRoom = newRoom;
                this.game.world.add(newRoom);
            }
        },this);

        //Set the controllable character from the current room:
        var actors = _.values(this.currentRoom.actors);
        this.controllableActor = _.find(_.values(actors),d=>d.controllable === true);
        console.log("set controllable actor to:",this.controllableActor);
        
        //Set world boundaries
        this.physics.arcade.setBounds(0,0,this.game.width,this.game.height);
    };

    /**
       Called each tick, updating the room and moving the controllable actor
       @method
     */
    GameState.prototype.update = function(){
        //Update the room
        this.currentRoom.update();
        
        //Call movement control on the controllable actor:
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
    };

    //------------------------------
    
    /**
       Takes a description of a room and instantiates it for display and game logic
       @see {Room}
       @method
     */
    
    GameState.prototype.buildRoom = function(room){
        console.log("Building Room:",room);
        var newRoom = new Room(this.game,room);
        this.rooms[newRoom.id] = newRoom;
        return newRoom;
    };

    /** Changes the current room, moving the controllable actor as well
        @method
     */
    GameState.prototype.changeRoom = function(room){
        if(this.currentRoom !== null){
            this.game.world.remove(this.controllableActor);
            this.game.world.remove(this.currentRoom);
        }

        //get the room
        if(room){
            this.currentRoom = room;
            this.game.world.add(room);
            this.currentRoom.addActor(this.controllableActor);
        }else{
            console.log(room,this.rooms);
            throw new Error("room is null");
        }
        console.log("Current Room:",this.currentRoom);
    };

    /**
       Utility render method for debugging:
       @method
     */
    GameState.prototype.render = function(){
        //this.game.debug.body(this.controllableActor);

    };
    
    return GameState;
});
