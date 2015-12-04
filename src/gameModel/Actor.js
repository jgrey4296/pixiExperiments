if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}
/**
   @class Actor
   @purpose To describe an actor. its name, image, facts etc
*/
define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    var defaultAmt = 2;
    
    /**
       @class Actor
       @extends PIXI.Sprite
       @purpose a sprite the represents an agent in the game model
     */
    var Actor = function(name,texture,position){
        PIXI.Sprite.call(this,texture);
        this.id = curId++;
        this.name = name;
        this.facts = [];
        this.anchor = new PIXI.Point(0.5,0.5);
        this.position = position;
    };
    Actor.prototype = Object.create(PIXI.Sprite.prototype);
    Actor.prototype.constructor = Actor;
    

    Actor.prototype.move = function(direction,amt){
        if(direction === "left") this.moveLeft(amt);
        if(direction === "right") this.moveRight(amt);
        if(direction === "up") this.moveUp(amt);
        if(direction === "down") this.moveDown(amt);
        
    };
    
    Actor.prototype.moveLeft = function(amt){
        if(amt === undefined) amt = defaultAmt;
        this.position.x -= amt;
    };

    Actor.prototype.moveRight = function(amt){
        if(amt === undefined) amt = defaultAmt;
        this.position.x += amt;
    };

    Actor.prototype.moveUp = function(amt){
        if(amt === undefined) amt = defaultAmt;
        this.position.y += amt;
    };

    Actor.prototype.moveDown = function(amt){
        if(amt === undefined) amt = defaultAmt;
        this.position.y -= amt;
    };
    
    return Actor;

});
