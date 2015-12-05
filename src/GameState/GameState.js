define(['json!data/scene1.json','underscore','phaser'],function(scene,_){

    //The game state to describe a room you are in
    var GameState = function(game){
        this.game = game;
        //Current State info:
        this.currentRoom = null;
        this.controllableActor = null;

        //All available info:
        this.rooms = {};
        this.actors = {};

        //Reasoning / AI
        this.rete = null;
        
    };

    GameState.prototype.init = function(){
        //Setup the reasoning system / RETE
    };
    
    GameState.prototype.preload = function(){
        scene.forEach(function(room){
            //create the room groups and store them
        });

    };

    GameState.prototype.create = function(){
        //set the starting room
    };

    GameState.prototype.update = function(){
        //game logic
        
    };

    
});
