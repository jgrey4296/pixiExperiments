/* jshint esversion : 6 */
define(['underscore','./Actor','./Item','./Door','phaser'],function(_,Actor,Item,Door,Phaser){

    /**
       The main room class, holding actors, and separate groups of sprites etc
       @constructor
       @param game
       @param description
       @alias Room
       @augments Phaser.Group
     */
    var Room = function(game,description,position,size,indices){
        if(position === undefined) { position = [0,0]; }
        if(size === undefined) { size = [100,100]; }
        if(indices === undefined) { indices = [-1,-1]; }
        //Extend from Phaser.Group
        Phaser.Group.call(this,game,null,description.name);

        //the indices of the room on the map
        this.indices = indices;
        
        //Default to being inactive:
        this.isInactive = true;
        
        this.x = position[0];
        this.y = position[1];
        this.size = {
            width : size[0],
            height : size[1]
        };
        
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

        //Build the walls:
        this.buildWall({
            position : { x : 0, y : 0},
            size : { width : 1.0, height : 0.05 },
            assetName : "whiteTile",
            tint : "AA0000",
        });
        this.buildWall({
            position : { x : 0, y : 0.95},
            size : { width : 1.0, height : 0.05},
            assetName : "whiteTile",
            tint : "0000AA"
        });
        this.buildWall({
            position : { x: 0, y : 0},
            size : { width : 0.05, height : 1.0},
            assetName : "whiteTile",
            tint : "AA00AA",
        });
        this.buildWall({
            position : { x : 0.95, y: 0},
            size : { width : 0.05, height : 1.0},
            assetName : "whiteTile",
            tint : "1423FF",
        });

        // this.buildDoor({
        //     position : { x : 0.5, y : 0.95},
        //     size : 40,
        //     linkToIndices : [this.indices[0],this.indices[1]+1],
        //     assetName : "door"
        // });
    };
    
    Room.prototype = Object.create(Phaser.Group.prototype);
    Room.prototype.constructor = Room;

    /** Builds a wall representation in the room
        @method
     */
    Room.prototype.buildWall = function(wallDesc){
        /* wallDesc : {
           position : { x : num, y : num }, //as % of room size
           size : { height : num, width : num }, //as % of room size
           assetName, frame, tint,
           }
         */
        if(this.groups['walls'] === undefined) this.groups['walls'] = new Phaser.Group(this.game,this,'walls');
        let x = wallDesc.position.x * this.size.width,
            y = wallDesc.position.y * this.size.height,
            height = wallDesc.size.height * this.size.height,
            width = wallDesc.size.width * this.size.width;

        //Each wall is a tilesprite stretched for the defined size
        let tileSprite = new Phaser.TileSprite(this.game,x,y,width,height,wallDesc.assetName,wallDesc.frame);
        if(wallDesc.tint !== undefined){
            tileSprite.tint = parseInt(wallDesc.tint,16);
        }
        this.groups['walls'].add(tileSprite);

        this.game.physics.enable(tileSprite);
        tileSprite.body.immovable = true;
        tileSprite.body.allowGravity = false;
        
    };

    Room.prototype.buildDoor = function(indexPair){
        if(this.groups['doors'] === undefined) {
            this.groups['doors'] = new Phaser.Group(this.game,this,'doors');
        }
        //console.log("Building Door:",indexPair,this.indices);
        //calculate the x and y based on relation between indexPair and this.indices
        let doorPosition = [indexPair[0]-this.indices[0],indexPair[1]-this.indices[1]];
        //horiz: [+-1,0], vertical:[0,+-1]
        let xOffset = this.size.width * 0.05,
            yOffset = this.size.height * 0.05,
            x = doorPosition[0] === 0 ? 0.5 * this.size.width : doorPosition[0] < 0 ? 0 : this.size.width - xOffset,
            y = doorPosition[1] === 0 ? 0.5 * this.size.height : doorPosition[1] < 0 ? 0 : this.size.height - yOffset;

        let doorSprite = new Door(this.game,x,y,"door",indexPair);
        this.groups['doors'].add(doorSprite);

        this.game.physics.enable(doorSprite);
        doorSprite.body.immovable = true;
        doorSprite.body.allowGravity = false;
    };

    
    /** Updates the room, running collisions within the room
        @method
    */
    Room.prototype.update = function(){
        //check for collisions between elements in the room

        //check for collisions between the controllable actor and items in this room
        
        //update each actor in the room

    };

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


    Room.prototype.addAndToGroup = function(groupName,name,object){
        if(this.groups[groupName] === undefined){ this.groups[groupName] = {}; }
        this.groups[groupName][name] = object;
        this.add(object);
    };

    Room.prototype.switchActiveStatus = function(){
        this.isInactive = !this.isInactive;
        //TODO: disable the physics for all elements in the room, or enable them
    };

    //Get the neighbour indices for the room:
    //DOES NOT filter impossible coordinates
    Room.prototype.getNeighbours = function(){
        let transforms = [
            [-1,0],[+1,0],
            [0,-1],[0,+1]
        ],
            neighbourIndices = transforms.map(d=>[this.indices[0]+d[0],this.indices[1]+d[1]]);

        return neighbourIndices;        
    };
    
    return Room;

});
