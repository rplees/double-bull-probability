/**
 * Created by rplees on 3/21/16.
 */
'use strict';

//const Card = require("./Card").Card;
const CardTypeEnum = require("./Card").CardTypeEnum;
const  CombineAlgorithm = require('./CombineAlgorithm');
const _ = require('lodash');

function CardLogic(sourceCards) {
    //this.sourceCards = [c1, c2, c3, c4, c5];
    this.sourceCards = sourceCards;
    //console.log(this.sourceCards.join(","));
    this.sourceCards.sort(function(o1, o2) { //倒序
        return o2.weight() - o1.weight();
    });

    this.calc();
}

CardLogic.prototype.formatCardPointToCalc = function(p) {
    return p > 10 ? 10 : p;
}
/**
 * 计算牛牛规则
 *
 * 任意三张牌能组装成被10整除 则有牛,剩下俩张加起来与10取余就是牛几
 * 如果不能被10整除,则没牛,比牌的大小[大王->小王->K ..... 1]
 * @param points <Array> 5张牌的点数
 * @return <Array>  null => 没牛, 不为空则是 返回组合成牛牛的最近方案
 */
CardLogic.prototype.tryFindBest = function (points) {
    var combines = new CombineAlgorithm(points, 3).getResult();
    //判断是否有牛牛
    var best = null;
    var _this = this;
    combines.some(function (e, index, array) {
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
CardLogic.prototype.result = function(points, best) {
    //console.log("CardLogic>result>best:%s", best);
    let bestCopy = best.slice();
    var _this = this;
    return _.sumBy(
            _.filter(points, function(o) {
                    let _i = bestCopy.indexOf(o);
                    if(_i > -1)  bestCopy.splice(_i, 1);
                    return _i == -1;
                }),

            _this.formatCardPointToCalc) % 10;
}
/**
 * 计算5张牌的牛牛信息
 * @param c1
 * @param c2
 * @param c3
 * @param c4
 * @param c5
 */
CardLogic.prototype.calc = function() {
    var points = this.sourceCards.map((v, i) => v.point);
    //判断是否有牛牛
    var best = this.tryFindBest(points);

    if(best) {//有牛 best 是最佳的组合,计算牛几
        //console.log("best:%s, f:%s", best, !best);
        let p = this.result(points, best);
        if(p === 0) {//牛牛
            this.set(this.sourceCards.slice(), CardTypeEnum.NN, 0);
            //console.log("%s 牛牛", points.join(","));
        } else {
            //找到最佳的方案 点数倒序 | 色块升序
            /**
             * 比如 points => [5, 4, 3, 3, 2]
             * 这时候 best = [5, 3, 2]
             * sortCards = [5, 3, 2, 4, 3]
             * @type {Array}
             */
            this.set(_.sortBy(this.sourceCards, function(o) { return best.indexOf(o.point) == -1}), CardTypeEnum.N, p);
            /**
             * best 组合有可能 [4, 3, 3], 这时候要排序出现的2个3的牌的顺序
             */
            //console.log("%s 有牛,为牛: %s" ,points.join(","), p);
        }
    } else {//无牛
        this.set(this.sourceCards.slice(), CardTypeEnum.MN, -1);
        //console.log("%s 无牛.", points.join(","));
    }
}

CardLogic.prototype.set = function(sortCards, cardTypeEnum, niuPoint) {
    //this.sortCards = sortCards;
    this.cardTypeEnum = cardTypeEnum;
    this.niuPoint = niuPoint;
    this.maxWeight = _.maxBy(this.sourceCards, o => o.weight()).weight();
}

module.exports = CardLogic;
