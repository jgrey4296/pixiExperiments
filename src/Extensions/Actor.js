
define(['underscore','./SpeechBubble','phaser','src/util'],function(_,SpeechBubble,Phaser,util){
    /** Describes an actor, and all information related to it
        @constructor
        @param game,
        @param x
        @param y
        @param key The Asset image
        @param frame The Frame of the asset
        @param name
        @param facing
        @param controllable
        @param width
        @param height
        @alias Actor
        @augments Phaser.Sprite
     */
    var Actor = function(game,x,y,key,frame,name,facing,controllable,width,height){
        console.log("Creating:",name);
        Phaser.Sprite.call(this,game,x,y,key,frame);
        this.name = name;
        this.defaultTexture = key;
        this.currentTexture = key;
        this.inventory = {};
        this.facing = facing || 'right';
        this.controllable = controllable || false;
        this.anchor.setTo(.5,1);
        this.width = width || this.width;
        this.height = height || this.height;
        this.jumpTimer = 0;
        this.defaultStrength = 250;
        this.isInactive = false;
        this.roomIndices = [0,0];
        
        if(this.facing === "left") this.flip();
        
        //Speech bubble:
        this.speechBubble = null;

        //animations
        this.registeredAnimations = {};

        /** Minimum Magnitude */
        this.minMagnitude = 100;
        /** Magnitude Dropbox */
        this.magDrop = 0.5;
        
    };
    Actor.prototype = Object.create(Phaser.Sprite.prototype);
    Actor.prototype.constructor = Actor;

    /**
       @method
     */
    Actor.prototype.updateTexture = function(name){
        if(this.currentTexture === name) return false;
        this.currentTexture = name;
        this.loadTexture(name);
        return true;
    };

    /**
       @method
     */
    Actor.prototype.setupAnimation = function(name,animation){
        if(animation && this.updateTexture(animation[0])){
            this.animations.add(name);
        }        
    };

    /**
       @method
     */
    Actor.prototype.flip = function(){
        if(this.facing === "right") {
            this.facing = "left";
        }else{
            this.facing = "right";
        }
        this.scale.x *= -1;
        if(this.speechBubble) this.speechBubble.scale.x *= -1;
    };

    /**
       @method
    */
    Actor.prototype.say = function(text){
        if(text === undefined && this.speechBubble !== null){
            this.removeChild(this.speechBubble);
            this.speechBubble = null;
        }else if(this.speechBubble === null){
            console.log("Creating speech bubble of: " + text);
            this.speechBubble = new SpeechBubble(this.game,0,-50,256,text);
            this.addChild(this.speechBubble);
        }
    };

    /**
       @method
    */
    Actor.prototype.move = function(direction,strength){
        if(direction === undefined){
            this.body.velocity.x *= 0.8;
        }
        if(strength === undefined) strength = this.defaultStrength;
        
        if(direction === 'down'){
            this.body.velocity.y += strength;
        }else if(direction === 'up'){// &&  this.game.time.now > this.jumpTimer){
            this.body.velocity.y -= strength;
            //this.jumpTimer = this.game.time.now + 750;
        }else if(direction === 'right'){
            this.body.velocity.x += strength;
            this.setupAnimation('walk',this.registeredAnimations['walk']);
            if(this.facing === 'left'){
                this.flip();
            }
        }else if(direction === 'left'){
            this.body.velocity.x -= strength;
            this.setupAnimation('walk',this.registeredAnimations['walk']);
            if(this.facing === 'right'){
                this.flip();
            }
        }

        if(this.body.velocity.getMagnitudeSq() < this.minMagnitude){
            this.animations.stop();
            this.body.velocity.x = 0;
            //this.updateTexture(this.defaultTexture);
        }else{
            if(this.registeredAnimations['walk'] !== undefined){
                this.animations.play('walk',this.registeredAnimations['walk'][1]);
            }
        }
        
    };

    /** update/AI
        @method
    */
    Actor.prototype.update = function(externalInformation){
        //console.log("Updating Actor:",this.name);
        //Generally trend towards 0
        this.body.velocity.x *= this.magDrop;
        this.body.velocity.y *= this.magDrop;

        if(this.body.velocity.getMagnitudeSq() < this.minMagnitude){
            this.body.velocity.setMagnitude(0);
        }
                  
        //     //console.log("Updating: ",this.name);
        //     //var moveDir = _.sample(['left','right'],1);
        //     //this.move(moveDir[0]);

    };

    Actor.prototype.setRoomIndices = function(indices){
        this.roomIndices = indices;
    };
    
    
    return Actor;
});
