if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}
/**
   @class Item
   @purpose to describe an item. what it looks like, its name
*/
define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;

    /**
       @class Item
       @extends PIXI.Sprite
       @purpose a sprite that represents an item in the game model
     */
    var Item = function(name,texture,position){
        PIXI.Sprite.call(this,texture);
        this.id = curId++;
        this.position = position;
        this.name = name;
    }
    Item.prototype = Object.create(PIXI.Sprite.prototype);
    Item.prototype.constructor = Item;
    
    return Item;
    
});
