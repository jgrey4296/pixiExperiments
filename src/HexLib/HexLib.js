/* jshint esversion : 6 */
/**
   HexUtil and pathfinding implemented from http://www.redblobgames.com/
 */
define(['lodash','./Cube'],function(_,Cube){
    "use strict";
    const SQRT_3 = Math.sqrt(3),
          THREE_OVER_TWO = 3/2;
    
    let BOARD_X = 25,
        BOARD_Y = 25;
    
    /**
       A Hexagon Utility group.
       board representation: an ODD R OFFSET REPRESENTATION
       @param ctx The canvas context to draw to
       @param heigh Screen height
       @param width Screen Width
       @param columns The number of cell columns on the board
       @param rows The number of cell rows on the board
    */
    let HexUtil = function(){};

    HexUtil.setBoardSize = function(x,y){
        BOARD_X = x;
        BOARD_Y = y;
    };
    
    //index -> screen position
    HexUtil.indexToPosition = function(index,radius){
        let offset = HexUtil.indexToOffset(index), //location
            xInc = (radius) * SQRT_3 * (offset.q + 0.5 * (offset.r&1)),
            //yInc = (2 * radius) * (3/4); //screen y translation
            yInc = (radius) * THREE_OVER_TWO * offset.r;
        return {
            //x: offset.r&1 ? xInc + (offset.q * 2*xInc) : offset.q * 2*xInc,
            x : xInc,
            y : yInc
            //y: offset.r * yInc
        };
    };

    //index -> cube
    HexUtil.indexToCube = function(index){
        return HexUtil.offsetToCube(HexUtil.indexToOffset(index));
    };
    
    
    //offset -> index
    HexUtil.offsetToIndex = function(offset){
        if(!HexUtil.inBounds(offset)){
            throw new Error('out of bounds');
        }
        return (offset.q) + (offset.r * BOARD_Y);
    };
    
    //index -> offset
    HexUtil.indexToOffset = function(i){
        return {
            q : Math.floor(i% BOARD_Y),
            r : Math.floor(i/ BOARD_Y)
        };
    };
    
    //offset -> cube
    HexUtil.offsetToCube = function(offset){
        return new Cube(offset.q, offset.r);
    };

    //cube -> offset
    HexUtil.cubeToOffset = function(cube){
        return cube.toOffset();
    };

    /**
       neighbours : Get the 6 neighbours of a node,
       filters invalid neighbours
       @param index The central node, as an index
       @returns {Array} Array of indices of neighbours
     */
    HexUtil.neighbours = function(index){
        let positionsLength = HexUtil.positions.length,
            rows = BOARD_X,
            columns = BOARD_Y,
            cube = !isOffset(index) ? HexUtil.indexToCube(index) : HexUtil.offsetToCube(index),
            neighbours = cube.neighbours(),
            //get offset locations
            n_offset = neighbours.map(d=>d.toOffset()),
            //filter by out of bounds
            n_offset_filtered = n_offset.filter(d=>HexUtil.inBounds(d)),
            //convert to indices
            n_indices = n_offset_filtered.map(d=>HexUtil.offsetToIndex(d)),
            //filter by out of bounds
            n_indices_filtered = n_indices.filter(d=> d >= 0 && d < positionsLength);

        return n_indices_filtered;
    };

    HexUtil.neighbourCells = function(index){
        return HexUtil.neighbours(index).map(d=>HexUtil.positions[d]);
    };
    
    /**
       Hex based distance, between two points
       ACCEPTS indices / offsets / cubes
       (upscales to cubes internally)
    */
    HexUtil.distance = function(a,b){
        if(typeof a === 'number'){
            a = HexUtil.indexToCube(a);
        }else if(isOffset(a)){
            a = HexUtil.offsetToCube(a);
        }
        if(typeof b === 'number'){
            b = HexUtil.indexToCube(b);
        }else if(isOffset(b)){
            b = HexUtil.offsetToCube(b);
        }
        return a.distance(b);
    };

    /**
       Calculate the cost of a tile
     */
    HexUtil.costOf = function(tileIndex){
        let tile = HexUtil.positions[tileIndex];
        if(tile === undefined || tile.blocked){
            return Infinity;
        }
        if(tile.cost === undefined){
            return 1;
        }else{
            return tile.cost;
        }        
    };
    
    /**
       A* Pathfind from a specified index node, to target index node
       @param a as index
       @param b as index
       @returns {Array} of indices
     */
    HexUtil.pathFind = function(source,target){
        if(HexUtil.positions[source] === undefined || HexUtil.positions[target] === undefined){
            throw new Error('invalid source or target');
        }
        let hRef = HexUtil,
            frontier = new PriorityQueue(),//minimising
            cameFrom = {},//history of best moves
            costs = {},//record of costs
            path = [],//the generated path
            current = null,
            //calculate cost and add to potential nodes, update frontier
            reduceFunc = function(m,v){
                let newCost = costs[current] + hRef.costOf(v),
                    distance = hRef.distance(v,target);
                if(m[v] === undefined || newCost < costs[v] ){
                    frontier.insert(v,newCost + distance);
                    costs[v] = newCost;
                    //hRef.colour(v,"grey");
                    m[v] = current;
                }
                return m;
            },
            //filter out invalid potential neighbours
            filterFunc = function(d){
                let position = hRef.positions[d];
                if(position !== undefined && position.blocked !== true){
                    return true;
                }else{
                    return false;
                }
            };

        //start point:
        frontier.insert(source,0);
        cameFrom[source] = null;
        costs[source] = 0;

        //MAIN LOOP:
        //expand the frontier to the goal
        while(!frontier.empty()){
            current = frontier.next();
            //hRef.colour(current,"blue");
            let distance = hRef.distance(current,target);
            if(current === target || cameFrom[target] !== undefined){
                break;
            }
            let neighbourIndices = HexUtil.neighbours(current).filter(filterFunc);
            cameFrom = neighbourIndices.reduce(reduceFunc,cameFrom);
        }        
        
        //Retrace steps from target to source to construct path
        current = target;
        while(current !== null && current !== undefined){
            path.unshift(current);
            current = cameFrom[current];
        }

        //if path doesnt start with the source, pathfinding failed
        if(_.first(path) !== source){
            return [];
        }
        //return the successful path:
        return path;
    };

    //Given a centre and radius, get an area of cells
    HexUtil.getRing = function(i,radius){
        let centre = HexUtil.indexToCube(i),
            subCentre = centre.subtract(radius),
            addCentre = centre.add(radius),
            cubes = HexUtil.positions.map((d,i)=>HexUtil.indexToCube(i)),
            xBounded = cubes.filter(d=>subCentre.x < d.x && d.x < addCentre.x),
            yBounded = xBounded.filter(d=>subCentre.y < d.y && d.y < addCentre.y),
            zBounded = yBounded.filter(d=>subCentre.z < d.z && d.z < addCentre.z);

        return zBounded.map(d=>HexUtil.offsetToIndex(d.toOffset()));
    };
    

    HexUtil.getLine = function(i,direction){
        let directions = {
            horizontal : ['left','right'],
            vertLeft : ['upLeft','downRight'],
            vertRight : ['upRight','downLeft'],
        },
            chosenDirectionPair = directions[direction],
            start = HexUtil.indexToCube(i),
            foundCells = [start],
            current = start.move(chosenDirectionPair[0]);
        //dir 1
        while(HexUtil.inBounds(current)){
            foundCells.unshift(current);
            current = current.move(chosenDirectionPair[0]);
            
        }
        //dir2
        current = start.move(chosenDirectionPair[1]);
        while(HexUtil.inBounds(current)){
            foundCells.push(current);
            current = current.move(chosenDirectionPair[1]);
        }

        return foundCells.map(d=>HexUtil.offsetToIndex(d.toOffset()));
    };

    //Check an offset/cube is within bounds of the board,
    //internally use offset
    HexUtil.inBounds = function(cube){
        let offset = cube;
        if(cube instanceof Cube){
            offset = cube.toOffset();
        }
        let inBounds = !(offset.q < 0 || offset.q >= HexUtil.columns || offset.r < 0 || offset.r >= HexUtil.rows);
        return inBounds;
    };

    //----------------------------------------
    //duck type check for offset:
    function isOffset(pOffset){
        if(pOffset.q !== undefined && pOffset.r !== undefined){
            return true;
        }
        return false;
    }
    
    return HexUtil;
});


