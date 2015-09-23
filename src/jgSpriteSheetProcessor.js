

define(['pixi'],function(PIXI){
    //Get individual textures from the spritesheet
    var chopUp = function(resources,name,sizeX,sizeY){
        console.log("Processing SpriteSheet:",name);
        var frames = [];
        //the main texture:
        var treeSheet = resources[name].texture;
        //Dimensions:
        var height = treeSheet.height,
            width = treeSheet.width,
            frameWidth = width / sizeX,
            frameHeight = height / sizeY;

        //go left to right, top to bottom:
        for(var j=0; j<height-frameHeight; j+=frameHeight){
            for(var i=0; i<width-frameWidth; i+=frameWidth){
                var tempRect = new PIXI.Rectangle(i,j,frameWidth,frameHeight);
                frames.push(new PIXI.Texture(treeSheet.baseTexture,tempRect));
            }
        }
        console.log("Processed, got " + frames.length + " frames");
        return frames;
    };

    return chopUp;
});
