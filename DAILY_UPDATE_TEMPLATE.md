# 竞彩数据台 · 每日自动更新模板

站点：https://sanxiao686-byte.github.io/jczq/
仓库：sanxiao686-byte/jczq
时区：Asia/Hong_Kong 每天 11:00

## 硬性规则
1. 覆盖当日全部已开售场次。
2. 欧赔/亚盘/凯利只用 500 XML 真实即时盘，禁止推算。
3. 必发/xG/初盘抓不到就留空或 “—”。
4. **近6场必须是 500 球队页「近期战绩」真实完场**：`https://liansai.500.com/team/{id}/`
5. **禁止**用「近况对手1」等占位队名，禁止编造比分凑 6 行。
6. `jx.js` 只合并 extras，**不得 padRows**。
7. 抓不到就 `form: null`，UI 显示「暂无近期战绩」。
8. 交锋 h2h 同理：没真实对阵就留空。
