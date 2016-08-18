/* jshint esversion : 6 */
define(['lodash','./Actor','./Item','./Door','util','phaser'],function(_,Actor,Item,Door,util,Phaser){

    const polygonNumber = 6,
          flatTopped = false;
    /**
       A Simple Hexagon Texture constructor
       @constructor
       @param game
       @param name
       @alias Room
       @augments Phaser.Group
     */
    var Hexagon = function(game,radius,fillColour,fillAlpha,strokeColour){
        util.debug('texture',()=>console.log(`Creating Hex Texture of size: ${radius}`));
        Phaser.Graphics.call(this,game,null);
        radius = radius || 5;
        fillColour = fillColour || 0xFFFFFF;
        strokeColour = strokeColour || 0xFF00FF;
        
        //Draw a shape:
        this.lineStyle(5,strokeColour,1);

        let start = util.calcPoint([0,0],radius,0,polygonNumber,flatTopped),
            //Calculate the path for a hexagon
            path = Array(polygonNumber).fill(0).map((d,i)=>{
                let p1 = util.calcPoint([0,0],radius,i,polygonNumber,flatTopped);
                return new Phaser.Point(p1[0],p1[1]);
            });
        //link back to the beginning
        path.push(new Phaser.Point(start[0],start[1]));

        console.log("TEXTURE VALUES:",fillColour,fillAlpha,strokeColour);
        this.beginFill(fillColour,fillAlpha)
        this.drawPolygon(path);
        this.endFill();
    };
    
    Hexagon.prototype = Object.create(Phaser.Graphics.prototype);
    Hexagon.prototype.constructor = Hexagon;

    return Hexagon;
});
