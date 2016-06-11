define(['lodash','phaser'],function(_,Phaser){
    /**
       The Boot State
       @constructor
       @param game
       @alias GameStates/Boot
       @implements Phaser.State
     */
    var Boot = function(game){
        this.game = game;
    };

    /**
       Load any images needed for the state
       @method
     */
    Boot.prototype.preload = function(){
        //load a loading bar image
        this.game.load.image("loadImage","data/loadImage.png");
        //Turn on for debugging:
        //this.game.time.advancedTiming = true;
    };

    /** Create the state, rendering a loading bar
        @method  
    */
    Boot.prototype.create = function(){
        console.log("Booting");
        //add the loading bar to the screen
        //Transition to next state
        this.loadBar = this.add.sprite(0,this.game.height/2,'loadImage');
        this.loadBar.anchor.setTo(0.5,0.5);
        this.loadBarTween = this.game.add.tween(this.loadBar).to({x:this.game.width},
                                                                 1000, Phaser.Easing.Quadratic.InOut, false);
        this.loadBarTween.onComplete.add(function(){
            //transition to the preload assets state:
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
