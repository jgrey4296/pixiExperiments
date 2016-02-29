// wrap-start.frag.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore','phaser'], factory);
    } else if (typeof exports === 'object') {
        var _ = require('underscore'),
            phaser = require('phaser');
        module.exports = factory(_);
    } else {
        // change "myLib" to whatever your library is called
        root.main = factory(root._,root.phaser);
    }
}(this, function (_,Phaser) {

    
