define(['json!data/scene1.json','underscore','phaser'],function(scene,_){

    //The game state to describe a room you are in
    var GameState = function(game){
        this.game = game;
        //Current State info:
        this.currentRoom = null;
        this.controllableActor = null;

        //All available info:
        this.rooms = {};
        this.actors = {};

        //groups
        this.roomItems;
        this.roomActors;
        this.roomDoors;
        
        //Reasoning / AI
        this.rete = null;
        
    };

    GameState.prototype.init = function(){
        console.log("GameState init");
        //Setup the reasoning system / RETE
    };
    
    GameState.prototype.preload = function(){
        console.log("GameState preload");
        scene.forEach(function(room){
            //create the room groups and store them
        });
        
    };

    GameState.prototype.create = function(){
        console.log("GameState create");
        this.game.time.desiredFps = 30;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 350;

        //create the starting room:
        this.buildRoom(scene[0]);

        //create the character:
        this.controllableActor = this.add.sprite(50,this.game.height-150,'pig');
        this.game.physics.enable(this.controllableActor,Phaser.Physics.ARCADE);
        this.controllableActor.anchor.setTo(.5,1);
        this.controllableActor.height = 50;
        this.controllableActor.facing = 'right';
        this.controllableActor.body.collideWorldBounds = true;
        this.controllableActor.body.fixedRotation = true;
        this.controllableActor.body.bounce.y = 0.2;


        
    };

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
                this.controllableActor.scale.x = -1;
                this.controllableActor.facing = 'left';
            }
            
        }else if(this.cursors.right.isDown){
            this.controllableActor.body.velocity.x = 150;
            if(this.controllableActor.facing === 'left'){
                this.controllableActor.scale.x = 1;
                this.controllableActor.facing = 'right';
            }
        }

        
    };

    GameState.prototype.buildRoom = function(room){
        //background setup:
        this.background = this.add.sprite(0,0,room.background);
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        
        //build the floor, ceiling, and walls
        var sprite;
        room.items.forEach(function(d){
            sprite = this.add.sprite(d.position.x,d.position.y,d.assetName,d.frame);
            sprite.anchor.setTo(0.5,1);
            if(d.physical){
                this.game.physics.enable(sprite);
                sprite.body.collideWorldBounds = true;
                
            }
            
        },this);
        
    };

    return GameState;
});
