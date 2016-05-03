/**
 * Created by rplees on 3/21/16.
 */
'use strict';

/**
 * 组合算法 从M个数中取出N个数的组合，无顺序
 * @param src Array 类型 原始数组
 * @param n 需要在数组中取 n 个的组合
 * @constructor
 */
function CombineAlgorithm(src, n) {
    if(!src) {
        throw new Error("原数组为空.");
    }

    if (src.length < n)
        throw new Error("要取的数据比原数组个数还大 .");

    this.src = src;
    this.m = this.src.length;
    this.n = n;

    //init
    this.objLineIndex = 0;
    this.obj = new Array(this.combination(this.m, this.n));//二维数组 1 = this.combination(m, n) 2 = n;

    var tmp = new Array(n);
    this.combine(this.src, 0, 0, n, tmp);
}

/**
 * <p>
 * 计算 C(m,n)个数 = (m!)/(n!*(m-n)!)
 * </p>
 * 从M个数中选N个数，函数返回有多少种选法 参数 m 必须大于等于 n m = 0; n = 0; retuan 1;
 *
 * @param m
 * @param n
 * @return
 * @since royoan 2014-6-13 下午8:25:33
 */
CombineAlgorithm.prototype.combination = function(m, n) {
    if (m < n)
        return 0; // 如果总数小于取出的数，直接返回0

    var k = 1;
    var j = 1;
    // 该种算法约掉了分母的(m-n)!,这样分子相乘的个数就是有n个了
    for (var i = n; i >= 1; i--) {
        k = k * m;
        j = j * n;
        m--;
        n--;
    }
    return parseInt(k / j);
}

/**
 * <p> 递归算法，把结果写到obj二维数组对象 </p>
 * @param src []
 * @param srcIndex int
 * @param i int
 * @param n int
 * @param tmp []
 * @since royoan 2014-6-15 上午11:22:24
 */
CombineAlgorithm.prototype.combine = function(src, srcIndex, i, n, tmp) {
    var j;
    for (j = srcIndex; j < src.length - (n - 1); j++ ) {
        tmp[i] = src[j];
        if (n == 1) {
            //System.out.println(Arrays.toString(tmp));

            this.obj[this.objLineIndex] = tmp.slice();
            this.objLineIndex ++;
        } else {
            n--;
            i++;
            this.combine(src, j+1, i, n, tmp);
            n++;
            i--;
        }
    }
}

CombineAlgorithm.prototype.getResult = function() {
    return this.obj;
}

module.exports = CombineAlgorithm;