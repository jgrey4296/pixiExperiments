
define(['underscore','phaser'],function(_,Phaser){

    var Item = function(game,x,y,key,frame,name){
        console.log(x,y,key,frame,name);
        Phaser.Sprite.call(this,game,x,y,key,frame);
        this.name = name;
    };
    Item.prototype = Object.create(Phaser.Sprite.prototype);
    Item.prototype.constructor = Item;


    
    return Item;
});
