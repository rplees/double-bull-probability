/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const Card = require('./Card').Card;
const CardColorEnum = require('./Card').CardColorEnum;

module.exports = {
    cacheMap: null,

    _getCacheMap: function() {
        if(this.cacheMap) {
            return this.cacheMap;
        }

        var cacheMap = [];
        cacheMap.push(new Card(15));//大王
        cacheMap.push(new Card(14));//小王

        for(var point = 13 ; point >= 1; point--) {
            for(var color in CardColorEnum) {
                cacheMap.push(new Card(point, CardColorEnum[color]));
            }
        }

        this.cacheMap = cacheMap;
        return this.cacheMap;
    },

    getCards: function () {
        return this._getCacheMap();
    }
}