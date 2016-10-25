/* jshint esversion : 6 */
define(['lodash','phaser'],function(_,Phaser){

    var Wall = function(game,x,y,width,height,key,frame,tint,angle){
        Phaser.TileSprite.call(this,game,x,y,width,height,key);
         if(tint !== undefined){
             this.tint = parseInt(tint,16);
         }
        this.angle = angle;
    };
    Wall.prototype = Object.create(Phaser.TileSprite.prototype);
    Wall.prototype.constructor = Wall;
    
    return Wall;
});
