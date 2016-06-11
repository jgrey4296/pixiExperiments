define(['lodash','json!data/assets.json','phaser'],function(_,assets,Phaser){
    /**
       Preload Assets
       @constructor
       @param game
       @alias GameStates/PreLoadAssets
       @implements Phaser.State
     */
    var PreLoadAssets = function(game){
        this.game = game;
    };

    /**
       Load everything required, from data/assets.json
       @method
     */
    PreLoadAssets.prototype.preload = function(){
        console.log("Preloading");
        //Load everything speciied in the assets json
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

    /**
       Starts on completion
     */
    PreLoadAssets.prototype.create = function(){
        //Everything has been loaded, go to the actual game
        this.game.state.start('GameState');
    };

    PreLoadAssets.prototype.update = function(){
    };

    return PreLoadAssets;
});
