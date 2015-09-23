require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi'
    },
});


require(['pixi','./src/jgSpriteSheetProcessor'],function(PIXI,SheetProcessor){
    console.log("Pixi Tests");
    //global Renderer:
    var renderer = PIXI.autoDetectRenderer(
        512,
        384,
        {view: document.getElementById("game-canvas")}
    );

    //The main Scene
    var container = new PIXI.Container();
    //Loaded frames of a spritesheet;
    var frames = [];
    
    PIXI.loader
    //Add Assets
        .add('treeSheet','data/glitch_tree_sheet.png')
    //Once Loaded:
        .load(function(loader,resources){
            frames = SheetProcessor(resources,'treeSheet',11,6);
            
            setupScene();
        });

    var setupScene = function(){
        var sprite = new PIXI.Sprite(frames[49]);
        container.addChild(sprite);

    };

    
    animate();
    function animate(){
        
        renderer.render(container);
        requestAnimationFrame(animate);
    }
    
});
