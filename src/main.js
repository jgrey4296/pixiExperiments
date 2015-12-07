require.config({
    baseUrl : '/',
    paths : {
        phaser : 'libs/phaser.min',
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore'
    },
    shim: {
        'phaser' : {
            exports : 'Phaser'
        }
    }
});

//Note: keep phaser as the last require, don't define it, let it be global
require(['underscore','src/GameState/Boot','src/GameState/PreLoadAssets','src/GameState/GameState','phaser'],function(_,Boot,PreLoadAssets,GameState){
    console.log("Phaser based game");

    //Game Creation
    var game = new Phaser.Game(1000,600, Phaser.AUTO,'game-canvas');
    console.log(game);
    //States to add: boot, preload, GameState
    //TODO: load game states parameterised from the scene json?
    game.state.add('Boot',Boot);
    game.state.add('PreLoadAssets',PreLoadAssets);
    game.state.add('GameState',GameState);
    
    //Global stuff to set:
    //game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start("Boot");

    
});
