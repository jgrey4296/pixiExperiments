if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

define(['underscore','Actor'],function(_,Actor){

    /**
       what sort of game model to make? top down 2d zelda like? or 2d side scrolling mario like?

       either way: movement on chosen axes, collision detection, boundary detection, and transtion to new rooms/scenes necessary.
       
     */
    
    var GameModel = function(){
        //All Actors
        this.actors = [];
        //All Rooms
        this.rooms = [];
        //the current room:
        this.room = null;
    };

    GameModel.prototype.GoToLeftRoom = function(){
        this.room = this.rooms[this.room.rightOf];
    }

    GameModel.prototype.GoToRightRoom = function(){
        this.room = this.rooms[this.room.leftOf];
    }

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

    GameModel.prototype.interact = function(actor,target){
        console.log("TODO");
    }
    

});
