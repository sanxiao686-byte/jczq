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
  function loadJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) return null;
      return r.text().then(function (t) { try { return JSON.parse(t); } catch (e) { return null; } });
    }).catch(function () { return null; });
  }
  function paint() {
    if (typeof render === "function" && DATA.matches && DATA.matches.length) render();
  }
  function loadExtras() {
    return Promise.all([loadJson("./e0.json?v=30"), loadJson("./e1.json?v=30"), loadJson("./e2.json?v=30")]).then(function (parts) {
      var arr = [];
      parts.forEach(function (p) { if (p && p.length) arr = arr.concat(p); });
      merge(arr);
      paint();
    });
  }
  function refill() {
    if (DATA.matches && DATA.matches.length >= 30) { loadExtras(); return; }
    Promise.all([loadJson("./m0.json?v=30"), loadJson("./m1.json?v=30"), loadJson("./m2.json?v=30")]).then(function (parts) {
      parts = parts.filter(Boolean);
      if (!parts.length) { loadExtras(); return; }
      DATA = {
        generated_at: parts[0].generated_at,
        matches: parts.reduce(function (a, p) { return a.concat(p.matches || []); }, []),
        reports: parts[0].reports || DATA.reports || [],
        reviews: parts[0].reviews || DATA.reviews || []
      };
      DATA.count = DATA.matches.length;
      window.DATA = DATA;
      paint();
      loadExtras();
    });
  }
  if (document.readyState === "complete") refill();
  else window.addEventListener("load", refill);
  setTimeout(refill, 400);
})();
