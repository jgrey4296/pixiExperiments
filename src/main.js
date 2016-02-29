require.config({
    baseUrl : '/',
    paths : {
        phaser : 'libs/phaser.min',
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore-min'
    },
    shim: {
        'phaser' : {
            exports : 'Phaser'
        }
    }
});

//Note: keep phaser as the last require, don't define it, let it be global
/**
   @module Phaser/Main
 */
//require(['src/phaserGame'],function(PhaserGame){
require(['minified/phaserMain.min'],function(PhaserGame){
    console.log("Phaser based game");

    //Game Creation
    var game = new PhaserGame(1000,600,'game-canvas');
    console.log(game);
});
