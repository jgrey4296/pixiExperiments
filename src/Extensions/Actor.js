
define(['underscore','./SpeechBubble','phaser'],function(_,SpeechBubble,Phaser){

    var Actor = function(game,x,y,key,frame,name,facing,controllable,width,height){
        console.log(name);
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
        
        if(this.facing === "left") this.flip();
        
        //Speech bubble:
        this.speechBubble = null;

        //animations
        this.registeredAnimations = {};
        
    };
    Actor.prototype = Object.create(Phaser.Sprite.prototype);
    Actor.prototype.constructor = Actor;

    Actor.prototype.updateTexture = function(name){
        if(this.currentTexture === name) return false;
        this.currentTexture = name;
        this.loadTexture(name);
        return true;
    };

    Actor.prototype.setupAnimation = function(name,animation){
        if(animation && this.updateTexture(animation[0])){
            this.animations.add(name);
        }        
    };
    
    Actor.prototype.flip = function(){
        if(this.facing === "right") {
            this.facing = "left";
        }else{
            this.facing = "right";
        }
        this.scale.x *= -1;
        if(this.speechBubble) this.speechBubble.scale.x *= -1;
    }

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
    
    Actor.prototype.move = function(direction,strength){
        if(direction === undefined){
            this.body.velocity.x *= 0.5;
        }
        if(strength === undefined) strength = 150;
        
        if(direction === 'down'){
            this.body.velocity.y += strength;
        }else if(direction === 'up' &&  this.game.time.now > this.jumpTimer){
            this.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now + 750;
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

        if(Math.abs(this.body.velocity.x) < 25){
            this.animations.stop();
            //this.updateTexture(this.defaultTexture);
        }else{
            if(this.registeredAnimations['walk'] !== undefined){
                this.animations.play('walk',this.registeredAnimations['walk'][1]);
            }
        }
        
    };


    //update/AI
    Actor.prototype.update = function(externalInformation){
        if(this.body.velocity.x < 15){
            console.log("Updating: ",this.name);
            var moveDir = _.sample(['left','right'],1);
            this.move(moveDir[0]);
        }

    };

    
    
    return Actor;
});
