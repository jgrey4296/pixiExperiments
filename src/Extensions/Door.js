define(['lodash','phaser'],function(_,Phaser){

    /**
       Door component
       @constructor
       @param game
       @param x
       @param y
       @param key
       @param connectionIndex The indices of the room to connect to
       @param connectionObject The object to connect to itself
       @param position The position in the room the door exists in. n/s/e/w
       @alias Door
       @augments Phaser.Sprite
     */
    var Door = function(game,x,y,key,connectionIndex,connectionObject,position){
        //console.log("Creating door");
        Phaser.Sprite.call(this,game,x,y,key);
        this.connection = connectionIndex;
        this.connectionObject = connectionObject;
        this.compassPosition = position;
        this.anchor.setTo(.5,.5);
    };
    Door.prototype = Object.create(Phaser.Sprite.prototype);
    Door.prototype.constructor = Door;

    Door.prototype.positionOffset = function(){
        let x = this.x,
            y = this.y;
        return [x,y];
    };
    
    return Door;
    
});
