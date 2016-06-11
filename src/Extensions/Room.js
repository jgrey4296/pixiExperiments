/* jshint esversion : 6 */
define(['lodash','./Actor','./Item','./Door','phaser'],function(_,Actor,Item,Door,Phaser){

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

    Room.prototype.buildDoor = function(indexPair,roomObject){
        if(this.groups['doors'] === undefined) {
            this.groups['doors'] = new Phaser.Group(this.game,this,'doors');
        }
        let doorSprite = new Door(this.game,0,0,"door",indexPair,roomObject);
        //console.log("Building Door:",indexPair,this.indices);
        //calculate the x and y based on relation between indexPair and this.indices
        let doorPosition = [indexPair[0]-this.indices[0],indexPair[1]-this.indices[1]],
        //horiz: [+-1,0], vertical:[0,+-1]
            xOffset = doorSprite.width,//this.size.width * 0.05,
            yOffset = doorSprite.height,//this.size.height * 0.1,
            x = doorPosition[0] === 0 ? 0.5 * this.size.width : doorPosition[0] < 0 ? xOffset : this.size.width - xOffset,
            y = doorPosition[1] === 0 ? 0.5 * this.size.height : doorPosition[1] < 0 ? yOffset : this.size.height - yOffset;

        doorSprite.position.x = x;
        doorSprite.position.y = y;

        this.groups['doors'].add(doorSprite);

        this.game.physics.enable(doorSprite);
        doorSprite.body.immovable = true;
        doorSprite.body.allowGravity = false;
    };

    
    /** Updates the room, running collisions within the room
        @method
    */
    Room.prototype.update = function(){
        let roomRef = this;
        //update each actor in the room
        _.values(this.actors).forEach(d=>d.update());
        
        //check for collisions between elements in the room
        if(this.groups.actors !== undefined){
            this.game.physics.arcade.collide(this.groups.actors,this.groups.actors);
            if(this.groups.walls){
                this.game.physics.arcade.collide(this.groups.actors,this.groups.walls);
            }
            //collide the actors with the doors:
            this.game.physics.arcade.collide(this.groups.actors,this.groups.doors,function(actor,door){
                let newPos = door.connectionObject.towardCentreFromPoint(door);
                roomRef.removeActor(actor.id);
                door.connectionObject.addActor(actor);
                actor.position = newPos;
            });
        }        
    };

    
    Room.prototype.switchActiveStatus = function(){
        this.isInactive = !this.isInactive;
        this.parent.bringToTop(this);
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

    //Add the actor to this room
    Room.prototype.addActor = function(actor){
        if(this.groups['actors'] === undefined){
            this.groups['actors'] = new Phaser.Group(this.game,this,'actors');
        };
        if(this.actors[actor.id] !== undefined){
            throw new Error("Adding an actor with a duplicate name");
        }
        this.groups['actors'].add(actor);
        this.actors[actor.id] = actor;
        actor.setRoomIndices(this.indices);
    };

    //remove the actor from thise room, by name
    Room.prototype.removeActor = function(actorId,deleteFromRoom,destroy){
        destroy = destroy || false;
        deleteFromRoom = deleteFromRoom || true;
        if(this.actors[actorId] !== undefined){
            let actor = this.actors[actorId];
            this.groups['actors'].remove(this.actors[actorId],destroy);
            if(deleteFromRoom){
                delete this.actors[actorId];
            }
            return actor;
        }
        return null;
    };

    Room.prototype.towardCentreFromPoint = function(obj){
        let roomCen = new Phaser.Point(this.size.width*0.5,this.size.height*0.5),
            roomCenRelToDoor = obj.toLocal(roomCen,this).setMagnitude(100),            
            newPositionRelToRoom = this.toLocal(roomCenRelToDoor,obj);
        return newPositionRelToRoom;
    };
    
    return Room;

});
