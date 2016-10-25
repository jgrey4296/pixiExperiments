/* jshint esversion : 6 */
define(['lodash','../HexLib/HexLib','../util','./Wall','phaser'],function(_,HexLib,util,Wall,Phaser){
    
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
        Phaser.Group.call(this,game,null,name);
        this.position = new Phaser.Point(position.x,position.y);
        // this.x = Math.floor(position.x);
        // this.y = Math.floor(position.y);
        this.index = index;
        this.offset = HexLib.indexToOffset(index);
        this.cube = HexLib.offsetToCube(this.offset);
        this.radius = radius;
        this.neighbours = [null,null,null,null,null,null];
        this.active = false;
        //The various elements of the hexagon. actors, walls, doors etc
        this.subGroups = {};

        let hexSprite = new Phaser.Sprite(game,0,0,texture);
        hexSprite.anchor.set(0.5);
        //this.add(hexSprite);
        this.addToSubGroup('sprites',hexSprite);

        this.buildWall(4);
        this.buildWall(1);
        //this.buildWall(2);
        
    };
    Hexagon.prototype = Object.create(Phaser.Group.prototype);
    Hexagon.prototype.constructor = Hexagon;

    Hexagon.prototype.calculateDoorsAndWalls = function(neighbours){
        //going anti-clockwise from top
        for(var i = 0; i < neighbours.length; i++){
            let start = util.calcPoint([0,0],this.radius,i,6,false),
                end = util.calcPoint([0,0],this.radius,i % 6,6,false);
            if(neighbours[i] !== null && neighbours[i].active === true){
                this.neighbours[i] = neighbours[i]; //populate the neighbour
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
        if(!this.active) { return; }
        let i = this.children.length,
            curr;
        while(i--){
            curr = this.children[i];
            if(curr.isInactive){
                continue;
            }
            curr.update();
        }
    };
    
    Hexagon.prototype.addSubGroup = function(name){
        if(this.subGroups[name] === undefined){
            this.subGroups[name] = new Phaser.Group(this.game,this,name);
        }
        return this.subGroups[name];
    };

    Hexagon.prototype.addToSubGroup = function(name,obj){
        let target = this.addSubGroup(name);
        target.add(obj);
    };

    Hexagon.prototype.buildWall = function(i){
        let distance = Math.sin(((2 * Math.PI) / 6) * i) * this.radius,
            wall = new Wall(this.game,distance,this.radius*-0.5,10,this.radius,'simpleTile',null,0x33FF11);
        this.addToSubGroup('walls',wall);


    };


    return Hexagon;
});
