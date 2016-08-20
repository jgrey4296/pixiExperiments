
/* jshint esversion : 6 */
define(['json!data/setup/scene1.json','lodash','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser','text!data/mazePaths','ClingoParser','../Extensions/HexBoard','../Extensions/HexTexture','util','../Extensions/Hexagon','../HexLib/HexLib'],function(scene,_,SpeechBubble,Actor,Room,Phaser,mazeSets,ClingoParser,HexBoard,HexTexture,util,Hexagon,HexLib){

    /**
       Main state of a game. In this case emulating BoI, loaded from data/scene1.json
       @constructor
       @alias GameStates/GameState
       @implements Phaser.State
     */
    var GameState = function(game){
        /** The physics type of the game */
        this.physicsType = Phaser.Physics.ARCADE;
        /** A Reference to the game */
        this.game = game;
        /** The amount of gravity */
        this.gravityAmnt = 0;
        /** The Current actor the player controls */
        this.controllableActor = null;
        /** The FPS of the game */
        this.fps = scene.FPS;
        //screen size:
        this.screenSize = [this.game.width,this.game.height];
        this.zoomAmount =  0.005;
        //cursor listeners
        this.cursors = null;
        this.keys = {};
        
        //the hexBoard
        this.hexBoard = null;
        //Start Location:
        this.hexLocation = HexLib.indexToCube(50);
        
    };

    /**
       Called on creation, after ctor
       @method 
     */
    GameState.prototype.init = function(){
        util.debug('start',()=>console.log("GameState init:",scene));
        //Setup the reasoning system / RETE
    };

    /**
       Setup the gamestate, setting the fps, physics and gravity,
       Registers cursor keys, and creates the actor and the defined rooms.
       @method
     */
    GameState.prototype.create = function(){
        this.game.time.desiredFps = this.fps;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //Register specific keys:
        this.keys['z'] = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.keys['x'] = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.keys['space'] = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;
        this.physics.arcade.setBounds(0,0,(scene.MAZE_SIZE+1)*this.screenSize[0],(scene.MAZE_SIZE+1)*this.screenSize[1]);        
        
        //setup the world bounds:
        this.game.world.setBounds(-1000,-1000,2000,2000);
        
        //modify the world update function to ignore inactive items:
        this.game.world.update = function(){
            let i = this.children.length,
                curr;
            while(i--){
                curr = this.children[i];
                if(curr.isInactive){
                    continue;
                }
                curr.update();
            }
        };
        
        //generate a default hex texture from and cache it:
        let radius = 200,
            h = new HexTexture(this.game,radius,parseInt(scene.HEX_TEXTURE_FILL),parseFloat(scene.HEX_TEXTURE_ALPHA),parseInt(scene.HEX_TEXTURE_STROKE));
            h_tex = h.generateTexture();
        h.destroy();
        this.game.cache.addRenderTexture(util.hexTexture(radius),h_tex);
        
        //create the hexboard, add it to the world
        this.hexBoard = new HexBoard(this.game,[scene.BOARD_SIZE[0],scene.BOARD_SIZE[1]],scene.HEX_RADIUS,parseInt(scene.HEX_TEXTURE_FILL),parseFloat(scene.HEX_TEXTURE_ALPHA),parseInt(scene.HEX_TEXTURE_STROKE));
        this.world.add(this.hexBoard);
        this.hexBoard.x = 0;
        this.hexBoard.y = 0;
        
        //Create a sprite, place it at the position of the first hex
        this.pigSprite = new Phaser.Sprite(this.game,0,0,'pig',5);
        console.log('pigSprite coords',this.pigSprite.x,this.pigSprite.y,this.hexBoard.x,this.hexBoard.y,this.camera.x,this.camera.y);
        this.hexBoard.hexagons[0].add(this.pigSprite);
        

        //Set the camera to the first room:
        let cameraSize = scene.HEX_RADIUS;
        this.game.camera.bounds = null;
        //this.game.camera.setSize(cameraSize,cameraSize);
        //this.game.camera.focusOn(sprite);
        this.game.camera.follow(this.pigSprite,Phaser.Camera.FOLLOW_LOCKON,0.1,0.1);
        
    };

    /**
       Called each tick, moving the controllable actor, updating map position etc
       @method
     */
    GameState.prototype.update = function(){
        if(this.cursors.up.isDown){
            this.pigSprite.y -= 10;
            //this.game.camera.y -= 10;
            // console.log(this.hexBoard.hexagons);
            // console.log('moving from',this.hexLocation);
            // this.hexLocation = this.hexLocation.move('upRight');
            // console.log('moving to',this.hexLocation);
            // this.game.camera.focusOn(this.hexBoard.getHexAtCube(this.hexLocation));
        }else if(this.cursors.down.isDown){
            this.pigSprite.y += 10;
            //this.game.camera.y += 10;
        }

        if(this.cursors.left.isDown){
            this.pigSprite.x -= 10;
            //this.game.camera.x -= 10;
        }else if(this.cursors.right.isDown){
            this.pigSprite.x += 10;
            //this.game.camera.x += 10;
        }

        if(this.keys.z.isDown){
            this.game.camera.scale.x += this.zoomAmount;
            this.game.camera.scale.y += this.zoomAmount;
        }else if(this.keys.x.isDown){
            this.game.camera.scale.x -= this.zoomAmount;
            this.game.camera.scale.y -= this.zoomAmount;
        }

        if(this.keys.space.isDown){
            console.log("Camera Scale: ",this.game.camera.scale,this.game.camera);
        }
        
    };

    /**
       Utility render method for debugging:
       @method
     */
    GameState.prototype.render = function(){
        //this.game.debug.cameraInfo(this.game.camera,500,32);
        //this.game.debug.body(this.controllableActor);

    };

    return GameState;
});
