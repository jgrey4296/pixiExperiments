
define(['underscore','./SpeechBubble','phaser'],function(_,SpeechBubble){

    var Actor = function(game,x,y,key,frame,name,facing){
        console.log("Creating actor: ",name);
        Phaser.Sprite.call(this,game,x,y,key,frame);
        this.name = name;
        this.inventory = {};
        this.facing = facing;
        this.anchor.setTo(.5,1);
        
        if(this.facing === "left") this.flip();
        
        //Speech bubble:
        this.speechBubble = null;

        
    };
    Actor.prototype = Object.create(Phaser.Sprite.prototype);
    Actor.prototype.constructor = Actor;
    
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
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
        if(strength === undefined) strength = 150;
        
        if(direction === 'down'){
            this.body.velocity.y = strength;
        }else if(direction === 'up'){
            this.body.velocity.y = -strength;
        }else if(direction === 'right'){
            this.body.velocity.x = strength;
            if(this.facing === 'left'){
                this.flip();
            }
        }else if(direction === 'left'){
            this.body.velocity.x = -strength;
            if(this.facing === 'right'){
                this.flip();
            }
        }
    };

    
    return Actor;
});
