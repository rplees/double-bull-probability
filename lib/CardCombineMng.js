/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CardMng = require('./CardMng');
const CombineAlgorithm = require('./CombineAlgorithm');
const CardCombine = require('./CardCombine');
const CardCombineCompare = require('./CardCombineCompare');
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
    PARENT_PATH: path.resolve(__dirname, '../data'),
    STAT_FILE: path.resolve(__dirname, '../data/stat.json'),

    stat : function () {
        let start = new Date().getTime();
        var cards = CardMng.getCards();

        console.log("一副牌信息:%s", cards);
        var cardWeightCombines = new CombineAlgorithm(cards, 5).getResult();
        console.log("一副牌里总共有%s个5张牌的组合.", cardWeightCombines.length);
        console.log("stat begin. %s", new Date());

        var cardCombines = [];
        cardWeightCombines.forEach((combine) => {
            cardCombines.push(new CardCombine(combine));
        });

        //根据计算结果排序
        cardCombines.sort(CardCombineCompare);

        console.log("stat end. %s, 耗时:%s毫秒", new Date(), (new Date().getTime() - start));
        console.log("最大:%s,最小:%s", cardCombines[0].combines,  cardCombines[cardCombines.length - 1].combines);
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

            /**
             * 只保存每组牌的排名
             * */
            childObj[_this.buildCardCombineKeyRule(cardCombine)] = (i + 1);
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

        fs.writeFileSync(this.STAT_FILE, JSON.stringify({size: cardCombines.length}));
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

        let point = cardCombine.combines[0].point;
        suffix += point;
        if(point >= 10) {//再细分
            suffix += "_" + cardCombine.combines[1].point;
        }

        suffix += ".json";
        return suffix;
    },

    buildCardCombineKeyRule(cardCombine) {
        return _.map(cardCombine.combines, o => o.thumb).join('');
    },

    getRank(cardCombine) {
        let path = this.PARENT_PATH + '/' + this.buildGroupKeyRule(cardCombine);
        if(!fs.existsSync(this.STAT_FILE)) {//初始化统计数据并保存到文件
            this.statWriteFile();
        }

        let start = new Date().getTime();
        const data = require(path);
        let info = data[this.buildCardCombineKeyRule(cardCombine)];
        console.log('loaded file %s end. %s, 耗时 %s 毫秒, 查找到排名: %s', path, new Date(), new Date().getTime() - start, info);
        return info;
    },

    winRate : function () {
        var cardCombine;
        if(arguments.length == 1) {
            if(arguments[0] instanceof CardCombine) {
                cardCombine = arguments[0];
            } else if(arguments[0] instanceof Array  && arguments[0].length == 5) {
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

        /**
         * 由于每组牌出现后,这组牌的每张牌的所有组合按道理说应该不会存在了,
         * 应该要去掉那些不会存在的牌后在计算,
         * 按这精确计算出来的与不去掉算出来的误差非常非常的小(总组合3162510),
         * 还有计算去掉的也很耗时,所以就允许存在这个误差.
         *
         * 但有种情况需要手工的去掉,比如 [大王,2,3,5,10],这个的rank虽然不是第一,但出现这牌由于牛牛并且最大的也是大王,所以胜率也是100%(跟[大王,小王,K, K, K]一样)
         * **/
        let total = 1;
        let rank = -1;
        if(cardCombine.cardTypeEnum === CardTypeEnum.NN && cardCombine.maxWeight === 15) {
            rank = 1;
        } else {
            rank = this.getRank(cardCombine);

            total = require(this.STAT_FILE).size;
            if(rank === total) {//最后一名
                rank += 1;
            }
        }

        return ((total - rank + 1) / total).toFixed(10);
    }
}
