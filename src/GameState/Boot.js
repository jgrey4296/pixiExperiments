define(['underscore','phaser'],function(_){

    var Boot = function(game){
        
    };

    Boot.prototype.preload = function(){
        //load a loading bar
    };

    Boot.prototype.create = function(){
        //add the loading bar to the screen
        //Transition to next state
        this.game.state.start('PreLoadAssets');
    };

    Boot.prototype.update = function(){

    };

    return Boot;
});
