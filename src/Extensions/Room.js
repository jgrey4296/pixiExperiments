define(['underscore','./Actor','./Item','./Door','phaser'],function(_,Actor,Item,Door,Phaser){

    /**
       The main room class, holding actors, and separate groups of sprites etc
       @constructor
       @param game
       @param description
       @alias Room
       @augments Phaser.Group
     */
    var Room = function(game,description,position,size){
        if(position === undefined) { position = [0,0]; }
        if(size === undefined) { size = [100,100]; }
        Phaser.Group.call(this,game,null,description.name);

        this.x = position[0];
        this.y = position[1];
        
        /** id */
        this.id = description.id;
        
        /** Background */
        var background = new Phaser.Sprite(this.game,0,0,description.background,description.backgroundFrame);
        background.width = size[0];
        background.height = size[1];
        if(description.tint !== undefined){
            background.tint = parseInt(description.tint,16);
        }
        this.add(background);

        /** Actors in the room */
        this.actors = {};
        /** Draw groups in the room */
        this.groups = {};

    };
    
    Room.prototype = Object.create(Phaser.Group.prototype);
    Room.prototype.constructor = Room;

    /** Builds a wall representation in the room
        @method
     */
    Room.prototype.buildWall = function(wallDesc){
        if(this.groups['walls'] === undefined) this.groups['walls'] = new Phaser.Group(this.game,this,'walls');
        var x = wallDesc.position.x * this.game.width,
            y = wallDesc.position.y * this.game.height,
            height = wallDesc.height * this.game.height,
            width = wallDesc.width * this.game.width;
        console.log(this.game.width,this.game.height);

        //Each wall is a tilesprite stretch for the defined size
        var tileSprite = new Phaser.TileSprite(this.game,x,y,width,height,wallDesc.assetName,wallDesc.frame);
        if(wallDesc.tint !== undefined){
            tileSprite.tint = parseInt(wallDesc.tint,16);
        }
        this.groups['walls'].add(tileSprite);

        this.game.physics.enable(tileSprite);
        tileSprite.body.immovable = true;
        tileSprite.body.allowGravity = false;
    };

    /** Updates the room, running collisions within the room
        @method
    */
    Room.prototype.update = function(){
        var roomRef = this;
        //check for collisions
        // if(this.groups.actors !== undefined){
        //     this.game.physics.arcade.collide(this.groups.actors,this.groups.actors);
        //     this.game.physics.arcade.collide(this.groups.actors,this.groups.objects);
        //     this.game.physics.arcade.collide(this.groups.actors,this.groups.walls);
        //     this.game.physics.arcade.collide(this.groups.actors,this.groups.doors,function(actor,door){
        //         if(!actor.controllable){
        //             //move the actor through the door
        //             roomRef.game.world.remove(actor);
        //             delete roomRef.actors[actor.name];
        //             var room = roomRef.getRoomFromDoor(door);
        //             room.addActor(actor);
        //         }else{
        //             //get the room using the door's connection
        //             var room = roomRef.getRoomFromDoor(door);
        //             roomRef.game.state.getCurrentState().changeRoom(room);
        //         }
        //     });
        // }
        // //Collide objects with the walls
        // this.game.physics.arcade.collide(this.groups.walls,this.groups.objects);
        
        // //run AI for each actor
        // _.values(this.actors).forEach(d=>d.update());
        
        //perform movements

        //perform interactions

        

    };


    return Room;

});
