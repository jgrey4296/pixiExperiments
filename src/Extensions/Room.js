
define(['underscore','phaser'],function(_){

    var Room = function(game,description){
        Phaser.Sprite.call(this,game,0,0,description.background,description.backgroundFrame);
        this.id = description.id;
        this.connections = description.connections;
        this.width = this.game.width;
        this.height = this.game.height;
        this.groups = {};

        //Build the room:
        //walls
        description.walls.forEach(function(d){
            this.buildWall(d);
        },this);
        //doors
        description.doors.forEach(function(d){
            this.buildDoor(d);
        },this);

        //items
        description.items.forEach(function(d){
            this.buildItem(d);
        },this);
        
        //actors
        description.actors.forEach(function(d){
            this.buildActor(d);
        },this);

        
        // //todo:build the floor, ceiling, and walls
        // //TODO: sort items by y value
        // room.items.sort(function(a,b){
        //     return a.position.y - b.position.y;
        // });
        
        // var pre = room.items.filter(function(d){
        //     return d.position.y < this.game.height - 75;
        // },this);

        // var post = room.items.filter(function(d){
        //     return d.position.y >= this.game.height - 75;
        // },this);

        // console.log("Filtered:",pre,post);
        
        // pre.forEach(function(d){
        //     this.buildItem(d);
        // },this);

        // room.actors.forEach(function(d){
        //     this.buildActor(d);
            
        // },this);

        // post.forEach(function(d){
        //     this.buildItem(d);
        // },this);


        
    };
    
    Room.prototype = Object.create(Phaser.Sprite.prototype);
    Room.prototype.constructor = Room;

    Room.prototype.buildWall = function(wallDesc){

    };

    Room.prototype.buildDoor = function(doorDesc){

    };
    
    Room.prototype.buildItem = function(itemDesc){

    };

    Room.prototype.buildActor = function(actorDesc){

    };

    Room.prototype.update = function(){
        //check for collisions

        //run AI for each actor

        //perform movements

        //perform interactions

    };


    
    return Room;

});
