define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser'],function(scene,_,SpeechBubble,Actor,Room,Phaser){

    /**
       Main state of a game. In this case, 2d side scroll platform like.
       @constructor
       @alias GameStates/GameState
       @implements Phaser.State
     */
    var GameState = function(game,scene){
        /** The physics type of the game */
        this.physicsType = Phaser.Physics.ARCADE;
        
        this.game = game;
        /** The amount of gravity */
        this.gravityAmnt = 350;
        /** The Current room the player is located in */
        this.currentRoom = null;
        /** The Current actor the player controls */
        this.controllableActor = null;

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
        console.log("GameState init");
        //Setup the reasoning system / RETE
    };

    GameState.prototype.preload = function(){
        console.log("GameState preload");
        //this.scene.forEach(function(room){
            //create the room groups and store them
        //});
    };

    /**
       Called when this state becomes active
       @method
     */
    GameState.prototype.create = function(){
        console.log("GameState create");
        this.game.time.desiredFps = 30;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;

        //Create each room,
        //and add the origin room
        scene.forEach(function(d){
            var newRoom = this.buildRoom(d);
            if(d.origin){
                this.currentRoom = newRoom;
                this.game.world.add(newRoom);
            }
        },this);

        //set the controllable character:
        var actors = _.values(this.currentRoom.actors);
        this.controllableActor = _.find(_.values(actors),function(d){ return d.controllable === true; });
        console.log("set controllable actor to:",this.controllableActor);
        //Set world boundaries
        //this.physics.arcade.setBounds(0,0,this.game.width,this.game.height-75);
    };

    /**
       Called each tick
       @method
     */
    GameState.prototype.update = function(){

        this.currentRoom.update();
        if(this.controllableActor){
            this.controllableActor.move();
        
            //get the cursor keys, move the playable character as necessary
            //get interaction key
            //run reasoning for each character, register actions for them to perform
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
    };

    //------------------------------
    
    /**
       Takes a description of a room and instantiates it for display and game logic
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

    return GameState;
});
