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
require(['./src/jgSpriteSheetProcessor','underscore','json!../data/assets.json','json!../data/scene1.json','phaser'],function(SheetProcessor,_,assets,scene1){
    console.log("Pixi Tests");
    console.log("Assets:",assets);
    console.log("Scene 1:",scene1);

    //Globals
    var pig,platforms,cursors;
    

    //Game Creation
    var game = new Phaser.Game(1000,900, Phaser.AUTO,'game-canvas',{
        //Prior to game creation
        preload : function(){
            assets.forEach(function(asset){
                console.log("registering:",asset);
                if(asset.type === "image"){
                    console.log("Loading image:",asset.name);
                    game.load.image(asset.name,"data/"+asset.fileName);
                }else if(asset.type === "spritesheet"){
                    console.log("Loading spritesheet: ",asset.name);
                    game.load.spritesheet(asset.name,"data/"+asset.fileName,asset.frames.x,asset.frames.y);
                }else{
                    console.log("Unknown type");
                }
            });
        },
        //Setup the game
        create : function(){
            console.log("Creating");
            //Main elements setup:
            game.physics.startSystem(Phaser.Physics.ARCADE);

            cursors = game.input.keyboard.createCursorKeys();

            //Scene specific setup:
            pig = game.add.sprite(0,0,'pig',23);
            game.physics.arcade.enable(pig);
            pig.body.bounce.y = 0.2;
            pig.body.gravity.y = 300;
            pig.body.collideWorldBounds = true;
            
            game.add.sprite(800,400,'tree',1);

            platforms = game.add.group();
            platforms.enableBody = true;

            var ground = platforms.create(0,game.world.height - 64, 'simpleTile');
            ground.scale.setTo((1000 / 32), 1);
            ground.body.immovable = true;

            var ledge = platforms.create(0,game.world.height - 300,'simpleTile');
            ledge.scale.setTo(400/32, 1);
            ledge.body.immovable = true;
            
        },
        //Update function
        update : function(){
            game.physics.arcade.collide(pig,platforms);
          

            if(cursors.left.isDown){
                pig.body.velocity.x = -150;
            }else if(cursors.right.isDown){
                pig.body.velocity.x = 150;
            }else{
                pig.body.velocity.x = 0;
            }

            if(cursors.up.isDown && pig.body.touching.down){
                pig.body.velocity.y = -350;
            }
            
            
        }        
    });

    //Setup Function, called after assets are loaded
    var setupScene = function(scene){
        console.log("Setting up Scene: ",scene);
        //setup rooms
        scene.forEach(function(room){
            console.log("Need to setup:",room);
        });

    };

    
});
