require.config({
    baseUrl : '/',
    paths : {
        //phaser : 'libs/phaser.min',
        phaser : 'libs/phaser',
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        lodash : "libs/lodash",
        ClingoParser : "libs/ClingoParser",
        Rete : "libs/Rete.min",
        util : "./src/util"
    },
    shim: {
        'phaser' : {
            exports : 'Phaser'
        }
    }
});

require(['src/phaserGame','util'],function(PhaserGame,util){
    //require(['minified/phaserMain.min'],function(PhaserGame){
    util.setDebugFlags('start','hexboard','texture','hexs');
    util.debug('start',()=>console.log('Phaser Based Game'));
    
    //Create the overall game, with size and specified dom element
    var game = new PhaserGame(1000,800,'game-canvas');
});
