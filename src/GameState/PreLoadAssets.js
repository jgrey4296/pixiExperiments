define(['underscore','json!data/assets.json','phaser'],function(_,assets){

    var PreLoadAssets = function(game){
        console.log("Preload ctor:",game);
        this.game = game;
    };

    PreLoadAssets.prototype.preload = function(){
        console.log("Preloading");
        assets.forEach(function(asset){
            if(asset.type === "image"){
                this.game.load.image(asset.name,"data/"+asset.fileName);
            }else if(asset.type === "spritesheet"){
                this.game.load.spritesheet(asset.name,"data/"+asset.fileName,asset.frames.x,asset.frames.y);
            }else if(asset.type === "bitmapfont"){
                this.game.load.bitmapFont(asset.name,asset.url,null,asset.data);
            }else{
                console.log("Unknown asset type: ",asset);
            }
        },this);
        console.log("Loaded:",assets);
    };

    PreLoadAssets.prototype.create = function(){
        //Everything has been loaded, go to the actual game
        this.game.state.start('GameState');
    };

    PreLoadAssets.prototype.update = function(){

    };


    return PreLoadAssets;
});
