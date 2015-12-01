require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore'
    },
});


require(['pixi','./src/jgSpriteSheetProcessor','underscore','json!../data/assets.json','json!../data/scene1.json','gameModel/gameModel'],function(PIXI,SheetProcessor,_,assets,scene1,GameModel){
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
    
    _.keys(assets).forEach(function(assetName){
        console.log("registering:",assetName);
        PIXI.loader.add(assetName,"data/"+assets[assetName].fileName);
    });

    //Everything registered, time to load:
    PIXI.loader
        .load(function(loader,resources){
            console.log("resources:",resources);
            //For each asset, slice into a spritesheet
            _.keys(assets).forEach(function(assetName){
                loadedAssets[assetName] = SheetProcessor(resources,assetName,assets[assetName].frames.x,
                                                   assets[assetName].frames.y);
            });
            
            setupScene();
        });


    //------------------------------
    //Scene setup CALLED AFTER ASSETS ARE LOADED
    //------------------------------
    
    //Setup Function, called after assets are loaded
    var setupScene = function(){
        //setup rooms
        _.keys(scene1).forEach(function(roomName){
            gameModel.addRoom(scene1[roomName],loadedAssets);
        });
                
        //Add the first room to the main container
        mainContainer.addChild(gameModel.container);
    };



    //------------------------------
    //User input setup
    //------------------------------
    var actions = {
        "moveLeft" : function(){

        },
        "moveRight" : function(){

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
            //left
            //gameModel.moveActor(gameModel.player,'left');
        }else if(event.keyCode === 68 ){
            //right
            //gameModel.moveActor(gameModel.player,'right');
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
