define(['underscore','phaser'],function(_,Phaser){

    var Door = function(game,x,y,key,name,connection){
        Phaser.Sprite.call(this,game,x,y,key);
        this.name = name;
        this.connection = connection;
    };
    Door.prototype = Object.create(Phaser.Sprite.prototype);
    Door.prototype.constructor = Door;

    return Door;
    
});
