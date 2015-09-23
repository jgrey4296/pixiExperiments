require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi'
    },
});


require(['pixi','jgTextureLoader'],function(PIXI,jgTextureLoader){
    console.log("test",PIXI);
    var renderer = PIXI.autoDetectRenderer(
        512,
        384,
        {view: document.getElementById("game-canvas")}
    );

    var texture = PIXI.Texture.fromImage('data/bg-far.png');
    var background = new PIXI.extras.TilingSprite(texture,512,256);

    var rockTexture = PIXI.Texture.fromImage('data/glitch_rock_metal.png');
    var rock = new PIXI.Sprite(rockTexture);

    var container = new PIXI.Container();
    container.addChild(background);
    //container.addChild(rock);

    var treeTextures = PIXI.Texture.fromImage('data/glitch_tree_sheet.png');
    var subTexture = new PIXI.Texture(treeTextures,new PIXI.Rectangle(256,0,256,256));
    var tree = new PIXI.Sprite(subTexture);
    container.addChild(tree);
    
    animate();
    function animate(){
        //rock.position.x += 0.5;
        background.tilePosition.x -= 0.5
        renderer.render(container);
        requestAnimationFrame(animate);
    }
    
});
