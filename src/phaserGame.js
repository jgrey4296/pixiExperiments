define(['underscore','src/GameState/Boot','src/GameState/PreLoadAssets','src/GameState/GameState','phaser',"Rete"],function(_,Boot,PreLoadAssets,GameState,Phaser,Rete){

    /**
       The main class that encapsulates the entire game
       @constructor
       @param xSize
       @param ySize
       @param domElement
       @extends Phaser.Game;
       @exports PhaserGame
     */
    var PhaserGame = function(xSize,ySize,domElement){
        Phaser.Game.call(this,xSize,ySize,Phaser.AUTO,domElement);

        //todo: register game specific actions
        this.reteNet = new Rete();
                
        //Add available states to the game as a whole:
        this.state.add('Boot',Boot);
        this.state.add('PreLoadAssets',PreLoadAssets);
        this.state.add('GameState',GameState);
        
        //Start on a state:
        this.state.start('Boot');
    };
    PhaserGame.prototype = Object.create(Phaser.Game.prototype);
    PhaserGame.constructor = PhaserGame;
    
    return PhaserGame;
});
