/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz";

const CardTypeEnum = {
    NN: 1,
    N: 2,
    MN: 3,
}

const CardColorEnum = {
    HEI: 4,
    HONG: 3,
    MEI: 2,
    FANG: 1,
}

function Card(point, colorEnum) {
    this.point = point;
    this.colorEnum = colorEnum;
    /**
     * 这个值不是数字类型,为了压缩key的长度
     */
    this.weight = this._weight();
}

/**
 * 获取牌的权重值
 * 点数(整数) + (黑红梅方)
 */
Card.prototype._weight = function () {
    let format = this.point;
    if(this.colorEnum) {
        format += "." + this.colorEnum;
    }
    return parseFloat(format);
}

Card.prototype.toString = function () {
    var format = "";
    var p = this.point;
    if(p <= 10) {
        format = (p === 1) ? "A" : p + "";
    } else if(p > 10 && p <= 13) {//花牌
        if(p === 11) {
            format = "J";
        } else if(p === 12) {
            format = "Q";
        } else if(p === 13) {
            format = "K";
        }
    } else {//大小王
        if(p === 14) {
            format = "小王";
        } else if(p === 15) {
            format = "大王";
        } else {
            throw new Error("不知的牌:[" + p +"]");
        }
    }

    if(this.colorEnum) {
        var colorFormat = "";
        switch (this.colorEnum) {
            case CardColorEnum.HEI:
                colorFormat = "黑桃";
                break;
            case CardColorEnum.HONG:
                colorFormat = "红桃";
                break;
            case CardColorEnum.MEI:
                colorFormat = "梅花";
                break;
            case CardColorEnum.FANG:
                colorFormat = "方块";
                break;
        }
        format = colorFormat + format;
    }

    return format;
}

exports.Card = Card;
exports.CardColorEnum = CardColorEnum;
exports.CardTypeEnum = CardTypeEnum;
exports.CardFormat = {
    formatFromWeights: function (array) {
        var retArray = [];
        for (var i in array) {
            retArray.push(this.formatFromWeight(array[i]));
        }

        return retArray;
    },

    formatFromWeight: function (weight) {
        var v = weight + '', p, e;
        if (v.indexOf(".") > -1) {
            p = parseInt(weight);
            e = parseInt(v.substring(v.indexOf(".") + 1));
        } else {
            e = null;
            p = weight;
        }

        return new Card(p, e);
    }
}