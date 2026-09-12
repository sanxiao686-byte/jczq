function standingsBlock(st){
  if(!st) return '<div class="muted">暂无积分排名数据</div>';
  function team(t){
    if(!t) return '';
    const d=t.data||{};
    function row(lab,arr){ if(!arr||!arr.length) return ''; return '<tr><td>'+lab+'</td>'+arr.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>'; }
    return '<div class="sect"><h3>'+esc(t.name)+' 积分</h3><table><thead><tr><th></th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>进</th><th>失</th><th>净</th><th>积分</th><th>排名</th><th>胜率</th></tr></thead><tbody>'+row('总',d.overall)+row('主',d.home)+row('客',d.away)+'</tbody></table></div>';
  }
  return team(st.home)+team(st.away);
}
function openBase(idx){
  const list=(typeof curLeague!=='undefined' && curLeague!=='all') ? DATA.matches.filter(m=> (m.league||'其他')===curLeague) : DATA.matches;
  const m=list[idx]||DATA.matches[idx];
  if(!m) return;
  const content=standingsBlock(m.standings)+h2hBlock(m.h2h)+formBlock(m.form);
  const css='<style>body{background:#0e1320;color:#e8edf6;font-family:-apple-system,"Microsoft YaHei",sans-serif;font-size:14px;margin:0;padding:22px}.wrap{max-width:1000px;margin:0 auto}h1{font-size:18px;color:#f5b942;margin:0 0 4px}.sub{color:#8b98b5;font-size:12px;margin-bottom:18px}.sect{margin-bottom:22px}.sect h3{font-size:14px;color:#f5b942;margin-bottom:10px}table{width:100%;border-collapse:collapse;font-size:12.5px}th,td{padding:6px 8px;text-align:center;border-bottom:1px solid #26324d}th{color:#8b98b5;background:#141b2e}td.hl{color:#f5b942;font-weight:700}.chip{display:inline-block;font-size:11px;padding:1px 8px;border-radius:20px}.chip.win{color:#ff5a5f}.chip.draw{color:#2ec27e}.chip.lose{color:#4da3ff}.summary-bar{background:#0d1322;border:1px solid #26324d;border-radius:8px;padding:10px 14px;margin-bottom:10px}.muted{color:#8b98b5}</style>';
  const html='<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>'+esc(m.home)+' vs '+esc(m.away)+' · 基本面</title>'+css+'</head><body><div class=wrap><h1>'+esc(m.home)+' <span style=color:#8b98b5>vs</span> '+esc(m.away)+'</h1><div class=sub>'+esc(m.code||'')+' · '+esc(m.league||'')+' · 赛前基本面</div>'+content+'</div></body></html>';
  const w=window.open('',' _blank','width=980,height=820');
  if(!w){alert('浏览器拦截了弹窗，请允许本站弹窗后重试');return;}
  w.document.write(html);w.document.close();
}
(function(){
  if(typeof matchCard!=='function') return;
  const raw=matchCard;
  matchCard=function(m,idx){
    let html=raw(m,idx);
    const jx='<a class="jx" onclick="event.stopPropagation();openBase('+idx+')" title="基本面分析">析</a>';
    return html.replace('</span></span></div><div class="odds-2row">','</span></span>'+jx+'</div><div class="odds-2row">');
  };
})();
