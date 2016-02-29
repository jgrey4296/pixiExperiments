define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser'],function(scene,_,SpeechBubble,Actor,Room){

    /**
       @class GameState
       @constructor
       @purpose main state of a game. In this case, 2d side scroll platform like.
     */
    var GameState = function(game,scene){
        this.physicsType = Phaser.Physics.ARCADE;
        
        this.game = game;
        this.gravityAmnt = 350;
        //Current State info:
        this.currentRoom = null;
        this.controllableActor = null;

        //All available info:
        this.rooms = {};
        this.actors = {};

        //Reasoning / AI
        this.rete = null;

        if(scene !== undefined){
            this.scene = scene;
        }
    };

    /**
       @class GameState
       @method init
       @purpose called on creation, after ctor
     */
    GameState.prototype.init = function(){
        console.log("GameState init");
        //Setup the reasoning system / RETE
    };

    /**
       @class GameState
       @method preload
       @purpose loads assets
     */
    GameState.prototype.preload = function(){
        console.log("GameState preload");
        //this.scene.forEach(function(room){
            //create the room groups and store them
        //});
        
    };

    /**
       @class GameState
       @method create
       @purpose called when this state becomes active
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
       @class GameState
       @method update
       @purpose called each tick
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
       @class GameState
       @method buildRoom
       @purpose takes a description of a room and instantiates it for display and game logic
     */
    
    GameState.prototype.buildRoom = function(room){
        console.log("Building Room:",room);
        var newRoom = new Room(this.game,room);
        this.rooms[newRoom.id] = newRoom;
        return newRoom;
    };


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
