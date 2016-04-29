/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const Card = require('./Card').Card;
const CardColorEnum = require('./Card').CardColorEnum;
const _ = require('lodash');

module.exports = {
    cacheMap: null,

    __a: function(c, card) {
        c[card.weight] = card;
    },

    _getCacheMap: function() {
        if(this.cacheMap) {
            return this.cacheMap;
        }

        var cacheMap = {};
        this.__a(cacheMap, new Card(15));//大王
        this.__a(cacheMap, new Card(14));//小王


        for(var point = 13 ; point >= 1; point--) {
            for(var color in CardColorEnum) {
                this.__a(cacheMap, new Card(point, CardColorEnum[color]));
            }
        }

        this.cacheMap = cacheMap;
        return this.cacheMap;
    },

    //getCard: function(weight) {
    //    var v = weight + '', p, e;
    //    if(v.indexOf(".") > -1) {
    //        p = parseInt(weight);
    //        e = parseInt(v.substring(v.indexOf(".") + 1));
    //    } else {
    //        e = null;
    //        p = weight;
    //    }
    //    return new Card(p, e);
    //},

    getWeights: function () {
        return _.map(_.keys(this._getCacheMap()), function(v) {return parseFloat(v)});
    }
}