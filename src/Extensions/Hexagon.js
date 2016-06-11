/* jshint esversion : 6 */
define(['lodash','../HexLib/HexLib','../util','phaser'],function(_,HexLib,util,Phaser){
    
    /**
       A Simple Hexagon constructor
       @constructor
       @param game
       @param name
       @param radius
       @param idents { index: , boardSize: [] }
       @augments Phaser.Sprite
     */
    var Hexagon = function(game,name,radius,index){
        //calculate the position and texture:
        let position = HexLib.indexToPosition(index,radius),
            texture = game.cache.getRenderTexture(util.hexTexture(radius)).texture;
        //Create the sprite, with the position and texture as appropriate
        Phaser.Sprite.call(this,game,position.x,position.y,texture);
        this.index = index;
        this.offset = HexLib.indexToOffset(index);
        this.cube = HexLib.offsetToCube(this.offset);
        this.radius = radius;
        this.name = name;
        this.anchor.set(0.5);
        
    };
    Hexagon.prototype = Object.create(Phaser.Sprite.prototype);
    Hexagon.prototype.constructor = Hexagon;

    return Hexagon;
});
