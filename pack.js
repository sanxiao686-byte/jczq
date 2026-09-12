(function () {
  if (!window._PACK || !window._PACK.length) return;
  var packs = window._PACK.slice().sort(function (a, b) { return (a.i || 0) - (b.i || 0); });
  var d = {
    generated_at: (packs[0] && packs[0].generated_at) || "",
    matches: [],
    reports: (packs[0] && packs[0].reports) || [],
    reviews: (packs[0] && packs[0].reviews) || []
  };
  packs.forEach(function (p) { d.matches = d.matches.concat(p.matches || []); });
  d.count = d.matches.length;
  if (d.matches.length < 30) return;
  window.DATA = d;
})();
