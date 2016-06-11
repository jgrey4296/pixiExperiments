({
    //http://www.sitepoint.com/building-library-with-requirejs/
    baseUrl: "./",
    paths : {
        requireLib : "node_modules/requirejs/require",
        lodash : "libs/lodash",
        //phaser
        phaser : 'libs/phaser.min',
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        util : "src/util"
    },
    shim: {
        'phaser' : {
            exports : 'Phaser'
        }
    },
    exclude : ['underscore','phaser','pixi'],
    //keepAmdefine : true,
    include : ['node_modules/almond/almond','src/phaserGame','phaser'],
    //cjsTranslate : true,
    name : "src/phaserGame",
    //insertRequire : [ "src/phaserGame"],
    out: "./minified/phaserMain.min.js",
    optimize: "none",
    wrap : {
        startFile : "startWrap.js",
        end : "define('underscore',function() { return _; }); \ndefine('phaser',function(){return Phaser; }); \nreturn require('src/phaserGame'); }));"
    },
});
