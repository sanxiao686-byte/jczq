# 竞彩数据台 · 每日自动更新模板

站点：https://sanxiao686-byte.github.io/jczq/
仓库：sanxiao686-byte/jczq（GitHub Pages，main）
时区：Asia/Hong_Kong
时间：每天 11:00

## 硬性规则
1. 覆盖当日竞彩足球全部已开售场次，禁止只写前几场。
2. 欧赔、亚盘、凯利必须来自真实源，禁止推算、禁止编造。
3. 缺数据就留空并写明原因，不要用平均赔率/历史盘去填。
4. 必发成交、xG：抓不到就留空。
5. 初盘：源没有就填 —。
6. 输出格式保持站点现有 UI。

## 数据源优先级
1. 500网即时 XML：https://trade.500.com/static/public/jczq/xml/odds/odds.xml
2. 足彩网 fenxi / odds.zgzcw.com
3. 竞彩官方胜平负/让球：m0/m1/m2.json

## 仓库文件约定
- odds0.js / odds1.js / odds2.js → RO0/RO1/RO2
- odds.js 只合并，禁止覆盖
- index.html 顺序加载并递增 ?v=
- 场次键名：周六001 / 周日001
