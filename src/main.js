require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore'
    },
});


require(['pixi','./src/jgSpriteSheetProcessor','underscore','json!../data/assets.json','json!../data/scene1.json','./src/gameModel/gameModel'],function(PIXI,SheetProcessor,_,assets,scene1,GameModel){
    console.log("Pixi Tests");
    console.log("Assets:",assets);
    console.log("Scene 1:",scene1);
    //global Renderer:
    var renderer = PIXI.autoDetectRenderer(
        1000,
        900,
        {view: document.getElementById("game-canvas")}
    );
    //The game model
    var gameModel = new GameModel();
    //The main Scene
    var mainContainer = new PIXI.Container();
    //Loaded frames of assets;
    var loadedAssets = {};
    //Current sprites:
    var currentSprites = {};
    
    assets.forEach(function(asset){
        console.log("registering:",asset.name);
        PIXI.loader.add(asset.name,"data/"+asset.fileName);
    });

    //Everything registered, time to load:
    PIXI.loader
        .load(function(loader,resources){
            console.log("resources:",resources);
            //For each asset, slice into a spritesheet
            assets.forEach(function(asset){
                loadedAssets[asset.name] = SheetProcessor(resources,asset.name,asset.frames.x,
                                                   asset.frames.y);
            });
            
            setupScene();
        });


    //------------------------------
    //Scene setup CALLED AFTER ASSETS ARE LOADED
    //------------------------------
    
    //Setup Function, called after assets are loaded
    var setupScene = function(){
        console.log("Setting up Scene: ",scene1);
        //setup rooms
        scene1.forEach(function(room){
            gameModel.addRoom(room,loadedAssets);
        });
        
        //Add the gameModel to the main container
        mainContainer.removeChildren();
        mainContainer.addChild(gameModel);
    };



    //------------------------------
    //User input setup
    //------------------------------
    var actions = {
        "moveLeft" : function(){
            gameModel.moveActor("bob","left");
        },
        "moveRight" : function(){
            gameModel.moveActor("bob","right");
        },
        "interact" : function(){

        },
        "openMenu" : function(){

        },
        "restart" : function(){

        }
    };

    
    document.addEventListener('keydown',function(event){
        if(mainContainer.children.length === 0) return;

        //TODO:keys for movement change the model

        //move left and right
        if(event.keyCode === 65){
            console.log("Left");
            actions['moveLeft']();
            //gameModel.moveActor(gameModel.player,'left');
        }else if(event.keyCode === 68 ){
            console.log("Right");
            actions['moveRight']();
            //gameModel.moveActor(gameModel.player,'right');
        }else if(event.keyCode === 87){
            console.log("up");
        }else if(event.keyCode === 83){
            console.log("down");
        }else{
            console.log(event.keyCode);
        }

        //TODO: interact, jump?
        
    });



    //------------------------------
    //Trigger animations
    //------------------------------
    animate();
    function animate(){
        //run AI on every n frame...
        gameModel.gameLoop();
        renderer.render(mainContainer);
        requestAnimationFrame(animate);
    }
    
});
