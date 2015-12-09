
define('underscore','phaser'],function(_){

    var Room = function(game,x,y,key,frame){
        Phaser.Sprite.call(this,game,x,y,key,frame);
    }

    Room.prototype = Object.create(Phaser.Sprite.prototype);
    Room.prototype.constructor = Room;
    
    return Room;

});
