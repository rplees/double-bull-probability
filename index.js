/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CardCombineMng = require('./CardCombineMng');
const CombineAlgorithm = require('./CombineAlgorithm');
const  CardColorEnum = require('./Card').CardColorEnum;
const  Card = require('./Card').Card;
//CardCombineMng.statWriteFile();

var exe = function (c) {
    let rate = CardCombineMng.winRate(c);
    console.log(" %s 牌的胜率为: %s", c.join('~'), rate);
}

var array = [];
for(var point = 5 ; point >= 3; point--) {
    for(var color in CardColorEnum) {
        array.push(new Card(point, CardColorEnum[color]).weight);
    }
}
console.log(array.join(','))
var list = new CombineAlgorithm(array, 5).getResult();
list.forEach(function(c) {
    exe(c);
});

exe([15, 14, 13.4, 13.3, 13.2]);
exe([2.1, 1.4, 1.3, 1.2, 1.1]);
