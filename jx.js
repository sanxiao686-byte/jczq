(function () {
  function merge(arr) {
    if (!arr || !window.DATA || !DATA.matches) return;
    arr.forEach(function (ex) {
      var m = DATA.matches.find(function (x) { return x.code === ex.code; });
      if (!m) return;
      if (ex.h2h) m.h2h = ex.h2h;
      if (ex.form) m.form = ex.form;
      if (ex.standings) m.standings = ex.standings;
      if (ex.home_rank != null) m.home_rank = ex.home_rank;
      if (ex.away_rank != null) m.away_rank = ex.away_rank;
    });
  }
  Promise.all([0, 1, 2].map(function (i) {
    return fetch("./e" + i + ".json?v=20", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
  })).then(function (parts) {
    merge(parts.reduce(function (a, b) { return a.concat(b || []); }, []));
    if (typeof render === "function" && DATA.matches && DATA.matches.length) render();
  });
})();
