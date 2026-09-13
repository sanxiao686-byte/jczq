(function () {
  var BQC = {"3-3":"胜胜","3-1":"胜平","3-0":"胜负","1-3":"平胜","1-1":"平平","1-0":"平负","0-3":"负胜","0-1":"负平","0-0":"负负"};
  if (typeof euroBlock === "function") {
    var _euro = euroBlock;
    euroBlock = function (m) {
      fillOdds(m);
      var rows = m.euroRows || [];
      if (!rows.length) return _euro(m);
      return '<div class="sect"><h3>欧盘 + 凯利 <span class="muted">即时 500网XML · 初盘 足彩网 fenxi</span></h3><table class="odds-tb"><thead><tr><th>公司</th><th>初盘 胜/平/负</th><th>即时 胜/平/负</th><th>凯利 胜/平/负</th><th>来源</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return "<tr><td>" + esc(r.co) + "</td><td>" + esc(r.i || "—") + '</td><td class="hl">' + esc(r.n || "—") + "</td><td>" + esc(r.k || "—") + "</td><td>" + esc(r.src || "") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    };
  }
  if (typeof ahBlock === "function") {
    ahBlock = function (m) {
      fillOdds(m);
      var html = "";
      if (m.ahRows && m.ahRows.length) {
        html += '<div class="sect"><h3>亚盘让球 <span class="muted">即时 500网XML · 初盘 足彩网 fenxi</span></h3><table class="odds-tb"><thead><tr><th>公司</th><th>初盘</th><th>即时</th></tr></thead><tbody>' +
          m.ahRows.map(function (r) {
            return "<tr><td>" + esc(r.co) + "</td><td>" + esc(r.i || "—") + '</td><td class="hl">' + esc(r.n || r.i || "—") + "</td></tr>";
          }).join("") + "</tbody></table></div>";
      } else {
        html += '<div class="sect"><h3>亚盘让球</h3><div class="muted">本场亚盘公司盘还在补抓。竞彩让球见上栏让球一行。</div></div>';
      }
      if (m.ouRows && m.ouRows.length) {
        html += '<div class="sect"><h3>大小球 <span class="muted">500网即时大小球 · 初盘源未开放则留空</span></h3><table class="odds-tb"><thead><tr><th>公司</th><th>初盘</th><th>即时</th></tr></thead><tbody>' +
          m.ouRows.map(function (r) {
            return "<tr><td>" + esc(r.co) + "</td><td>" + esc(r.i || "—") + '</td><td class="hl">' + esc(r.n || "—") + "</td></tr>";
          }).join("") + "</tbody></table></div>";
      }
      if (m.bifa) {
        html += '<div class="sect"><h3>必发成交</h3><div class="summary-bar">总额 ' + esc(m.bifa.vol) +
          " · 主成交 " + esc(m.bifa.home) + " · 平成交 " + esc(m.bifa.draw) + " · 客成交 " + esc(m.bifa.away);
        if (m.bifa.odds) html += " · 必发赔率 " + esc(m.bifa.odds);
        if (m.bifa.ratio) html += " · 比例 " + esc(m.bifa.ratio);
        html += ' <span class="muted">来源 ' + esc(m.bifa.src || "500/必发") + "</span></div></div>";
      } else {
        html += '<div class="sect"><h3>必发成交</h3><div class="muted">公开页未抓到本场必发成交量/比例。按要求不推算，留空。</div></div>';
      }
      if (m.xg) {
        html += '<div class="sect"><h3>xG</h3><div class="summary-bar">主 ' + esc(m.xg.home) + " · 客 " + esc(m.xg.away) +
          ' <span class="muted">' + esc(m.xg.note || "") + "</span></div></div>";
      } else {
        html += '<div class="sect"><h3>xG</h3><div class="muted">赛前xG接口不可用，按要求不推算，留空。</div></div>';
      }
      return html;
    };
  }
  playsBlock = function (m) {
    var p = m.plays || {};
    var html = "";
    if (p.zjq) {
      html += '<div class="sect"><h3>总进球 <span class="muted">竞彩官方 SP · 500网混合过关</span></h3><div class="play-grid">' + Object.entries(p.zjq).map(function (kv) {
        var lab = kv[0] === "7" ? "7+球" : kv[0] + "球";
        return '<div class="p" onclick="toggleBet(this,\'' + m.code + '\',\'zjq\',\'' + kv[0] + '\',\'' + lab + '\',\'' + kv[1] + '\')"><div class="s">' + lab + '</div><div class="o">' + esc(kv[1]) + "</div></div>";
      }).join("") + "</div></div>";
    }
    if (p.bqc) {
      html += '<div class="sect"><h3>半全场 <span class="muted">竞彩官方 SP · 500网混合过关</span></h3><div class="play-grid">' + Object.entries(p.bqc).map(function (kv) {
        var lab = BQC[kv[0]] || kv[0];
        return '<div class="p" onclick="toggleBet(this,\'' + m.code + '\',\'bqc\',\'' + kv[0] + '\',\'' + lab + '\',\'' + kv[1] + '\')"><div class="s">' + esc(lab) + '</div><div class="o">' + esc(kv[1]) + "</div></div>";
      }).join("") + "</div></div>";
    }
    if (p.bf) {
      html += '<div class="sect"><h3>比分 <span class="muted">竞彩官方 SP · 500网混合过关</span></h3><div class="play-grid">' + Object.entries(p.bf).map(function (kv) {
        return '<div class="p" onclick="toggleBet(this,\'' + m.code + '\',\'bf\',\'' + kv[0] + '\',\'' + kv[0] + '\',\'' + kv[1] + '\')"><div class="s">' + esc(kv[0]) + '</div><div class="o">' + esc(kv[1]) + "</div></div>";
      }).join("") + "</div></div>";
    }
    if (!html) html = '<div class="muted">暂无比分/半全场/总进球明细</div>';
    return html;
  };
})();
