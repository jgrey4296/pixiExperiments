/* jshint esversion : 6 */
if(typeof define !== 'function'){
    var define = require('amdefine')(module);
}

define(['underscore'],function(_){
    "use strict";
    /**
       A Clingo parser that takes the answers from a clingo output 
       USE --VERBOSE=0 FOR CLINGO OUTPUT
       and extracts a particular fact pattern from each answer,
       @param {String} rawText
       @returns Array.<FactTuple> AnswerSetArray->Facts
     */
    var ClingoImporter = function(rawText,factName){
        if(factName === undefined){
            throw new Error("Forgot fact pattern");
        }
        //double escaped because its a string
        let theRegex = new RegExp(`${factName}\\((.*)\\)`),
            //each answer set of raw text
            answerSets = rawText.split(/\n/).filter(function(d){
                return d !== undefined && d.length>0 && !(/SATISFIABLE/.test(d));
            }),
        //answer sets of fact strings
            answerSetsOfFacts = answerSets.map(d=>d.split(" ").filter(d=>d.length > 0)),
            //answer sets of fact tuples
            answerSetsOfFactTuples = answerSetsOfFacts.map(ansSet=>ansSet.map(function(fact){
                let match = theRegex.exec(fact),
                    values = match !== null ? match[1].split(",") : null;
                return values;
            }).filter(d=>d !== null));
        return answerSetsOfFactTuples;
    };
    return ClingoImporter;
});
