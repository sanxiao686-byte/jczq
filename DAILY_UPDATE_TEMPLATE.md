# 竞彩数据台 · 每日更新模板（终版锁死）

> **LOCK FOREVER · 2026-09-13 · 结构 v=48**
> 本文件是唯一施工规范。以后每天只换「当天场次 + 真实抓取结果 + `?v=` +1」。
> 禁止省略场次、禁止占位队名、禁止编造赔率/比分/交锋、禁止只更新前几场、禁止用近6场冒充交锋、禁止凑不满 6 场就造假行、禁止砍模块。
> 用户原话（永久有效）：「明明可以爬取的到你再给我偷奸耍滑」「别再给我偷工减料」「先锁死了这个模板，以后每天都按这个模板更新」。

站点：https://sanxiao686-byte.github.io/jczq/
仓库：sanxiao686-byte/jczq（GitHub Pages，`main`）
时区：Asia/Hong_Kong
触发：每天 11:00 自动「昨日复盘 + 今日全场更新」；用户再说「今天的更新」「全部推进去」也按本模板整包重跑。

本文件推到仓库后不得缩成短版。GitHub 上必须保留完整验收表 + 源 + 文件清单 + 加载顺序。

---

## 0. 完工验收（不达标不准推、不准回复“更新好了”）

对**当日全部已开售场次**逐场核对：

| 模块 | 必须有 | 允许空的唯一条件 |
|---|---|---|
| 赛程卡 胜平负 / 让球 | 竞彩官方 SP | 官方未开售该玩法 |
| 欧赔 6 家即时 + 凯利 | 500 XML `n`/`k` | 无 |
| 欧赔 6 家初盘 `i` | 足彩网 bjop（备澳客） | 源 403/WAF 且备源也失败 → 写 `—` 并在回复里点名 |
| 亚盘 4 家即时 | 500 XML `n` | 无 |
| 亚盘 4 家初盘 `i` | 足彩网 ypdb（备澳客） | 同上，写 `—` |
| 大小球即时 | 500 XML，页面必须渲染 | 无该公司盘才缺行 |
| 大小球初盘 `i` | 足彩网 dxdb | 抓不到写 `—`，禁止用即时冒充初盘 |
| 总进球 8 项 | 500 `playid=312` 官方 SP | 官方未开该玩法 |
| 半全场 9 项 | 同上 | 同上 |
| 比分 31 项 | 同上 | 同上 |
| 近 6 场（主客各最多 6 行） | 500 `liansai.500.com/team/{id}/` 近期战绩真实完场 | 球队页无完场 → 该队 `form:null`，**禁止「近况对手」** |
| 交锋最多 6 行 | 澳客 history，不够补足彩网 bsls | 两源都无历史对阵 → `rows:[]` + summary 写明「无历史交锋」，**禁止造假行** |
| 必发 / xG | 真实抓到才写 | 抓不到保持 `null`，页面显示未抓到 |

推送前自检：

1. `m0+m1+m2` 场次数 = 当日已开售场次数，编号连续无跳号。
2. `odds0/1/2` 每个 code 都在，euro 6 家、ah 至少澳门+Bet365+皇冠。
3. `plays0+plays1` 覆盖全部 code，每场 `zjq` 8 / `bqc` 9 / `bf` 31（官方未开除外）。
4. `FORM_PACK`（f0/f0b/f1/f1b/f2）每队行内队名、比分都是真实完场，零「近况对手」。
5. `H2H_PACK`（h2ha/h2hb，可保留 h2h.js）无占位、无近6场冒充。
6. `index.html` 全部资源 `?v=` **同一数字且比昨天 +1**。
7. GitHub `main` 已包含本次改动的全部文件，不是只推了半包。推完必须回读仓库确认 code 数量。

---

## 1. 硬性禁令（永久）

1. 覆盖当日竞彩足球**全部已开售场次**，禁止只写前几场、禁止「先更热门」。
2. 任何赔率、盘口、凯利、SP、比分、交锋、近况，必须来自真实源。**禁止推算、禁止编造、禁止用平均值填洞。**
3. 缺数据就留空并在回复里写原因。不要用历史盘/百家平均/自己算的隐含概率去补。
4. 禁止用「近况对手1」等占位队名。`jx.js` **不得 padRows**。
5. 禁止用近 6 场战绩冒充交锋。
6. 禁止把即时盘复制进初盘字段。
7. 必发、xG 抓不到就 `null`，不要估。
8. 大文件拆包推送（h2ha/h2hb、plays0/plays1、odds0/1/2），**禁止截断覆盖**。
9. 禁止把本模板缩写成几条口号后当规范。完整验收表必须留在仓库。

---

## 2. 数据源（按优先级，失败换源，不编）

**赛程 / 官方 SP（胜平负、让球）**
- 500 混合过关：`https://trade.500.com/jczq/?playid=312`（gb18030）
- 或竞彩计算器：`https://webapi.sporttery.cn/gateway/jc/football/getMatchCalculatorV1.qry?poolCode=had,hhad,ttg,hafu,crs&channel=c`（沙箱常 567，能通则用）
- 写入 `m0.json` / `m1.json` / `m2.json`（每文件最多约 10 场）的 `spf` / `rqspf` / `rq` / `fid` / `code`

**即时欧赔 + 凯利 + 亚盘 + 大小球**
- `https://trade.500.com/static/public/jczq/xml/odds/odds.xml`
- 欧赔+凯利公司：威廉希尔、立博、Bet365、澳门、皇冠、百家平均
- 亚盘公司：澳门、立博、Bet365、皇冠
- 大小球至少：澳门、Bet365
- 写入 `odds0.js` `odds1.js` `odds2.js` 的 `n` / `k`；`odds.js` **只合并禁止覆盖**

**欧赔初盘 / 亚盘初盘 / 大小球初盘**
- 足彩网（先拿 cookie）：打开 `https://www.zgzcw.com/` 或 `https://live.zgzcw.com/`
- 欧赔初：`http://fenxi.zgzcw.com/{zid}/bjop`
- 亚盘初：`http://fenxi.zgzcw.com/{zid}/ypdb`
- 大小球初：`http://fenxi.zgzcw.com/{zid}/dxdb`
- WAF（页面约 7KB / 标题 Access Verification）→ 换 cookie、放慢、分批 6–8 场；仍失败改澳客
- 澳客备源：`https://www.okooo.com/soccer/match/{mid}/odds/ajax/`（欧）、`.../hodds/ajax/`（亚）
  掩码：威*=威廉、立*=立博、36*/B**365=Bet365、澳*=澳门、皇*/SB/*=皇冠
- 只改各家 `i`，即时 `n`/`k` 仍用 500

**近 6 场**
- `https://liansai.500.com/team/{id}/`「近期战绩」表，主客各最多 6 行真实完场
- 写入 `f0.js` `f0b.js` `f1.js` `f1b.js` `f2.js` 的 `window.FORM_PACK`
- 500 shuju 分析页常 WAF，不要死碰 `odds.500.com/fenxi/shuju`

**交锋（目标 6 场真实完场）**
1. 澳客：`https://www.okooo.com/soccer/match/{mid}/history/`「两队交锋」表
2. 不够再补足彩网：`http://fenxi.zgzcw.com/{zid}/bsls`
3. 写入 `h2ha.js`（前半）+ `h2hb.js`（后半），`window.H2H_PACK=Object.assign(...)`
4. 历史确实不足：保留真实行数；完全没有：`rows:[]`，summary 写「双方无历史交锋 + 源」

**竞彩其他玩法（总进球 / 半全场 / 比分）**
- 同一 500 页 `?playid=312` 每行 `data-type=jqs|bqc|bf` + `data-sp`
- `zjq` 键 `0`–`7`（7=7+），`bqc` 键 `3-3`…`0-0`，`bf` 含「胜其它/平其它/负其它」
- 写入 `plays0.js` / `plays1.js` 的 `window.PLAY_PACK`

**zid / mid / fid 对照**
- 500 `data-infomatchid` = fid（与 XML `match id` 一致）
- 足彩网 zid、澳客 mid 按当场对阵检索，禁止套用昨天的 id

---

## 3. 仓库文件（缺一不可，结构冻结）

赛程包：
- `m0.json` `m1.json` `m2.json` — 每份 `{generated_at,count,matches,reports,reviews}`，`matches[].code` 如 `周日001`

赔率包：
- `odds0.js` → `window.RO0` 前 10 场
- `odds1.js` → `window.RO1` 中间
- `odds2.js` → `window.RO2` 剩余
- `odds.js` 仅：
  `window.REAL_ODDS = Object.assign({}, window.RO0||{}, window.RO1||{}, window.RO2||{}, window.REAL_ODDS||{});`

近6场包：
- `f0.js` `f0b.js` `f1.js` `f1b.js` `f2.js` → `window.FORM_PACK`

交锋包：
- `h2ha.js` `h2hb.js`（可另留 `h2h.js` 但不得截断覆盖成 3 场）
- `window.H2H_PACK=Object.assign(window.H2H_PACK||{},{...})`

玩法包：
- `plays0.js` `plays1.js` → `window.PLAY_PACK`

渲染：
- `app.js` 读 `REAL_ODDS` / `m.plays` / `m.form` / `m.h2h`
- `app_plays.js` 覆盖 `playsBlock` / `euroBlock` / `ahBlock`（总进球+半全场+比分+大小球表）
- `jx.js` 合并 FORM_PACK + H2H_PACK + PLAY_PACK，**禁止 padRows**

`index.html` **锁定加载顺序**（`?v=` 必须全文件同一版本号，每次更新 +1）：

```
odds0 → odds1 → odds2 → odds.js
→ app.js → app_plays.js
→ f0 → f0b → f1 → f1b → f2
→ h2h → h2ha → h2hb
→ plays0 → plays1
→ jx.js
```

单场 `REAL_ODDS` 结构（键名必须是 `周六001` / `周日001` 这种竞彩编号）：

```
"周日001": {
  fid: "165794",
  euro: [{co, i, n, k, src:"500网即时XML"}],
  ah:   [{co, i, n}],
  ou:   [{co, i, n}],
  bifa: null,
  xg: null,
  open_src: "足彩网 fenxi 初盘"
}
```

`PLAY_PACK` 结构：

```
"周日001": {
  zjq: {"0":"9.00",...,"7":"36.00"},
  bqc: {"3-3":"3.60",...,"0-0":"5.70"},
  bf:  {"1:0":"6.50",...,"负其它":"200.00"}
}
```

---

## 4. 每日执行步骤（按序，不许跳）

1. 定今天星期（周一…周日）和全部开售场次列表（500 `playid=312` 的 `data-matchnum`）。
2. 写/更新 `m0/m1/m2.json`：code、联赛、主客、开赛、fid、官方胜平负/让球。昨日完场写入 `reviews`（有比分才写）。
3. 拉 500 XML，解析即时欧赔、凯利、亚盘、大小球 → `odds0/1/2.js` 的 `n`/`k`。
4. 足彩网分批抓 bjop/ypdb/dxdb 写入 `i`；WAF 换会话；再不行澳客 ajax。
5. 500 球队页抓主客近 6 场 → `f*.js`。无占位。
6. 澳客 history + 足彩网 bsls 抓交锋最多 6 场 → `h2ha.js`/`h2hb.js`。
7. 500 `playid=312` 解析 jqs/bqc/bf → `plays0.js`/`plays1.js`。
8. `index.html` 全部 `?v=` +1，加载顺序不得改。
9. `github___push_files` 推 `sanxiao686-byte/jczq` `main`。大文件拆 commit。每个 commit 后用 `get_file_contents` 抽查 code 数量，防止截断。
10. 回复用户（格式见下）。没过第 0 节验收表，不准说更新完成。

---

## 5. 回复格式（锁死）

- 站点链接（必须带新 `?v=`）
- 场次数量与编号范围（例：周日001–024 共 24 场）
- 已写入：官方 SP / 欧赔即时+初盘 / 亚盘即时+初盘 / 大小球 / 总进球 / 半全场 / 比分 / 近6场 / 交锋
- 仍空：字段 + 原因 + 源（必发、xG、某场交锋 0 行、某场初盘 WAF 等）
- 昨日复盘摘要（有完场才写，不编对错）

---

## 6. 锁定声明（终版）

自 2026-09-13 起，本模板结构视为终版。

以后**只允许**：
- 换当天场次和真实抓取结果
- `?v=` 递增
- 源被封时换**同等真实源**（仍禁止编造）

以后**不允许**：
- 砍模块（不写比分 / 不写交锋 / 不写初盘 / 不写近6场 / 不写总进球半全场）
- 改加载顺序导致某包不生效
- 用半包文件把仓库覆盖坏
- 把本文件改回短版口号
- 用即时盘冒充初盘、用近6场冒充交锋、用「近况对手」占位

冻结的页面模块：赛程卡官方 SP、欧赔即时+初盘+凯利、亚盘即时+初盘、大小球、总进球、半全场、比分、近6场、交锋。
未冻结但禁止编造：必发、xG（有源才写）。
