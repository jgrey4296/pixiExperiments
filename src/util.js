/* jshint esversion : 6 */
define(['lodash','phaser'],function(_,Phaser){
    "use strict";
    let debugFlags = {},
        util = {};

    util.hexTexture = function(size){
        return `hexTexture_${size}`;
    };
    
    //calculate the ith vertex position of a polygon
    util.calcPoint = function(centre,radius,i,polygon,flatTopped){
        let rotate = (2*Math.PI)/polygon,
            rotateAmt = flatTopped ? i*rotate+(rotate*0.5) : i*rotate,
            pointX = centre[0] + (Math.sin(rotateAmt) * radius),
            pointY = centre[1] + (Math.cos(rotateAmt) * radius);
        return [pointX,pointY];
    };

    //Set Debug Flag:
    util.setDebugFlags = function(...args){
        args.forEach(d=>debugFlags[d] = true);          
    };
    
    //Debug Statement:
    util.debug = function(flag,...args){
        if(debugFlags[flag] !== true){ return; }
        args.forEach(d=>d());
    };
    
    return util;
});
