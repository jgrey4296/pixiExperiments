-if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

define(['underscore','Actor','Room','pixi'],function(_,Actor,Room,PIXI){

    /**
       what sort of game model to make? top down 2d zelda like? or 2d side scrolling mario like?

       either way: movement on chosen axes, collision detection, boundary detection, and transtion to new rooms/scenes necessary.
       
     */
    
    var GameModel = function(){
        this.container = new PIXI.Container();
        //All Actors
        this.actors = [];
        //All Rooms
        this.rooms = [];
        //the current room:
        this.room = null;
        //The player character:
        this.player = null;
    };

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

    GameModel.prototype.addRoom = function(obj,availableAssets){
        //create the room,
        var asset = availableAssets[obj.background];
        if(asset && obj.backgroundFrame) asset = asset[obj.backgroundFrame];
        
        var theRoom = new Room(obj.name,asset,obj.leftOf,obj.rightOf);
        //add it to master list
        this.rooms.push(theRoom);

        //add each defined item to the room
        obj.items.forEach(function(d){
            this.addItemToRoom(theRoom,d,availableAssets);
        });
        
        //add each defined actor to the room
        obj.actors.forEach(function(d){
            this.addActorToRoom(theRoom,d,availableAssets);
        });
    };

    GameModel.prototype.addItemToRoom = function(room,itemDesc,availableAssets){
        var theItem = new Item(itemDesc.name,
                               availableAssets[itemDesc.assetName][itemDesc.frame],
                               itemDesc.position);
        room.items.push(theItem);
        room.container.addChild(theItem.sprite);
        
    };

    GameModel.prototype.addActorToRoom = function(room,actorDesc,availableAssets){
        var asset = availableAssets[actorDesc.assetName];
        if(asset && actorDesc.frame) asset = asset[actorDesc.frame];
        var theActor = new Actor(actorDesc.name,asset);

        //add the actor to the room:
        room.actors.push(theActor);
        room.container.addChild(theActor.sprite);
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

    
    
});
