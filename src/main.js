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
    var container = new PIXI.Container();
    //Loaded frames of assets;
    var frames = {};

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
                frames[assetName] = SheetProcessor(resources,assetName,assets[assetName].frames.x,
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

        //link rooms
        
        //setup items in rooms

        //setup actors in rooms

                
        //For each sprite in the scene1 json, create and place the sprite
        _.keys(scene1).forEach(function(spriteName){
            var spriteData = scene1[spriteName];
            var sprite = new PIXI.Sprite(frames[spriteData.assetName][spriteData.frame]);
            sprite.position = spriteData.position;
            container.addChild(sprite);
            currentSprites[spriteName] = sprite;
            
        });
    };



    //------------------------------
    //User input setup
    //------------------------------
    document.addEventListener('keydown',function(event){
        if(container.children.length === 0) return;

        //TODO:keys for movement change the model
        
        if(event.keyCode === 65){
            currentSprites['tree'].position.x -= 4;
        }else if(event.keyCode === 68 ){
            currentSprites['tree'].position.x += 4;
        }
    });



    //------------------------------
    //Trigger animations
    //------------------------------
    animate();
    function animate(){
        
        renderer.render(container);
        requestAnimationFrame(animate);
    }
    
});
