define(['pixi'],function(PIXI){
    //Get individual textures from the spritesheet
    var chopUp = function(resources,name,sizeX,sizeY){
        console.log("Processing SpriteSheet:",name);
        var frames = [];
        //the main texture:
        var spriteSheet = resources[name].texture;

        if(sizeX === 1 && sizeY === 1){
            console.log("Sizes are 1, returning just the texture itself");
            return [spriteSheet];
        }
        
        //Dimensions:
        var height = spriteSheet.height,
            width = spriteSheet.width,
            frameWidth = width / sizeX,
            frameHeight = height / sizeY;

        //go left to right, top to bottom:
        for(var j=0; j<height-frameHeight; j+=frameHeight){
            for(var i=0; i<width-frameWidth; i+=frameWidth){
                var tempRect = new PIXI.Rectangle(i,j,frameWidth,frameHeight);
                frames.push(new PIXI.Texture(spriteSheet.baseTexture,tempRect));
            }
        }
        console.log("Processed, got " + frames.length + " frames");
        return frames;
    };

    return chopUp;
});
