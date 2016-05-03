/**
 * Created by rplees on 3/21/16.
 */
'use strict';
const CardCombineMng = require('./lib/CardCombineMng');
const CardColorEnum = require('./lib/Card').CardColorEnum;
const CardTypeEnum = require('./lib/Card').CardTypeEnum;
const Card = require('./lib/Card').Card;
const CardCombine = require('./lib/CardCombine');
const CardCombineCompare = require('./lib/CardCombineCompare');
const CombineAlgorithm = require('./lib/CombineAlgorithm');

module.exports = {
    CardCombineMng : CardCombineMng,
    CardColorEnum : CardColorEnum,
    CardTypeEnum : CardTypeEnum,
    Card : Card,
    CardCombine : CardCombine,
    CardCombineCompare : CardCombineCompare,
    CombineAlgorithm : CombineAlgorithm,
}