define(['underscore','src/GameState/Boot','src/GameState/PreLoadAssets','src/GameState/GameState','phaser'],function(_,Boot,PreLoadAssets,GameState,Phaser){

    /**
       The main class that encapsulates the entire game
       @constructor
       @param xSize
       @param ySize
       @param domElement
       @exports PhaserGame
     */
    var PhaserGame = function(xSize,ySize,domElement){
        this.game = new Phaser.Game(xSize,ySize,Phaser.AUTO,domElement);

        
        //Add available states to the game as a whole:
        this.game.state.add('Boot',Boot);
        this.game.state.add('PreLoadAssets',PreLoadAssets);
        this.game.state.add('GameState',GameState);
        
        //Global stuff to set:
        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //Start on a state:
        this.game.state.start('Boot');
    };

    return PhaserGame;
});
