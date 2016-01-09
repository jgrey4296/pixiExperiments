
define(['underscore','./Actor','./Item','./Door','phaser'],function(_,Actor,Item,Door){

    var Room = function(game,description){
        Phaser.Group.call(this,game,null,description.name);

        //Create the background:
        var background = new Phaser.Sprite(this.game,0,0,description.background,description.backgroundFrame);
        background.width = this.game.width;
        background.height = this.game.height;
        this.add(background);
        
        this.id = description.id;
        this.connections = description.connections;
        //this.width = this.game.width;
        //this.height = this.game.height;
        this.actors = {};
        this.groups = {};

        //Build the room:
        //walls
        description.walls.forEach(function(d){
            this.buildWall(d);
        },this);
        // //doors
        description.doors.forEach(function(d){
            this.buildDoor(d);
        },this);

        //items
        description.items.forEach(function(d){
            console.log(d);
            this.buildItem(d);
        },this);
        
        //actors
        description.actors.forEach(function(d){
            this.buildActor(d);
        },this);

        
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

    Room.prototype.buildWall = function(wallDesc){
        if(this.groups['walls'] === undefined) this.groups['walls'] = new Phaser.Group(this.game,this,'walls');

        //Each wall is a tilesprite stretch for the defined size
        var tileSprite = new Phaser.TileSprite(this.game,wallDesc.position.x,wallDesc.position.y,
                                               wallDesc.width,wallDesc.height,wallDesc.assetName,wallDesc.frame);
        this.groups['walls'].add(tileSprite);

        this.game.physics.enable(tileSprite);
        tileSprite.body.immovable = true;
        tileSprite.body.allowGravity = false;
        
        
    };

    Room.prototype.buildDoor = function(d){
        console.groupCollapsed();
        
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
    
    Room.prototype.buildItem = function(d){
        console.groupCollapsed();
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

    Room.prototype.buildActor = function(d){
        console.groupCollapsed();
        
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
        this.game.physics.arcade.collide(this.groups.walls,this.groups.objects);
        
        //run AI for each actor
        _.values(this.actors).forEach(function(d){
            if(!d.controllable){
                d.update();
            }
        });

        
        //perform movements

        //perform interactions

    };


    Room.prototype.getRoomFromDoor = function(door){
        var roomId = this.connections[door.connection];
        return this.game.state.getCurrentState().rooms[roomId];
    };

    //
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
