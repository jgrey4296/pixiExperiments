
define(['underscore','phaser'],function(_,Phaser){

    /**
       An Item component
       @constructor
       @param game
       @param x
       @param y
       @param key
       @param frome
       @param name
       @alias Item
       @augments Phaser.Sprite
     */
    var Item = function(game,x,y,key,frame,name){
        console.log(x,y,key,frame,name);
        Phaser.Sprite.call(this,game,x,y,key,frame);
        this.name = name;
    };
    Item.prototype = Object.create(Phaser.Sprite.prototype);
    Item.prototype.constructor = Item;


    
    return Item;
});
