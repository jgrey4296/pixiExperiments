
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
    
    
    return Actor;
});
