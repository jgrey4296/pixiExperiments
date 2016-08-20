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
        Phaser.Group.call(this,game);
        this.x = position.x;
        this.y = position.y;
        this.index = index;
        this.offset = HexLib.indexToOffset(index);
        this.cube = HexLib.offsetToCube(this.offset);
        this.radius = radius;
        this.name = name;
        let hexSprite = new Phaser.Sprite(game,0,0,texture);
        hexSprite.anchor.set(0.5);
        this.add(hexSprite);
        this.neighbours = [null,null,null,null,null,null];
        
    };
    Hexagon.prototype = Object.create(Phaser.Group.prototype);
    Hexagon.prototype.constructor = Hexagon;

    Hexagon.prototype.calculateDoorsAndWalls = function(neighbours){
        //going anti-clockwise from top
        for(var i = 0; i < neighbours.length; i++){
            let start = util.calcPoint([0,0],this.radius,i,6,false),
                end = util.calcPoint([0,0],this.radius,i % 6,6,false);
            if(neighbours[i] !== null){
                this.neighbours[i] = neighbours[i]; //populate the neighbour link
                //create a door
                //let newDoor = new Door(game,start,end);
                //this.add(newDoor);
            }else{
                //create a wall
                //let newWall = new Wall(game,start,end);
                //this.add(newWall);
            }
        }
    };

    Hexagon.prototype.addAgent = function(agent){

    };

    Hexagon.prototype.update = function(){

    };
    
    return Hexagon;
});
