let DATA = window.DATA || { matches: [], count: 0, generated_at: "", reports: [], reviews: [] };
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    if (c === "&") return "&" + "amp;";
    if (c === "<") return "&" + "lt;";
    if (c === ">") return "&" + "gt;";
    if (c === '"') return "&" + "quot;";
    return "&#39;";
  });
}
function switchView(v) {
  document.querySelectorAll(".view").forEach(function (e) { e.classList.remove("active"); });
  document.getElementById("view-" + v).classList.add("active");
  document.querySelectorAll("nav button").forEach(function (b) { b.classList.remove("active"); });
  document.getElementById("nav-" + v).classList.add("active");
}
function toggleMatch(code) {
  var el = document.getElementById("m-" + code);
  if (el) el.classList.toggle("open");
}
function findMatch(code) {
  return (DATA.matches || []).find(function (x) { return x.code === code; });
}
let betSlip = [], curLeague = "all";
const PLAY_NAME = { spf: "胜平负", rqspf: "让球", zjq: "总进球", bqc: "半全场", bf: "比分" };
function betKey(c, p, o) { return c + "|" + p + "|" + o; }
function toggleBet(el, code, play, opt, label, odds) {
  var key = betKey(code, play, opt);
  var i = betSlip.findIndex(function (b) { return b.key === key; });
  if (i >= 0) { betSlip.splice(i, 1); el.classList.remove("sel"); }
  else { betSlip.push({ key: key, code: code, play: play, opt: opt, label: label, odds: odds }); el.classList.add("sel"); }
  renderSlip();
}
function removeBet(key) { betSlip = betSlip.filter(function (b) { return b.key !== key; }); renderSlip(); }
function clearSlip() { betSlip = []; document.querySelectorAll(".sel").forEach(function (e) { e.classList.remove("sel"); }); renderSlip(); }
function saveSlip() { try { localStorage.setItem("betSlip", JSON.stringify(betSlip)); } catch (e) {}
}
function calcWin(mode, mul) {
  if (!betSlip.length) return 0;
  if (mode === "single") return betSlip.reduce(function (s, b) { return s + 2 * parseFloat(b.odds); }, 0) * mul;
  return 2 * betSlip.reduce(function (s, b) { return s * parseFloat(b.odds); }, 1) * mul;
}
function renderSlip() {
  var wrap = document.getElementById("betslip");
  if (!wrap) return;
  document.getElementById("bs-count").textContent = betSlip.length;
  if (!betSlip.length) { wrap.style.display = "none"; document.body.classList.remove("has-slip"); return; }
  wrap.style.display = "block"; document.body.classList.add("has-slip");
  document.getElementById("bs-list").innerHTML = betSlip.map(function (b) {
    var m = findMatch(b.code);
    var mm = m ? esc(m.home) + " vs " + esc(m.away) : esc(b.code);
    return '<span class="bs-item" onclick="removeBet(\'' + b.key + '\')">' + mm + " · " + esc(b.label) + ' <b style="color:#f5b942">' + esc(b.odds) + '</b><span class="x">×</span></span>';
  }).join("");
  var mul = parseInt(document.getElementById("bs-mul").value) || 1;
  var mode = document.getElementById("bs-mode").value;
  document.getElementById("bs-win").textContent = "¥" + calcWin(mode, mul).toFixed(2);
}
function copySlip() {
  if (!betSlip.length) return;
  var mul = parseInt(document.getElementById("bs-mul").value) || 1;
  var mode = document.getElementById("bs-mode").value;
  var lines = betSlip.map(function (b, i) {
    var m = findMatch(b.code);
    return (i + 1) + ". " + (m ? m.home + " vs " + m.away : b.code) + " " + (PLAY_NAME[b.play] || b.play) + " " + b.label + " @" + b.odds;
  }).join("\n");
  var t = "【竞彩过关】" + (mode === "single" ? "单关" : betSlip.length + "串1") + " ×" + mul + "倍\n" + lines + "\n最高奖金：¥" + calcWin(mode, mul).toFixed(2);
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { alert("已复制"); }); else alert(t);
}
function cell(code, play, opt, label, odds, cls) {
  if (!odds || odds === "—" || odds === "未开") return "";
  return '<div class="qcell" onclick="toggleBet(this,\'' + code + '\',\'' + play + '\',\'' + opt + '\',\'' + label + '\',\'' + odds + '\')"><div class="l">' + label + '</div><div class="v ' + cls + '">' + esc(odds) + "</div></div>";
}
function playsBlock(m) {
  var p = m.plays || {};
  var html = "";
  if (p.zjq) {
    html += '<div class="sect"><h3>总进球</h3><div class="play-grid">' + Object.entries(p.zjq).map(function (kv) {
      var lab = kv[0] === "7" ? "7+球" : kv[0] + "球";
      return '<div class="p" onclick="toggleBet(this,\'' + m.code + '\',\'zjq\',\'' + kv[0] + '\',\'' + lab + '\',\'' + kv[1] + '\')"><div class="s">' + lab + '</div><div class="o">' + esc(kv[1]) + "</div></div>";
    }).join("") + "</div></div>";
  }
  if (p.bqc) {
    html += '<div class="sect"><h3>半全场</h3><div class="play-grid">' + Object.entries(p.bqc).map(function (kv) {
      return '<div class="p" onclick="toggleBet(this,\'' + m.code + '\',\'bqc\',\'' + kv[0] + '\',\'' + kv[0] + '\',\'' + kv[1] + '\')"><div class="s">' + esc(kv[0]) + '</div><div class="o">' + esc(kv[1]) + "</div></div>";
    }).join("") + "</div></div>";
  }
  if (!html) html = '<div class="muted">暂无比分/半全场明细，胜平负与总进球见上</div>';
  return html;
}
function standingsBlock(st, m) {
  if (!st && !m) return '<div class="muted">暂无积分排名</div>';
  st = st || {};
  function one(side, fallbackName, fallbackRank) {
    var t = st[side] || {};
    var name = t.name || fallbackName || "";
    var d = t.data || {};
    var rank = t.rank != null ? t.rank : fallbackRank;
    var teams = t.teams || "";
    var html = '<div class="sect"><h3>' + esc(name) + " 积分排名</h3>";
    if (rank != null) html += '<div class="summary-bar">联赛排名 <b>第' + esc(rank) + (teams ? "/" + teams : "") + " 名</b></div>";
    if (d.overall || d.home || d.away) {
      function row(lab, arr) {
        if (!arr || !arr.length) return "";
        return "<tr><td>" + lab + "</td>" + arr.map(function (x) { return "<td>" + esc(x == null ? "-" : x) + "</td>"; }).join("") + "</tr>";
      }
      html += "<table><thead><tr><th></th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>进</th><th>失</th><th>净</th><th>积分</th><th>排名</th><th>胜率</th></tr></thead><tbody>" +
        row("总", d.overall) + row("主", d.home) + row("客", d.away) + "</tbody></table>";
    }
    html += "</div>";
    return html;
  }
  return one("home", m && m.home, m && m.home_rank) + one("away", m && m.away, m && m.away_rank);
}
function h2hBlock(h) {
  if (!h) return '<div class="muted">暂无交战历史</div>';
  var html = h.summary ? '<div class="summary-bar">' + esc(h.summary) + "</div>" : "";
  if (h.rows && h.rows.length) {
    html += "<table><thead><tr><th>日期</th><th>赛事</th><th>主队</th><th>比分</th><th>客队</th><th>半场</th><th>亚盘</th><th>赛果</th></tr></thead><tbody>" +
      h.rows.map(function (r) {
        var chip = r.result === "胜" ? '<span class="chip win">胜</span>' : r.result === "平" ? '<span class="chip draw">平</span>' : r.result === "负" ? '<span class="chip lose">负</span>' : esc(r.result || "");
        return "<tr><td>" + esc(r.date) + "</td><td>" + esc(r.league) + "</td><td>" + esc(r.home) + '</td><td class="hl">' + esc(r.score) + "</td><td>" + esc(r.away) + "</td><td>" + esc(r.half) + '</td><td class="hl">' + esc(r.hcap || "") + "</td><td>" + chip + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  return html || '<div class="muted">暂无交战历史</div>';
}
function formBlock(form) {
  if (!form) return '<div class="muted">暂无近期战绩</div>';
  var html = "";
  Object.keys(form).forEach(function (team) {
    var v = form[team] || {};
    html += '<div class="sect"><h3>' + esc(team) + (v.summary ? ' <span class="muted">' + esc(v.summary) + "</span>" : "") + "</h3>";
    if (v.rows && v.rows.length) {
      html += "<table><thead><tr><th>日期</th><th>赛事</th><th>主队</th><th>比分</th><th>客队</th><th>盘口</th><th>半场</th><th>赛果</th></tr></thead><tbody>" +
        v.rows.map(function (r) {
          var chip = r.result === "胜" ? '<span class="chip win">胜</span>' : r.result === "平" ? '<span class="chip draw">平</span>' : r.result === "负" ? '<span class="chip lose">负</span>' : esc(r.result || "");
          var sz = r.size === "大" ? ' <span class="chip big">大</span>' : r.size === "小" ? ' <span class="chip small">小</span>' : "";
          return "<tr><td>" + esc(r.date) + "</td><td>" + esc(r.league) + "</td><td>" + esc(r.home) + '</td><td class="hl">' + esc(r.score) + "</td><td>" + esc(r.away) + "</td><td>" + esc(r.hcap || "") + "</td><td>" + esc(r.half) + "</td><td>" + chip + sz + "</td></tr>";
        }).join("") + "</tbody></table>";
    } else html += '<div class="muted">无数据</div>';
    html += "</div>";
  });
  return html;
}
function recBlock(m) {
  var r = m.rec; if (!r) return "";
  var star = "★".repeat(r.star || 0) + "☆".repeat(Math.max(0, 5 - (r.star || 0)));
  var reasons = (r.reasons || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
  return '<div class="sect"><h3>25维推荐分析</h3><div class="rec-head"><span class="rec-dir">' + esc(r.direction) + '</span><span class="rec-star">' + star + '</span><span class="rec-stake">' + (r.stake || 0) + "u</span></div>" +
    (reasons ? '<div class="rec-reasons"><b>关键依据：</b><ul>' + reasons + "</ul></div>" : "") + "</div>";
}
function openBase(code) {
  var m = findMatch(code); if (!m) return;
  var content = standingsBlock(m.standings, m) + '<div class="sect"><h3>交战记录</h3>' + h2hBlock(m.h2h) + '</div><div class="sect"><h3>近6场</h3>' + formBlock(m.form) + "</div>";
  var css = "<style>body{background:#0e1320;color:#e8edf6;font-family:-apple-system,'Microsoft YaHei',sans-serif;font-size:14px;margin:0;padding:22px}.wrap{max-width:1000px;margin:0 auto}h1{font-size:18px;color:#f5b942;margin:0 0 4px}.sub{color:#8b98b5;font-size:12px;margin-bottom:18px}.sect{margin-bottom:22px}.sect h3{font-size:14px;color:#f5b942;margin-bottom:10px}table{width:100%;border-collapse:collapse;font-size:12.5px}th,td{padding:6px 8px;text-align:center;border-bottom:1px solid #26324d}th{color:#8b98b5;background:#141b2e}td.hl{color:#f5b942;font-weight:700}.chip{display:inline-block;font-size:11px;padding:1px 8px;border-radius:20px;font-weight:600}.chip.win{background:rgba(255,90,95,.15);color:#ff5a5f}.chip.draw{background:rgba(46,194,126,.15);color:#2ec27e}.chip.lose{background:rgba(77,163,255,.15);color:#4da3ff}.summary-bar{background:#0d1322;border:1px solid #26324d;border-radius:8px;padding:10px 14px;margin-bottom:10px}.muted{color:#8b98b5;font-size:12px}</style>";
  var html = "<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>" + esc(m.home) + " vs " + esc(m.away) + " · 基本面</title>" + css + "</head><body><div class=wrap><h1>" + esc(m.home) + " <span style=color:#8b98b5>vs</span> " + esc(m.away) + "</h1><div class=sub>" + esc(m.code || "") + " · " + esc(m.league || "") + " · 赛前基本面</div>" + content + "</div></body></html>";
  var w = window.open("", "_blank", "width=980,height=820");
  if (!w) { alert("浏览器拦截了弹窗，请允许本站弹窗后重试"); return; }
  w.document.write(html); w.document.close();
}
function jxBtn(code) {
  return '<a class="jx" href="javascript:void(0)" onclick="event.stopPropagation();openBase(\'' + code + '\')" title="基本面分析" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;margin-left:6px;border:1px solid #f5b942;background:#f5b942;color:#141b2e;border-radius:4px;font-size:13px;font-weight:800;line-height:1;text-decoration:none;flex:none">析</a>';
}
function matchCard(m) {
  var rq = m.rq == null ? "" : String(m.rq);
  var t1 = m.date ? m.date.slice(5) + " " + (m.time || "") : (m.code || "");
  var spf = m.spf || {}, rqspf = m.rqspf || {};
  var spfRow = cell(m.code, "spf", "win", "主胜", spf.win, "win") + cell(m.code, "spf", "draw", "平", spf.draw, "draw") + cell(m.code, "spf", "lose", "客胜", spf.lose, "lose");
  var rqRow = cell(m.code, "rqspf", "win", "让胜", rqspf.win, "win") + cell(m.code, "rqspf", "draw", "让平", rqspf.draw, "draw") + cell(m.code, "rqspf", "lose", "让负", rqspf.lose, "lose");
  var star = m.rec ? "★".repeat(m.rec.star || 0) : "";
  var rec = m.rec ? '<span class="rec-tag"><span class="rec-dir">' + esc(m.rec.direction) + '</span><span class="rec-star">' + star + "</span></span>" : "";
  var hr = m.home_rank != null ? '<span class="rk">[' + m.home_rank + "]</span>" : "";
  var ar = m.away_rank != null ? '<span class="rk">[' + m.away_rank + "]</span>" : "";
  var id = "m-" + m.code;
  return '<div class="match" id="' + id + '"><div class="match-head" onclick="toggleMatch(\'' + m.code + '\')">' +
    '<div class="no"><span class="tag">' + esc(m.code) + '</span><div class="dt">' + esc(t1) + "</div></div>" +
    '<div class="league">' + esc(m.league || "") + "</div>" +
    '<div class="teams"><span class="t"><span class="n">' + hr + esc(m.home) + '</span></span><span class="vs">VS</span><span class="t"><span class="n">' + esc(m.away) + ar + "</span></span>" + jxBtn(m.code) + "</div>" +
    '<div class="odds-2row"><div class="orow"><span class="rq-tag">0</span>' + spfRow + '</div><div class="orow"><span class="rq-tag">' + esc(rq) + "</span>" + rqRow + "</div></div>" + rec +
    '<span class="arrow">▾</span></div>' +
    '<div class="match-body">' + recBlock(m) +
    '<div class="plays-area">' + playsBlock(m) + "</div>" +
    '<div class="tabpane active" style="display:block;padding:16px">' +
    standingsBlock(m.standings, m) +
    '<div class="sect"><h3>交战记录</h3>' + h2hBlock(m.h2h) + "</div>" +
    '<div class="sect"><h3>近6场</h3>' + formBlock(m.form) + "</div>" +
    "</div></div></div>";
}
function filterLeague(l) { curLeague = l; render(); }
function render() {
  var d = DATA;
  var upd = document.getElementById("upd");
  var cnt = document.getElementById("cnt");
  if (upd) upd.textContent = d.generated_at || "";
  var listAll = d.matches || [];
  if (cnt) cnt.textContent = "共 " + listAll.length + " 场";
  var list = listAll.filter(function (m) { return curLeague === "all" || (m.league || "其他") === curLeague; });
  var leagues = [];
  listAll.forEach(function (m) { var l = m.league || "其他"; if (l && leagues.indexOf(l) < 0) leagues.push(l); });
  document.getElementById("league-filter").innerHTML = '<button class="' + (curLeague === "all" ? "active" : "") + "\" onclick=\"filterLeague('all')\">全部</button>" +
    leagues.map(function (l) { return '<button class="' + (curLeague === l ? "active" : "") + "\" onclick=\"filterLeague('" + l + "')\">" + esc(l) + "</button>"; }).join("");
  document.getElementById("app").innerHTML = list.map(matchCard).join("") || '<div class="empty">暂无赛程</div>';
  var h = "";
  (d.reports || []).forEach(function (r) {
    h += '<div class="rv-card open"><div class="rv-head"><span class="d">' + esc(r.date || "") + '</span><span class="t">' + esc(r.title || "推荐") + '</span><span class="badge">推荐</span></div><div class="rv-body">';
    if (r.ops) h += "<table><thead><tr><th>场次</th><th>对阵</th><th>结论</th><th>注码</th></tr></thead><tbody>" + r.ops.map(function (x) { return "<tr><td>" + esc(x.code) + "</td><td>" + esc(x.match) + "</td><td>" + esc(x.concl) + "</td><td>" + esc(x.bet) + "</td></tr>"; }).join("") + "</tbody></table>";
    h += "</div></div>";
  });
  (d.reviews || []).forEach(function (r) {
    h += '<div class="rv-card open"><div class="rv-head"><span class="d">' + esc(r.date || "") + '</span><span class="t">' + esc(r.title || "复盘") + '</span><span class="badge">复盘</span></div><div class="rv-body">';
    if (r.results) h += "<table><thead><tr><th>场次</th><th>对阵</th><th>全场</th><th>半场</th></tr></thead><tbody>" + r.results.map(function (x) { return "<tr><td>" + esc(x.code) + "</td><td>" + esc(x.match) + "</td><td>" + esc(x.full) + "</td><td>" + esc(x.half) + "</td></tr>"; }).join("") + "</tbody></table>";
    h += "</div></div>";
  });
  document.getElementById("rv-app").innerHTML = h || '<div class="empty">暂无复盘/推荐</div>';
  renderSlip();
}
function boot() {
  if (window._PACK && window._PACK.length) {
    var packs = window._PACK.slice().sort(function (a, b) { return (a.i || 0) - (b.i || 0); });
    DATA = {
      generated_at: (packs[0] && packs[0].generated_at) || "",
      matches: packs.reduce(function (a, p) { return a.concat(p.matches || []); }, []),
      reports: (packs[0] && packs[0].reports) || [],
      reviews: (packs[0] && packs[0].reviews) || []
    };
    DATA.count = DATA.matches.length;
    window.DATA = DATA;
    render();
    return;
  }
  if (DATA && DATA.matches && DATA.matches.length) { window.DATA = DATA; render(); return; }
  Promise.all([0, 1, 2].map(function (i) {
    return fetch("./m" + i + ".json?v=32", { cache: "no-store" }).then(function (r) {
      if (!r.ok) return null;
      return r.text().then(function (t) { try { return JSON.parse(t); } catch (e) { return null; } });
    }).catch(function () { return null; });
  })).then(function (parts) {
    parts = parts.filter(Boolean);
    if (!parts.length) throw new Error("无数据");
    function asMatches(p) {
      if (!p) return [];
      if (Array.isArray(p)) return p;
      return p.matches || [];
    }
    DATA = {
      generated_at: (parts[0] && parts[0].generated_at) || "2026-09-12",
      count: parts.reduce(function (s, p) { return s + asMatches(p).length; }, 0),
      matches: parts.reduce(function (a, p) { return a.concat(asMatches(p)); }, []),
      reports: parts[0].reports || [],
      reviews: parts[0].reviews || []
    };
    window.DATA = DATA;
    render();
  }).catch(function (e) {
    document.getElementById("app").innerHTML = '<div class="empty">数据加载失败：' + esc(e) + "</div>";
  });
}
boot();
