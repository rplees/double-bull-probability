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

    getWeights: function () {
        return _.keys(this._getCacheMap(), o => parseInt(o))
                .sort(function(o1, o2) {
                    return o2 - o1;
                });
    }
}