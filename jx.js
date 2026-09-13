(function () {
  /* LOCKED: 近6场/交锋只展示真实抓取数据，禁止用「近况对手」或编造比分补行 */
  function merge(arr) {
    if (!window.DATA || !DATA.matches) return;
    (arr || []).forEach(function (ex) {
      var m = DATA.matches.find(function (x) { return x.code === ex.code; });
      if (!m) return;
      if (ex.h2h) m.h2h = ex.h2h;
      if (ex.form) m.form = ex.form;
      if (ex.standings) m.standings = ex.standings;
      if (ex.home_rank != null) m.home_rank = ex.home_rank;
      if (ex.away_rank != null) m.away_rank = ex.away_rank;
    });
  }
  function loadE(i) {
    return fetch("./e" + i + ".json?v=43", { cache: "no-store" }).then(function (r) {
      if (!r.ok) return [];
      return r.text().then(function (t) { try { return JSON.parse(t); } catch (e) { return []; } });
    }).catch(function () { return []; });
  }
  var extras = [];
  function apply() {
    if (!window.DATA || !DATA.matches || !DATA.matches.length) return false;
    merge(extras);
    var pack = window.FORM_PACK || {};
    var h2h = window.H2H_PACK || {};
    var plays = window.PLAY_PACK || {};
    DATA.matches.forEach(function (m) {
      if (pack[m.code]) m.form = pack[m.code];
      if (h2h[m.code]) m.h2h = h2h[m.code];
      if (plays[m.code]) m.plays = plays[m.code];
    });
    if (typeof render === "function") render();
    return true;
  }
  Promise.all([loadE(0), loadE(1), loadE(2)]).then(function (parts) {
    extras = parts.reduce(function (a, b) { return a.concat(b || []); }, []);
    if (!apply()) {
      var n = 0;
      var t = setInterval(function () { if (apply() || ++n > 40) clearInterval(t); }, 200);
    }
  });
})();
