if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}
/**
   @class Actor
   @purpose To describe an actor. its name, image, facts etc
*/
define(['pixi','underscore'],function(PIXI,_){
    var curId = 0;
    
    var Actor = function(name,texture){
        this.id = curId++;
        //TODO: possible make this a container
        this.sprite = new PIXI.Sprite(texture);
        this.name = name;
        this.facts = [];
    }

    Actor.prototype.move = function(direction,amt){
        console.log("TODO");
    };
    
    Actor.prototype.moveLeft = function(amt){
        if(amt === undefined) amt = 1;
        this.sprite.position.x -= amt;
    };

    Actor.prototype.moveRight = function(amt){
        if(amt === undefined) amt = 1;
        this.sprite.position.y += amt;
    }
    
    

});
