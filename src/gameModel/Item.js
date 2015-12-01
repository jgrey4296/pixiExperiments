if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}
/**
   @class Item
   @purpose to describe an item. what it looks like, its name
*/
define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    
    var Item = function(name,texture,position){
        this.id = curId++;
        //TODO: possible make this a container
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.position = position;
        this.name = name;
    }
    

});
