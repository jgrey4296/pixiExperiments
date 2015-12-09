
define(['underscore','phaser'],function(_){

    var Item = function(game,x,y,key,frame,name){
        Phaser.Sprite.call(this,game,x,y,key,frame);
    };
    Item.prototype.Object = Object.create(Phaser.Sprite.prototype);
    Item.prototype.constructor = Item;


    
    return Item;
});
