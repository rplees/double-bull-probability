/**
 * Created by rplees on 3/21/16.
 */
'use strict';
import {
    Card,
    CardColorEnum
} from './Card';

const  CombineAlgorithm = require('./CombineAlgorithm');
const _ = require('lodash');

function CardLogic() {
}

/**
 * 计算5张牌的牛牛信息
 * @param c1
 * @param c2
 * @param c3
 * @param c4
 * @param c5
 */
CardLogic.prototype.calc = function(c1, c2, c3, c4, c5) {
    var sourceCards = [c1, c2, c3, c4, c5];
    sourceCards.sort(function(o1, o2) { //倒序
        return o2.weight() - o1.weight();
    });

    var points = sourceCards.map((v, i) => v.point);
    /**
     * 计算牛牛规则
     *
     * 任意三张牌能组装成被10整除 则有牛,剩下俩张加起来与10取余就是牛几
     * 如果不能被10整除,则没牛,比牌的大小[大王->小王->K ..... 1]
    */
    var combines = new CombineAlgorithm(points, 3).getResult();
    //判断是否有牛牛
    var best = null;
    var flag = combines.some(function (e, index, array) {
        let ret = (_.sumBy(e, (o) => o) % 10) === 0;
        if(ret) {
            best = e;
        }
        return ret;
    })

    if(flag) {//有牛 best 是最佳的组合,计算牛几
        //let diff = _.difference(points, best);//TODO:验证这个函数的正确性
        let bestCopy = best.slice();
        let p = _.sum(_.filter(points, function(o) {
            let _i = bestCopy.indexOf(o);
            if(_i > -1)
                bestCopy.splice(_i, 1);
            return _i == -1;
        })) % 10;

        console.log(points.join(",") + " 有牛,为牛:" + p);
    } else {//无牛
        console.log(points.join(",") + " 无牛.");
    }
}

exports.CardLogic = CardLogic;
