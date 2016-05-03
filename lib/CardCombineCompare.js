/**
 * Created by rplees on 3/21/16.
 */
'use strict';

/**
 * 比较组牌的大小
 * @param o1
 * @param o2
 * @returns {number}
 * @constructor
 */
module.exports = function (o1, o2) {
    if(o1.cardTypeEnum != o2.cardTypeEnum) {//牛牛 -> 有牛 -> 没有牛
        return o1.cardTypeEnum - o2.cardTypeEnum;
    }

    /**
     * 同样的情况下,有点数的越高越靠前,到这一步有俩种情况(牛牛的情况下 niuPoint === 0)
     * 1,有牛
     * 2,无牛
     */
    if(o1.niuPoint != o2.niuPoint) {
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
     * 可以使用 CardCombine.sortCombines 的第一个元素的weight比较,
     * 因为sortCombines值是已经按照组合成牛牛的组合排序过的
     *  *1) 5,3,2, 2,5
     *  *2) 4,3,3, 8,9
     */
    if(o1.combines[0].weight != o2.combines[0].weight) {
        return o2.combines[0].weight - o1.combines[0].weight;
    }
    if(o1.combines[1].weight != o2.combines[1].weight) {
        return o2.combines[1].weight - o1.combines[1].weight;
    }
    if(o1.combines[2].weight != o2.combines[2].weight) {
        return o2.combines[2].weight - o1.combines[2].weight;
    }
    if(o1.combines[3].weight != o2.combines[3].weight) {
        return o2.combines[3].weight - o1.combines[3].weight;
    }
    if(o1.combines[4].weight != o2.combines[4].weight) {
        return o2.combines[4].weight - o1.combines[4].weight;
    }

    return o2.maxWeight - o1.maxWeight;
}
