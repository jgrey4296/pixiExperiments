
/* jshint esversion : 6 */
define(['json!data/setup/scene1.json','lodash','../Extensions/SpeechBubble','../Extensions/Actor','../Extensions/Wall','phaser','text!data/mazePaths','ClingoParser','../Extensions/HexBoard','../Extensions/HexTexture','util','../Extensions/Hexagon','../HexLib/HexLib'],function(scene,_,SpeechBubble,Actor,Wall,Phaser,mazeSets,ClingoParser,HexBoard,HexTexture,util,Hexagon,HexLib){

    /**
       Main state of a game. In this case emulating BoI, loaded from data/scene1.json
       @constructor
       @alias GameStates/GameState
       @implements Phaser.State
     */
    var GameState = function(game){
        /** The physics type of the game */
        //this.physicsType = Phaser.Physics.ARCADE;
        /** A Reference to the game */
        this.game = game;
        /** The amount of gravity */
        this.gravityAmnt = scene.GRAVITY;
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
        //Register specific keys:
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.keys['z'] = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.keys['x'] = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.keys['space'] = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        //generate a default hex texture and cache it:
        //then cleanup the sprite
        let h = new HexTexture(this.game,scene.HEX_DEFAULT_RADIUS,parseInt(scene.HEX_TEXTURE_FILL),scene.HEX_TEXTURE_ALPHA,parseInt(scene.HEX_TEXTURE_STROKE));
        h_tex = h.generateTexture();
        h.destroy();
        this.game.cache.addRenderTexture(util.hexTexture(scene.HEX_DEFAULT_TEXTURE),h_tex);

        let bounds_x = (scene.BOARD_SIZE[0] + 1) * scene.HEX_RADIUS,
            bounds_y = (scene.BOARD_SIZE[1] + 1) * scene.HEX_RADIUS,
            offset_x = -scene.HEX_RADIUS,
            offset_y = -scene.HEX_RADIUS;
        
        //setup physics:
        //this.game.physics.startSystem(this.physicsType);
        //this.game.physics.arcade.gravity.x = this.gravityAmnt.x;
        //this.game.physics.arcade.gravity.y = this.gravityAmnt.y;
        //this.physics.arcade.setBounds(0,0,bounds_x,bounds_y);    
        
        //setup the world bounds:
        this.game.world.resize(bounds_x,bounds_y);

        //create the hexboard, add it to the world
        this.hexBoard = new HexBoard(this.game,scene.BOARD_SIZE,scene.HEX_RADIUS,parseInt(scene.HEX_TEXTURE_FILL),scene.HEX_TEXTURE_ALPHA,parseInt(scene.HEX_TEXTURE_STROKE));
        this.world.add(this.hexBoard);
        
        //Create the player, place it at the position of the first hex
        this.controllableActor = new Actor(this.game,scene.actor);
        //let selected = _.sample(_.filter(this.hexBoard.hexagons,d=>d.active));
        //let selected = _.sample(_.filter(this.hexBoard.hexagons,d=>d.active));
        let selected = this.hexBoard.hexagons[0];
        selected.addToSubGroup('actors',this.controllableActor);
        this.controllableActor.parent.parent.active = true;
        
        //Set the camera to the first room:
        let cameraSize = [this.hexBoard.hexHeight,this.hexBoard.hexHeight];
        //this.game.camera.setSize(cameraSize[0],cameraSize[1] * 1.25);
        this.game.camera.bounds = null;
        //this.game.camera.setBoundsToWorld();
        //this.game.camera.setSize(cameraSize,cameraSize);
        //this.game.camera.focusOn(this.hexBoard.hexagons[0]);
        this.game.camera.follow(this.controllableActor);

        /*
          modify the world update function to ignore inactive items:
        */
        //this.game.world.update = inactiveAwareUpdate;
         
    };

    /**
       Called each tick, moving the controllable actor, updating map position etc
       @method
     */
    GameState.prototype.update = function(){
        //UP/DOWN
        if(this.cursors.up.isDown){
            this.controllableActor.move('up');
        }else if(this.cursors.down.isDown){
            this.controllableActor.move('down');
        }
        //LEFT/RIGHT
        if(this.cursors.left.isDown){
            this.controllableActor.move('left');
        }else if(this.cursors.right.isDown){
            this.controllableActor.move('right');
        }

        //ZOOM
        if(this.keys.z.isDown){
            this.game.camera.scale.x += this.zoomAmount;
            this.game.camera.scale.y += this.zoomAmount;
        }else if(this.keys.x.isDown){
            this.game.camera.scale.x -= this.zoomAmount;
            this.game.camera.scale.y -= this.zoomAmount;
        }

        //print camera debug info
        if(this.keys.space.isDown){
            console.log("Camera Scale: ",this.game.camera.scale,this.game.camera);
        }

        //UPDATES
        let currentRoom = this.controllableActor.parent;
        if(currentRoom !== null){
            currentRoom.update();
        }
    };

    /**
       Utility render method for debugging:
       @method
     */
    GameState.prototype.render = function(){
        //this.game.debug.cameraInfo(this.game.camera,500,32);
        //this.game.debug.bodyInfo(this.controllableActor,100,100);
        this.game.debug.bodyInfo(this.hexBoard.hexagons[0].subGroups.walls.children[0],100,100);

    };

    /*
      A Custom update function that is aware of objects that 
      can be designated inactive, thus skipping them.
     */
    let inactiveAwareUpdate = function(){
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
    
    
    return GameState;
});
