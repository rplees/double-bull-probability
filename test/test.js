/**
 * Created by rplees on 3/21/16.
 */
'use strict';

/**
 * 依赖了 ES6 特性的babel包才能这样导入用
 */
/**
import {
    CardCombineMng,
    CardColorEnum,
    CardTypeEnum,
    Card,
    CardCombine,
    CardCombineCompare,
    CombineAlgorithm, } from '../index'; **/

const CardCombineMng = require('../index').CardCombineMng;
const CardColorEnum = require('../index').CardColorEnum;
const Card = require('../index').Card;
const CardCombine = require('../index').CardCombine;
const CombineAlgorithm = require('../index').CombineAlgorithm;

/**
 * 执行初始化测试
 */
//CardCombineMng.statWriteFile();

var exe = function (c) {
    let cardCombine = new CardCombine(c);
    let rate = CardCombineMng.winRate(cardCombine);
    console.log("%s 牌的胜率为: %s", cardCombine, rate);
}

var array = [];
for(var point = 5 ; point >= 3; point--) {
    for(var color in CardColorEnum) {
        array.push(new Card(point, CardColorEnum[color]));
    }
}
var list = new CombineAlgorithm(array, 5).getResult();
list.forEach(function(c) {
    exe(c);
});

exe([new Card(15), new Card(14), new Card(13, CardColorEnum.HEI), new Card(13, CardColorEnum.HONG), new Card(13, CardColorEnum.MEI)]);
exe([new Card(2, CardColorEnum.FANG), new Card(1, CardColorEnum.HEI), new Card(1, CardColorEnum.HONG), new Card(1, CardColorEnum.MEI), new Card(1, CardColorEnum.FANG)]);
exe([new Card(13, CardColorEnum.HEI), new Card(1, CardColorEnum.HEI), new Card(1, CardColorEnum.HONG), new Card(1, CardColorEnum.MEI), new Card(1, CardColorEnum.FANG)]);
