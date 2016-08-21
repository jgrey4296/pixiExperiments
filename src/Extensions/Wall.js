/* jshint esversion : 6 */
define(['lodash','phaser'],function(_,Phaser){

    var Wall = function(game,x,y,key,frame,tint){
        Phaser.TileSprite.call(this,game,x,y,100,100,key);
         if(tint !== undefined){
             this.tint = parseInt(tint,16);
         }
        this.game.physics.enable(this);
        this.body.immovable = true;
        this.body.allowGravity = false;
    };
    Wall.prototype = Object.create(Phaser.TileSprite.prototype);
    Wall.prototype.constructor = Wall;
    
    return Wall;
});
