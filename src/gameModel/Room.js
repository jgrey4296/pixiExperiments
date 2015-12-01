if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

/**
   @class Room
   @purpose To describe a room. who is in it, what is in it
*/

define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    
    var Room = function(name,texture,leftOf,rightOf){
        this.id = curId++;
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(texture);
        this.container.addChild(this.sprite);
        this.name = name;
        //Neighboring rooms:
        this.leftOf = leftOf;
        this.rightOf = rightOf;
        //Contains actors:
        this.actors = [];
        //Contains objects:
        this.items = [];
    }

    
    

});
