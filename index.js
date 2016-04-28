/**
 * Created by rplees on 3/21/16.
 */
'use strict';

const Card = require("./Card").Card;
const CardColorEnum = require("./Card").CardColorEnum;
const CombineAlgorithm = require('./CombineAlgorithm');
const CardLogic = require('./CardLogic');

function buildCards() {
    //var cards = new Array(54);
    var cards = [];
    for(var point = 1 ; point <= 13; point++) {
        for(var color in CardColorEnum) {
            cards.push(new Card(point, CardColorEnum[color]));
        }
    }

    cards.push(new Card(14));//小王
    cards.push(new Card(15));//大王
    return cards;
}

function stat() {
    let begin = new Date().getTime();
    console.log("stat begin. %s", new Date());

    var cards = buildCards();
    console.log("一副牌信息:%s", cards.join("||"))
    var combines = new CombineAlgorithm(cards, 5).getResult();
    console.log("一副牌里总共有%s个5张牌的组合.", combines.length);

    var cardLogics = [];
    combines.forEach((combine) => {
        cardLogics.push(new CardLogic(combine));
    });

    //根据计算结果排序
    cardLogics.sort(function(o1, o2) { //根据
        if(o1.cardTypeEnum != o2.cardTypeEnum) {//牛牛->有牛->没有牛
            return o1.cardTypeEnum - o2.cardTypeEnum;
        }

        /**
         * 同样的情况下,有点数的越高越靠前,到这一步 有俩种情况(牛牛的情况下 niuPoint === 0)
         * 1,有牛
         * 2,无牛
         */
        if(o1.niuPoint != o2.niuPoint) {//同样的情况下,有点数的越高越靠前(到这一步 有俩种)
            return o2.niuPoint - o1.niuPoint;
        }

        /**
         * 到这一步 有三种情况
         * 1,都是牛牛
         * 2,有牛但点数相同
         * 3,无牛
         *
         * 根据家里的规则
         * 1,都是牛牛的情况下,比最大的牌
         * 2,没有牛牛的情况下,比最大的牌
         * 3,都有牛的情况也,也是比最大的牌
         *
         * 如果有些地方下面俩种情况判定 1 大的话,
         * 可以使用 CardLogic.sortCards 的第一个元素的weight()比较,
         * 因为sortCards值是已经按照组合成牛牛的组合排序过的
         * *1) 5,3,2, 2,5
         * *2) 4,3,3, 8,9
        */
        return o2.maxWeight - o1.maxWeight;
    });

    console.log("stat end. %s, 耗时:%s毫秒", new Date(), (new Date().getTime() - begin));

    console.log("最大:%s,最小:%s", cardLogics[0].sourceCards.join(","), cardLogics[cardLogics.length - 1].sourceCards.join(","));
}

stat();