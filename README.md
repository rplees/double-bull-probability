## 计算一副牌（54张）赢的概率是多少
## 原理
- 54张牌里总有3162510组合的5张牌的信息,计算每组牌的排名后再查询赢的概率.

## 运行
```bash
npm install double-bull-probability --verbose

#demo
'use strict';

import {
    CardCombineMng,
    CardColorEnum,
    CardTypeEnum,
    Card,
    CardCombine,
    CardCombineCompare,
    CombineAlgorithm, } from '../double-bull-probability';

var exe = function (c) {
    let cardCombine = new CardCombine(c);
    let rate = CardCombineMng.winRate(cardCombine);
    console.log("%s 牌的胜率为: %s", cardCombine, rate);
}

exe([new Card(15), new Card(14), new Card(13, CardColorEnum.HEI), new Card(13, CardColorEnum.HONG), new Card(13, CardColorEnum.MEI)]);
exe([new Card(2, CardColorEnum.FANG), new Card(1, CardColorEnum.HEI), new Card(1, CardColorEnum.HONG), new Card(1, CardColorEnum.MEI), new Card(1, CardColorEnum.FANG)]);
exe([new Card(13, CardColorEnum.HEI), new Card(1, CardColorEnum.HEI), new Card(1, CardColorEnum.HONG), new Card(1, CardColorEnum.MEI), new Card(1, CardColorEnum.FANG)]);
```

## 备注
```
  由于每组牌出现后,这组牌的每张牌的所有组合按道理说应该不会存在了,
  应该要去掉那些不会存在的牌后在计算,
  按这精确计算出来的与不去掉算出来的误差非常非常的小(总组合3162510),
  还有计算去掉的也很耗时,所以就允许存在这个误差.
  但有种情况需要手工的去掉,比如 [大王,2,3,5,10],这个的rank虽然不是第一,
  但出现这牌由于牛牛并且最大的也是大王,所以胜率也是100%(跟[大王,小王,K, K, K]一样)
```

## Log
*) 第一次运行由于需要计算排名大概需要30s的时间,数据大小大约100m,
如果有什么好的办法压缩/优化算法可以探讨下

*) 这次发布的计算排名的时间快30%,数据大小减少50%(50M)