/**
 * Created by rplees on 3/21/16.
 */
'use strict';

const CardTypeEnum = require("./Card").CardTypeEnum;
const CombineAlgorithm = require('./CombineAlgorithm');
const _ = require('lodash');

/**
 * 计算牛牛规则
 *
 * 任意三张牌能组装成被10整除 则有牛,剩下俩张加起来与10取余就是牛几
 * 如果不能被10整除,则没牛,比牌的大小[大王->小王->K ..... 1]
 * @param combines <Array> 5张牌Card数组
 */
function CardCombine(combines) {
    this.combines = combines;
    this.calc();
}

CardCombine.prototype.formatCardPointToCalc = function(card) {
    return card.point > 10 ? 10 : card.point;
}

/**
 * 计算牛牛规则
 *
 * @param points <Array> 5张牌的点数
 * @return <Array>  null => 没牛, 不为空则是返回组合成牛牛的最佳方案
 */
CardCombine.prototype.tryFindBest = function (cards) {
    var combines = new CombineAlgorithm(cards, 3).getResult();
    //判断是否有牛牛
    var best = null, _this = this;
    combines.some(function (e) {
        let f = _.sumBy(e, _this.formatCardPointToCalc) % 10 === 0;
        if(f) {
            best = e;
        }
        return f;
    });

    return best;
}

/**
 * 计算牛几
 * @param points
 * @param best
 * @returns {number}
 */
CardCombine.prototype.result = function(cards, best) {
    return _.sumBy(_.difference(cards, best), this.formatCardPointToCalc) % 10;
}

/**
 * 计算5张牌的牛牛信息
 */
CardCombine.prototype.calc = function() {
    //判断是否有牛牛
    var best = this.tryFindBest(this.combines);
    if(best) {//有牛 best 是最佳的组合,计算牛几
        let p = this.result(this.combines, best);
        if(p === 0) {//牛牛
            this.set(/**this.combines.slice(),**/CardTypeEnum.NN, 0);
        } else {//有牛
            //找到最佳的方案 点数倒序 | 色块升序
            /**
             * 比如 points => [5, 4, 3, 3, 2]
             * 这时候 best = [5, 3, 2]
             * sortCombines = [5, 3, 2, 4, 3]
             * @type {Array}
             */
            this.set(/**_.sortBy(this.combines, function(o) { return best.indexOf(o) == -1}),**/ CardTypeEnum.N, p);
        }
    } else {//无牛
        this.set(/**this.combines.slice(),**/ CardTypeEnum.MN, -1);
    }
}

CardCombine.prototype.set = function(/**sortCombines,**/ cardTypeEnum, niuPoint) {
    //this.sortCombines = sortCombines;
    this.cardTypeEnum = cardTypeEnum;
    this.niuPoint = niuPoint;
    this.maxWeight = this.combines[0].weight;
}

/**
 * 格式化显示
 * @returns {string}
 */
CardCombine.prototype.toString = function() {
    let format = '';
    if(this.cardTypeEnum === CardTypeEnum.NN) {
        format = '牛牛';
    } else if(this.cardTypeEnum === CardTypeEnum.N) {
        format = '牛' + this.niuPoint;
    } else {
        format = '无牛';
    }

    return '[' + this.combines + ']' + format;
}

module.exports = CardCombine;
