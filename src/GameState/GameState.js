define(['json!data/scene1.json','underscore','../Extensions/SpeechBubble','../Extensions/Actor','phaser'],function(scene,_,SpeechBubble,Actor){

    /**
       @class GameState
       @constructor
       @purpose main state of a game. In this case, 2d side scroll platform like.
     */
    var GameState = function(game,scene){
        this.physicsType = Phaser.Physics.ARCADE;
        
        this.game = game;
        //Current State info:
        this.currentRoom = null;
        this.controllableActor = null;

        //All available info:
        this.rooms = {};
        this.actors = {};

        //groups
        this.groups = {};
        
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
        this.game.physics.arcade.gravity.y = 350;

        //create the starting room:
        this.buildRoom(scene[0]);
        this.physics.arcade.setBounds(0,0,this.game.width,this.game.height-75);

    };

    /**
       @class GameState
       @method update
       @purpose called each tick
     */
    GameState.prototype.update = function(){
        //get the cursor keys, move the playable character as necessary
        //get interaction key
        //run reasoning for each character, register actions for them to perform
        this.controllableActor.body.velocity.x = 0;
        if(this.cursors.up.isDown && this.controllableActor.body.onFloor()){
            this.controllableActor.body.velocity.y = -250;
        }else if(this.cursors.down.isDown){
            console.log(this);
        }else if(this.cursors.left.isDown){
            this.controllableActor.body.velocity.x = -150;
            if(this.controllableActor.facing === 'right'){
                this.controllableActor.flip();
            }
        }else if(this.cursors.right.isDown){
            this.controllableActor.body.velocity.x = 150;
            if(this.controllableActor.facing === 'left'){
                this.controllableActor.flip();
            }
        }

        //todo: perform actions for each other actor
        
        this.game.physics.arcade.collide(this.groups.actors,this.groups.actors,
                                      function(s1,s2){
                                          console.log("Collided: ",s1.name, s2.name);
                                          s1.say("I collided with " + s2.name);
                                      },null,this);

        this.game.physics.arcade.collide(this.groups.actors,this.groups.objects);
        
    };

    //------------------------------
    
    /**
       @class GameState
       @method buildRoom
       @purpose takes a description of a room and instantiates it for display and game logic
     */
    
    GameState.prototype.buildRoom = function(room){
        //background setup:
        this.background = this.add.sprite(0,0,room.background);
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        
        //todo:build the floor, ceiling, and walls
        //TODO: sort items by y value
        room.items.sort(function(a,b){
            return a.position.y - b.position.y;
        });
        
        var pre = room.items.filter(function(d){
            return d.position.y < this.game.height - 75;
        },this);

        var post = room.items.filter(function(d){
            return d.position.y >= this.game.height - 75;
        },this);

        console.log("Filtered:",pre,post);
        
        pre.forEach(function(d){
            this.buildItem(d);
        },this);

        room.actors.forEach(function(d){
            this.buildActor(d);
            
        },this);

        post.forEach(function(d){
            this.buildItem(d);
        },this);
    };

    /**
       @class GameState
       @method buildActor
       @purpose creates an actor sprite, setting up group and physics
     */
    GameState.prototype.buildActor = function(d){
        if(d.group === undefined) d.group = "default";
        if(d.physical === undefined) d.physical = false;
        //create the group if necessary
        if(this.groups[d.group] === undefined) this.groups[d.group] = this.add.group(undefined,d.group,false,d.physical,this.physicsType);

        //TODO: customise the group.classType for custom classes
        var actor = new Actor(this.game,d.position.x,d.position.y,d.assetName,d.frame,d.name,d.facing);
        //add to the actors group
        this.groups[d.group].add(actor);
        
        if(d.physical){
            this.game.physics.enable(actor,this.physicsType);
            actor.body.collideWorldBounds = true;
            actor.body.fixedRotation = true;
            actor.body.bounce.y = 0.2;
            
        }
        if(d.controllable){
            this.controllableActor = actor;
        }
    };

    /**
       @class GameState
       @method buildItem
       @purpose creates a non-actor element in the room
     */
    GameState.prototype.buildItem = function(d){
            //if there is no group defined:
            if(d.group === undefined) d.group = "default";
            if(d.physical === undefined) d.physical = false;
            //create the group if necessary
            var parent = undefined;
            if(d.invisible) parent = null;
                        
            if(this.groups[d.group] === undefined) this.groups[d.group] = this.add.group(parent,d.group,false,d.physical,this.physicsType);
            
            var sprite = this.groups[d.group].create(d.position.x,d.position.y,d.assetName,d.frame);
            sprite.anchor.setTo(0.5,1);
            if(d.physical){
                //this.game.physics.enable(sprite);
                sprite.body.collideWorldBounds = true;
                if(d.immovable){
                    sprite.body.immovable = d.immovable;
                }
            }
    };
    
    

    return GameState;
});
