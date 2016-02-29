define(['underscore','phaser'],function(_){

    var Boot = function(game){
    };

    Boot.prototype.preload = function(){
        //load a loading bar image
        this.game.load.image("loadImage","data/loadImage.png");
        //Turn on for debugging:
        //this.game.time.advancedTiming = true;
    };

    Boot.prototype.create = function(){
        console.log("Booting");
        //add the loading bar to the screen
        //Transition to next state
        this.loadBar = this.add.sprite(0,this.game.height/2,'loadImage');
        this.loadBar.anchor.setTo(0.5,0.5);
        this.loadBarTween = this.game.add.tween(this.loadBar).to({x:this.game.width},
                                                                 1000, Phaser.Easing.Quadratic.InOut, false);
        this.loadBarTween.onComplete.add(function(){
            this.game.state.start('PreLoadAssets');
        },this);
        this.loadBarTween.start();
        //this.game.state.start('PreLoadAssets');
    };

    Boot.prototype.update = function(){

    };

    Boot.prototype.render = function(){
        //this.game.debug.text(this.game.time.fps || '--', 2, 14, "#ffffff");
        //console.log("FPS:",game.time.fps);

    };

    
    return Boot;
});
