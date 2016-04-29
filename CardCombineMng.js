/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CardMng = require('./CardMng');
const CombineAlgorithm = require('./CombineAlgorithm');
const CardCombine = require('./CardCombine');
const CardTypeEnum = require('./Card').CardTypeEnum;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

var rmdir = function(dir) {
    if(!fs.existsSync(dir)) return;
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

module.exports = {
    PARENT_PATH: './data',
    stat : function () {
        let start = new Date().getTime();
        console.log("stat begin. %s", new Date());
        var cardWeights = CardMng.getWeights();
        console.log("一副牌信息:%s", cardWeights.join("  "));
        var cardWeightCombines = new CombineAlgorithm(cardWeights, 5).getResult();
        console.log("一副牌里总共有%s个5张牌的组合.", cardWeightCombines.length);

        var cardCombines = [];
        cardWeightCombines.forEach((combine) => {
            cardCombines.push(new CardCombine(combine));
        });

        //根据计算结果排序
        cardCombines.sort(function(o1, o2) { //根据
            if(o1.cardTypeEnum != o2.cardTypeEnum) {//牛牛 -> 有牛 -> 没有牛
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
             * 可以使用 CardLogic.sortCards 的第一个元素的weight比较,
             * 因为sortCards值是已经按照组合成牛牛的组合排序过的
             * *1) 5,3,2, 2,5
             * *2) 4,3,3, 8,9
             */
            if(o1.combines[0] != o2.combines[0]) {
                return o2.combines[0] - o1.combines[0];
            }
            if(o1.combines[1] != o2.combines[1]) {
                return o2.combines[1] - o1.combines[1];
            }
            if(o1.combines[2] != o2.combines[2]) {
                return o2.combines[2] - o1.combines[2];
            }
            if(o1.combines[3] != o2.combines[3]) {
                return o2.combines[3] - o1.combines[3];
            }
            if(o1.combines[4] != o2.combines[4]) {
                return o2.combines[4] - o1.combines[4];
            }

            return o2.maxWeight - o1.maxWeight;
        });

        console.log("stat end. %s, 耗时:%s毫秒", new Date(), (new Date().getTime() - start));
        console.log("最大:%s,最小:%s", cardCombines[0].combines.join(","), cardCombines[cardCombines.length - 1].combines.join(","));
        return cardCombines;
    },

    statWriteFile: function () {
        var cardCombines = this.stat();
        var o = {};
        let start = new Date();
        console.log("开始分组. %s", start);
        var _this = this;
        cardCombines.forEach(function(cardCombine, i) {
            let level1Key = _this.buildGroupKeyRule(cardCombine);

            let childObj = null;
            if(o.hasOwnProperty(level1Key)) {
                childObj = o[level1Key];
            } else {
                childObj = {};
                o[level1Key] = childObj;
            }

            childObj[_this.buildCardCombineKeyRule(cardCombine)] = i + 1;
        });
        console.log("结束分组. %s, 耗时:%s", new Date(), (new Date().getTime() - start.getTime()));

        start = new Date();
        console.log("开始保存到目录. %s", start);

        rmdir(this.PARENT_PATH);

        if(!fs.existsSync(this.PARENT_PATH)) {
            fs.mkdirSync(this.PARENT_PATH);
        }

        for(var i in o) {
            fs.writeFileSync(this.PARENT_PATH + "/" + i, JSON.stringify(o[i]));
        }

        fs.writeFileSync(this.PARENT_PATH + "/stat", JSON.stringify({size: cardCombines.length}));
        console.log("结束保存到目录. %s, 耗时:%s", new Date(), (new Date().getTime() - start.getTime()));
    },

    buildGroupKeyRule(cardCombine) {
        let suffix;
        if(cardCombine.cardTypeEnum === CardTypeEnum.NN) {
            suffix = 'niuniu_max_';
        } else  if(cardCombine.cardTypeEnum === CardTypeEnum.N) {
            suffix = 'niu_' + cardCombine.niuPoint + '_max_';
        } else {
            suffix = 'none_';
        }

        suffix += parseInt(cardCombine.maxWeight);
        if(cardCombine.maxWeight >= 10) {//再细分
            suffix += "_" + parseInt(cardCombine.combines[1]);
        }

        suffix += ".json";
        return suffix;
    },

    buildCardCombineKeyRule(cardCombine) {
        return cardCombine.combines.join('_');
    },

    getRank(cardCombine) {
        let groupKey = this.buildGroupKeyRule(cardCombine);
        if(!fs.existsSync(this.PARENT_PATH + "/stat")) {//初始化data
            this.statWriteFile();
        }

        let start = new Date().getTime();
        console.log('loading file %s start. %s', groupKey, new Date());
        const data = require(this.PARENT_PATH + '/' + groupKey);
        console.log(this.buildCardCombineKeyRule(cardCombine));
        let info = data[this.buildCardCombineKeyRule(cardCombine)];
        console.log("查找到数据: %s", info);
        console.log('loading file %s end. %s, 耗时 %s 毫秒', groupKey, new Date(), new Date().getTime() - start);

        return info;
    },

    winRate : function () {
        var cardCombine;
        if(arguments.length == 1) {
            if(arguments[0] instanceof Array  && arguments[0].length == 5) {
                cardCombine = new CardCombine(arguments[0]);
            } else {
                throw new Error("只有一个参数的时候,数组的长度一定要为5.");
            }

        } else {
            if(arguments.length != 5) {
                throw new Error("参数长度一定要为 5.");
            }

            cardCombine = new CardCombine(arguments);
        }

        var rank = this.getRank(cardCombine);
        let total = 3162510;

        if(rank === total) {//最后一名
            rank += 1;
        }
        return ((total - rank + 1) / total).toFixed(10);
    }
}
