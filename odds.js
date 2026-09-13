/* Merge 500.com packs. Do not overwrite RO0/RO1/RO2. */
window.REAL_ODDS = Object.assign({}, window.RO0||{}, window.RO1||{}, window.RO2||{}, window.REAL_ODDS||{});
window.JC_LIVE = window.JC_LIVE || {};
window.ODDS_META = {source:"500.com XML", updated:"2026-09-13 13:24:05", note:"即时欧盘/亚盘/凯利；初盘/必发/xG未编造"};
