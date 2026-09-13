# 竞彩数据台 · 每日自动更新模板

站点：https://sanxiao686-byte.github.io/jczq/
仓库：sanxiao686-byte/jczq（GitHub Pages，main）
时区：Asia/Hong_Kong
时间：每天 11:00

## 硬性规则
1. 覆盖当日竞彩足球**全部已开售场次**，禁止只写前几场。
2. 欧赔、亚盘、凯利必须来自真实源，**禁止推算、禁止编造**。
3. 缺数据就留空并写明原因，不要用平均赔率/历史盘去填。
4. 必发成交、xG：抓不到就留空。
5. 初盘：源没有就填 “—”。
6. 输出格式保持站点现有 UI。

## 近6场 / 交锋（锁定）
- 近6场必须来自 500 球队页「近期战绩」，禁止「近况对手」占位。
- 交锋必须来自 `liansai.500.com/team/{id}/teamfixture/` 行内 JSON，写入 `h2h.js` 的 `window.H2H_PACK`。
- `jx.js` 用 H2H_PACK 覆盖 `m.h2h`；禁止编造比分、禁止用近6场冒充交锋。
- 赛程页当季完场没对上客队，该场 h2h 留空（「暂无交战历史」），不准填假数据。
- `index.html` 加载：odds0/1/2 → odds.js → app.js → f* → **h2h.js** → jx.js，每次递增 `?v=`。
