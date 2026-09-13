/* Merge 500.com packs. Do not overwrite RO0/RO1/RO2. */
window.REAL_ODDS = Object.assign({}, window.RO0||{}, window.RO1||{}, window.RO2||{}, window.REAL_ODDS||{});
window.JC_LIVE = window.JC_LIVE || {};
window.ODDS_META = {source:"500.com XML + 足彩网/澳客初盘", updated:"2026-09-13 14:50:00", note:"即时来自500 XML；初盘有则写i，没有保持—；必发/xG未编造"};
