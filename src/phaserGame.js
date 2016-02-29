define(['underscore','src/GameState/Boot','src/GameState/PreLoadAssets','src/GameState/GameState','phaser'],function(_,Boot,PreLoadAssets,GameState,Phaser){

    var PhaserGame = function(xSize,ySize,domElement){
        this.game = new Phaser.Game(xSize,ySize,Phaser.AUTO,domElement);

        //States to add: boot, preload, GameState
        //TODO: load game states parameterised from the scene json?
        this.game.state.add('Boot',Boot);
        this.game.state.add('PreLoadAssets',PreLoadAssets);
        this.game.state.add('GameState',GameState);
        
        //Global stuff to set:
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('Boot');
    };

    return PhaserGame;
});
