define(['underscore','./Actor','./Item','./Door','phaser'],function(_,Actor,Item,Door,Phaser){

    /**
       The main room class, holding actors, and separate groups of sprites etc
       @constructor
       @param game
       @param description
       @alias Room
       @augments Phaser.Group
     */
    var Room = function(game,description){
        Phaser.Group.call(this,game,null,description.name);
        /** id */
        this.id = description.id;
        
        /** Background */
        var background = new Phaser.Sprite(this.game,0,0,description.background,description.backgroundFrame);
        background.width = this.game.width;
        background.height = this.game.height;
        if(description.tint !== undefined){
            background.tint = parseInt(description.tint,16);
            console.log("Set background tint to:",background.tint);
        }
        this.add(background);

        /** Connections to other rooms */
        this.connections = description.connections;
        /** Actors in the room */
        this.actors = {};
        /** Draw groups in the room */
        this.groups = {};

        //Build the room:
        //walls
        description.walls.forEach(d=>this.buildWall(d));
        // //doors
        description.doors.forEach(d=>this.buildDoor(d));
        //items
        description.items.forEach(d=>this.buildItem(d));
        //actors
        description.actors.forEach(d=>this.buildActor(d));

        
        // //todo:build the floor, ceiling, and walls
        // //TODO: sort items by y value
        // room.items.sort(function(a,b){
        //     return a.position.y - b.position.y;
        // });
        
        // var pre = room.items.filter(function(d){
        //     return d.position.y < this.game.height - 75;
        // },this);

        // var post = room.items.filter(function(d){
        //     return d.position.y >= this.game.height - 75;
        // },this);

        // console.log("Filtered:",pre,post);
        
        // pre.forEach(function(d){
        //     this.buildItem(d);
        // },this);

        // post.forEach(function(d){
        //     this.buildItem(d);
        // },this);


        
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

    /** Builds a {@link Door} in the room
        @method
     */
    Room.prototype.buildDoor = function(d){
        
        console.log("Building door:",d);
        d.group = "doors";

        var parent = undefined;
        if(d.invisible) parent = null;

        if(this.groups[d.group] === undefined){
            var newGroup = new Phaser.Group(this.game,this,d.group,false,d.physical,this.physicsType);
            this.groups[d.group] = newGroup;
        }

        var door = new Door(this.game,d.position.x,d.position.y,d.assetName,d.name,d.connectsTo);
        door.height = d.size.y;
        door.width = d.size.x;
        
        this.groups[d.group].add(door);
        door.anchor.setTo(0.5,1);

        this.game.physics.enable(door);
        door.body.collideWorldBounds = true;
        door.body.immovable = true;
        door.body.allowGravity = false;
        
        console.groupEnd();
    };

    /** Builds an {@link Item} in the room
        @method
     */
    Room.prototype.buildItem = function(d){
        console.log("building Item:",d);
        //if there is no group defined:
        if(d.group === undefined) d.group = "default";
        if(d.physical === undefined) d.physical = false;
        //create the group if necessary
        var parent = undefined;
        if(d.invisible) parent = null;
        
        if(this.groups[d.group] === undefined){
            console.log("creating group: ",d.group);
            var newGroup = new Phaser.Group(this.game,this,d.group,false,d.physical,this.physicsType);
            this.groups[d.group] = newGroup;
        }
        
        var item = new Item(this.game,d.position.x,d.position.y,d.assetName,d.frame,d.name);
        this.groups[d.group].add(item);
        item.anchor.setTo(0.5,1);
        
        if(d.physical){
            this.game.physics.enable(item);
            item.body.collideWorldBounds = true;
            if(d.immovable){
                item.body.immovable = d.immovable;
                item.body.allowGravity = false;
            }
        }

        console.groupEnd();
    };

    /** Builds an {@link Actor} in the room
        @method
     */
    Room.prototype.buildActor = function(d){
        //TODO: customise the group.classType for custom classes
        var actor = new Actor(this.game,d.position.x,d.position.y,d.assetName,d.frame,d.name,d.facing,d.controllable,d.width,d.height);

        if(d.dimensions){
            actor.height = d.dimensions.height;
            actor.width = d.dimensions.width;
        }
        
        if(d.physical){
            this.game.physics.enable(actor);
            actor.body.collideWorldBounds = true;
            actor.body.fixedRotation = true;
            actor.body.bounce.y = 0.2;
        }

        //if the actor is defined to have any animations:
        _.keys(d.animations).forEach(function(e){
            actor.registeredAnimations[e] = d.animations[e];
        });

        this.addActor(actor);

        console.log(this.groups);
        console.groupEnd();
    };

    /** Updates the room, running collisions within the room
        @method
    */
    Room.prototype.update = function(){
        var roomRef = this;
        //check for collisions
        if(this.groups.actors !== undefined){
            this.game.physics.arcade.collide(this.groups.actors,this.groups.actors);
            this.game.physics.arcade.collide(this.groups.actors,this.groups.objects);
            this.game.physics.arcade.collide(this.groups.actors,this.groups.walls);
            this.game.physics.arcade.collide(this.groups.actors,this.groups.doors,function(actor,door){
                if(!actor.controllable){
                    //move the actor through the door
                    roomRef.game.world.remove(actor);
                    delete roomRef.actors[actor.name];
                    var room = roomRef.getRoomFromDoor(door);
                    room.addActor(actor);
                }else{
                    //get the room using the door's connection
                    var room = roomRef.getRoomFromDoor(door);
                    roomRef.game.state.getCurrentState().changeRoom(room);
                }
            });
        }
        //Collide objects with the walls
        this.game.physics.arcade.collide(this.groups.walls,this.groups.objects);
        
        //run AI for each actor
        _.values(this.actors).forEach(d=>d.update());
        
        //perform movements

        //perform interactions

        

    };


    /** Gets the room object the door specified connects to
        @method
        @param door
     */
    Room.prototype.getRoomFromDoor = function(door){
        var roomId = this.connections[door.connection];
        return this.game.state.getCurrentState().rooms[roomId];
    };

    /** Adds an existing actor to the room
        @method
        @param actor
        @param group
        @param physical
        @param physicsType
    */
    Room.prototype.addActor = function(actor,group,physical,physicsType){
        if(group === undefined) group = "actors";
        if(physical === undefined) physical = true;
        if(physicsType === undefined) physicsType = "arcade";

        //create the group if necessary
        if(this.groups[group] === undefined){
            console.log("Creating group:",group);
            var newGroup = new Phaser.Group(this.game,this,group,false,physical,physicsType);
            this.groups[group] = newGroup;
        }

        this.groups[group].add(actor);
        this.actors[actor.name] = actor;
        
    };
    
    
    return Room;

});
