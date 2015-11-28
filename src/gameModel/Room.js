if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

/**
   @class Room
   @purpose To describe a room. who is in it, what is in it
*/

define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    
    var Room = function(name,texture){
        this.id = curId++;
        this.sprite = new PIXI.Sprite(texture);
        this.name = name;
        //Neighboring rooms:
        this.leftOf = null;
        this.rightOf = null;
        //Contains actors:
        this.actors = [];
        //Contains objects:
        this.items = [];
    }

    
    

});
