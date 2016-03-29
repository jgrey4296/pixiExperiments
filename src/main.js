require.config({
    baseUrl : '/',
    paths : {
        phaser : 'libs/phaser.min',
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore-min',
        ClingoParser : "libs/ClingoParser",
        Rete : "libs/Rete.min"
        
    },
    shim: {
        'phaser' : {
            exports : 'Phaser'
        }
    }
});

require(['src/phaserGame'],function(PhaserGame){
//require(['minified/phaserMain.min'],function(PhaserGame){
    console.log("Phaser based game");
    //Create the overall game, with size and specified dom element
    var game = new PhaserGame(1000,800,'game-canvas');
});
