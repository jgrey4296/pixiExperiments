require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi',
        text : 'libs/text',
        json : "libs/json",
        underscore : 'libs/underscore'
    },
});


require(['pixi','./src/jgSpriteSheetProcessor','underscore','json!../data/assets.json','json!../data/scene1.json'],function(PIXI,SheetProcessor,_,assets,scene1){
    console.log("Pixi Tests");
    console.log("Assets:",assets);
    console.log("Scene 1:",scene1);
    //global Renderer:
    var renderer = PIXI.autoDetectRenderer(
        1000,
        1000,
        {view: document.getElementById("game-canvas")}
    );

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
        _.keys(scene1).forEach(function(spriteName){
            var spriteData = scene1[spriteName];
            var sprite = new PIXI.Sprite(frames[spriteData.assetName][spriteData.frame]);
            container.addChild(sprite);
            currentSprites[spriteName] = sprite;
            
        });
    };



    //------------------------------
    //User input setup
    //------------------------------
    document.addEventListener('keydown',function(event){
        if(container.children.length === 0) return;
        
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
