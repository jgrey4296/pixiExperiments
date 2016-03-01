define(['underscore','phaser'],function(_,Phaser){

    /**
       Door component
       @constructor
       @param game
       @param x
       @param y
       @param key
       @param name
       @param connection
       @alias Door
       @augments Phaser.Sprite
     */
    var Door = function(game,x,y,key,name,connection){
        Phaser.Sprite.call(this,game,x,y,key);
        this.name = name;
        this.connection = connection;
    };
    Door.prototype = Object.create(Phaser.Sprite.prototype);
    Door.prototype.constructor = Door;

    return Door;
    
});
