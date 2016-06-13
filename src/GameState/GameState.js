
/* jshint esversion : 6 */
define(['json!data/scene1.json','lodash','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Room','phaser','text!data/mazePaths','ClingoParser','../Extensions/HexBoard','../Extensions/HexTexture','util','../Extensions/Hexagon'],function(scene,_,SpeechBubble,Actor,Room,Phaser,mazeSets,ClingoParser,HexBoard,HexTexture,util,Hexagon){
    const mazeSize = 8,
          BOARD_X_SIZE = 25,
          BOARD_Y_SIZE = 25;
    
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
        this.fps = 30;
        //screen size:
        this.screenSize = [this.game.width,this.game.height];
        //cursor listeners
        this.cursors = null;
        //the hexBoard
        this.hexBoard = null;
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
        this.cameraOffset = [this.game.width/2,this.game.height/2];
        //setup physics:
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.gravityAmnt;
        this.physics.arcade.setBounds(0,0,(mazeSize+1)*this.screenSize[0],(mazeSize+1)*this.screenSize[1]);        
        

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
            h = new HexTexture(this.game,radius),
            h_tex = h.generateTexture();
        h.destroy();
        this.game.cache.addRenderTexture(util.hexTexture(radius),h_tex);
        
        //create the hexboard, add it to the world
        this.hexBoard = new HexBoard(this.game,[BOARD_X_SIZE,BOARD_Y_SIZE]);
        this.hexBoard.x = 0;
        this.hexBoard.y = 0;
        this.world.add(this.hexBoard);

        //Set the camera to the first room:
        this.game.camera.bounds = null;
        this.game.camera.setSize(25 * 51, 25 * 51);
        this.game.camera.focusOn(this.hexBoard);
        
    };

    /**
       Called each tick, moving the controllable actor, updating map position etc
       @method
     */
    GameState.prototype.update = function(){
        if(this.cursors.up.isDown){
            this.game.camera.y -= 10;
        }else if(this.cursors.down.isDown){
            this.game.camera.y += 10;
        }else if(this.cursors.left.isDown){
            this.game.camera.x -= 10;
        }else if(this.cursors.right.isDown){
            this.game.camera.x += 10;
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
