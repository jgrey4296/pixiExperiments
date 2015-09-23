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




    //Setup Function, called after assets are loaded
    var setupScene = function(){
        var sprite = new PIXI.Sprite(frames[49]);
        container.addChild(sprite);

    };

    document.addEventListener('keydown',function(event){
        if(container.children.length === 0) return;
        
        if(event.keyCode === 65){
            container.children[0].position.x -= 4;
        }else if(event.keyCode === 68 ){
            container.children[0].position.x += 4;
        }
    });


    //Set it going
    animate();
    function animate(){
        
        renderer.render(container);
        requestAnimationFrame(animate);
    }
    
});
