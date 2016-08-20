/* jshint esversion : 6 */
define(['lodash','util','./Hexagon','./HexTexture','../HexLib/HexLib','phaser'],function(_,util,Hexagon,HexTexture,HexUtil,Phaser){

    /**
       Constructor for HexBoard.
       USES AN ODD R OFFSET, pointy topped hexagon representation
       @param screenSize [x,y]
       @param boardSize [x,y]
    */
    let HexBoard = function(game,boardSize,standardRadius,fill,fillAlpha,stroke){
        util.debug('start',()=>console.log('Creating Hexboard'));
        //defaults:
        if(fill === undefined){ fill = 0xFF00FF; }
        if(fillAlpha === undefined) { fillAlpha = 0x0;}
        if(stroke === undefined){ stroke = 0x00FFFF; }
        if(boardSize === undefined) { boardSize = [25,25]; }
        if(standardRadius === undefined) { standardRadius = 50; }
        //Setup the group:
        Phaser.Group.call(this,game,null,'HexBoard');
        this.boardSize = boardSize;
        //individual hexagon dimensions
        this.radius = standardRadius;
        this.hexHeight = 2 * this.radius;
        //Setup the util internal values
        HexUtil.setBoardSize(this.boardSize[0],this.boardSize[1]);
        //check this size of hex texture exists, if not, create it:
        if(!this.game.cache.checkKey(Phaser.Cache.RENDER_TEXTURE,util.hexTexture(this.radius))){
            util.debug('texture',()=>console.log(`Creating additional texture: ${this.radius}`));
            let h = new HexTexture(this.game,this.radius,fill,fillAlpha,stroke),
                h_tex = h.generateTexture();
            this.game.cache.addRenderTexture(util.hexTexture(this.radius),h_tex);
            h.destroy();            
        }
        
        //The array of stored Hexagons.
        //ie: accessed by INDEX
        //todo: add the hexagons to the group, offset appropriately
        this.hexagons = Array(this.boardSize[0] * this.boardSize[1]).fill(0).map((d,i)=>{
            //game,index,offset,cube,name,radius,fillColour,strokeColour
            let newHex = new Hexagon(this.game,'hexCell',this.radius,i);
            this.add(newHex);
            return newHex;
        });

        //Remove a random number of cells
        _.sampleSize(this.hexagons,200).forEach(d=>d.destroy());//this.removeChild(d));

        //TODO: add walls:

        
        console.log(this.hexagons);
        
        util.debug('hexs',()=>console.log(this.hexagons.map(d=>[d.x,d.y])));
        util.debug('start',()=>console.log('Finished Creating Hexboard'));
    };
    HexBoard.prototype = Object.create(Phaser.Group.prototype);
    HexBoard.prototype.constructor = HexBoard;

    HexBoard.prototype.getHexAtCube = function(cube){
        let index = HexUtil.cubeToIndex(cube);
        return this.hexagons[index];
    };
    

    //TODO
    HexBoard.prototype.transitionTo = function(object,oldHex,newHex){
        //remove the object from the hex it is currently attached to (parent)
        //and then add it to the new hex
    };

    HexBoard.calculateDoorsAndWalls = function(){
        //for each hexagon:
        for(var i = 0; i < this.hexagons.length; i++){
            let neighbours = HexUtil.neighbour_vector(i);
            this.hexagons[i].calculateDoorsAndWalls(neighbours);
        }
    };
    
    
    return HexBoard;
});
