/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CardColorEnum = {
    HEI: 1,
    HONG: 2,
    MEI: 3,
    FANG: 4,
}

function Card(point, colorEnum) {
    this.point = point;
    this.colorEnum = colorEnum;
}

/**
 * 获取牌的权重值  点数(整数) + (黑红梅方)
 */
Card.prototype.weight = function () {
    let format = this.point;
    if(this.colorEnum) {
        format + "." + this.colorEnum;
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