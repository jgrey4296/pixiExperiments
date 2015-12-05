define(['underscore','json!data/assets.json','phaser'],function(_,assets){

    var PreLoadAssets = function(game){};

    PreLoadAssets.prototype.preload = function(){
        assets.forEach(function(asset){
            if(asset.type === "image"){
                this.game.load(asset.name,"data/"+asset.fileName);
            }else if(asset.type === "spritesheet"){
                this.game.load(asset.name,"data/"+asset.fileName,asset.frames.x,asset.frames.y);
            }else{
                console.log("Unknown asset type: ",asset);
            }
        });
    };

    PreLoadAssets.prototype.create = function(){
        //Everything has been loaded, go to the actual game
        this.game.state.start('GameState');
    };

    PreLoadAssets.prototype.update = function(){

    };

    
});
