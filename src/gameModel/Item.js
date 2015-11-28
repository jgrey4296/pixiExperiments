if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}
/**
   @class Item
   @purpose to describe an item. what it looks like, its name
*/
define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    
    var Item = function(name,texture){
        this.id = curId++;
        this.sprite = new PIXI.Sprite(texture);
        this.name = name;
    }
    

});
