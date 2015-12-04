if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

define(['underscore','./Actor','./Room','pixi','./Item'],function(_,Actor,Room,PIXI,Item){

    /**
       what sort of game model to make? top down 2d zelda like? or 2d side scrolling mario like?

       either way: movement on chosen axes, collision detection, boundary detection, and transtion to new rooms/scenes necessary.
       
     */

    /**
       @class GameModel
       @extends PIXI.Container
       @purpose a main access and control point for game logic
     */
    var GameModel = function(){
        PIXI.Container.apply(this);
        //All Actors
        this.actors = [];
        //All Rooms
        this.rooms = [];
        //the current room:
        this.room = null;
        //The player character:
        this.player = null;
    };
    GameModel.prototype = Object.create(PIXI.Container.prototype);
    GameModel.prototype.constructor = GameModel;

    GameModel.prototype.GoToLeftRoom = function(){
        this.room = this.rooms[this.room.rightOf];
    }

    GameModel.prototype.GoToRightRoom = function(){
        this.room = this.rooms[this.room.leftOf];
    }

    //for later: go up, go down, go to arbitrary
    
    GameModel.prototype.moveActor = function(actor,direction){
        this.room.actors[actor].move(direction);
        //if actor is in a transition zone, move the actor to a new room
    }
    
    GameModel.prototype.moveActorToRoom = function(actor,room){
        //check actor exists
        //check room exists
        //remove actor from current room they are in
        //add actor to new room
    }

    //target can be an actor, or an item
    GameModel.prototype.interact = function(actor,target){
        console.log("TODO");
    }
    
    //------------------------------
    //Constructor functions:
    //------------------------------

    GameModel.prototype.addRoom = function(roomDesc,availableAssets){
        //create the room,
        var asset = availableAssets[roomDesc.background];
        if(asset && obj.backgroundFrame) asset = asset[roomDesc.backgroundFrame];
        
        var theRoom = new Room(roomDesc.name,asset,roomDesc.leftOf,roomDesc.rightOf);
        //add it to master list
        this.rooms.push(theRoom);

        //add each defined item to the room
        roomDesc.items.forEach(function(d){
            this.addItemToRoom(theRoom,d,availableAssets);
        },this);
        
        //add each defined actor to the room
        roomDesc.actors.forEach(function(d){
            this.addActorToRoom(theRoom,d,availableAssets);
        },this);

        if(roomDesc.origin){
            this.removeChildren();
            this.addChild(theRoom);
            this.room = theRoom;
        }

        
        return theRoom;
        
    };

    GameModel.prototype.addItemToRoom = function(room,itemDesc,availableAssets){
        var theItem = new Item(itemDesc.name,
                               availableAssets[itemDesc.assetName][itemDesc.frame],
                               itemDesc.position);
        room.items.push(theItem);
        room.addChild(theItem);
        
    };

    GameModel.prototype.addActorToRoom = function(room,actorDesc,availableAssets){
        console.log("Creating actor:",actorDesc.name);
        var asset = availableAssets[actorDesc.assetName];
        if(asset && actorDesc.frame) asset = asset[actorDesc.frame];
        var theActor = new Actor(actorDesc.name,asset,actorDesc.position);

        //add the actor to the room:
        room.actors[theActor.name] = theActor;
        room.addChild(theActor);
    };
    
    //------------------------------
    //Utility Functions
    //------------------------------

    GameModel.prototype.checkPositionForTransitionZone = function(x,y){

    };


    //------------------------------
    // Game loop
    //------------------------------
    GameModel.prototype.gameLoop = function(){
        //todo: add retenet and run reasoning
        //todo: register actions
        //todo: perform queued actions
    };

    
    return GameModel;
});
