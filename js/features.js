/* 1312 — LECrim/Circulació/Seguretat, text oficial, favorits, historial i actualitzacions */
(function(){
const NORMS={'codi-penal':'Codi Penal',lecrim:'LECrim',circulacio:'Llei de trànsit',ordenanca:'Ordenança',seguretat:'LO 4/2015'};
const GEN=['lecrim','circulacio','ordenanca','seguretat'];
let META=null;
const store={get:k=>{try{return JSON.parse(localStorage.getItem(k)||'[]').filter(x=>typeof x==='string')}catch(e){return[]}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const FK='1312_favorits',HK='1312_historial';
const find=(tab,id)=>(state.data[tab]||[]).find(x=>x.id===id);
const heading=x=>{const h=String(x.text||x.summary||'').split(/\.\s/)[0].trim();return h&&h.length<=90?h:''};
const titleOf=x=>x.article!=null&&/^Article/.test(x.title||'')?(heading(x)||x.title):(x.title||'Article '+x.article);
const cpTitle=x=>(typeof curated==='function'&&curated(x.article)?.title)||titleOf(x);
const panel=id=>document.getElementById(id);

fetch('./data/normativa-oficial.json').then(r=>r.json()).then(j=>{META=j;for(const k of GEN){if(!(state.data[k]||[]).length&&Array.isArray(j.data?.[k]))state.data[k]=j.data[k];}refreshView();}).catch(()=>{});

function refreshView(){const t=current();if(GEN.includes(t)||['favorits','historial','actualitzacions'].includes(t))render(t,document.getElementById('search-input').value);}

function item(tab,x){const t=tab==='codi-penal'?cpTitle(x):titleOf(x);const body=String(x.summary||x.text||'').replace(/\s+/g,' ');
return '<button class="result-card" data-tab="'+tab+'" data-id="'+esc(x.id)+'" type="button"><div class="result-top"><span>Art. '+esc(x.article)+'</span><strong>'+esc(t)+'</strong><span class="norm-tag">'+esc(NORMS[tab])+'</span></div><p>'+esc(short(body,200))+'</p><em>Obrir article →</em></button>';}
function bind(p){p.querySelectorAll('.result-card').forEach(b=>b.onclick=()=>openAny(b.dataset.tab,b.dataset.id));}

function render(tab,q){
  const p=panel(tab);if(!p)return;
  if(tab==='actualitzacions'){const s=META?.sources||{};p.innerHTML='<div class="search-head"><strong>Base normativa</strong></div><div class="detail-box"><small>ÚLTIMA ACTUALITZACIÓ AUTOMÀTICA</small><p>'+esc(META?new Date(META.generatedAt).toLocaleString('ca-ES'):'Carregant…')+'</p><p class="detail-source">'+esc(META?.notice||'')+'</p></div>'+Object.values(s).map(x=>'<a class="result-card" target="_blank" rel="noopener" href="'+esc(x.url)+'"><div class="result-top"><strong>'+esc(x.name)+'</strong></div><p>'+esc(x.count)+' articles · '+esc(x.boeId)+'</p><em>Veure al BOE ↗</em></a>').join('');return;}
  if(tab==='favorits'||tab==='historial'){const keys=store.get(tab==='favorits'?FK:HK);const its=keys.map(k=>{const [t,...r]=k.split('|');const x=find(t,r.join('|'));return x&&{t,x}}).filter(Boolean);
    const ql=norm(q||'');const list=ql?its.filter(o=>norm(titleOf(o.x)+' '+o.x.article+' '+o.x.summary).includes(ql)):its;
    p.innerHTML=(tab==='historial'&&its.length?'<div class="search-head"><strong>'+its.length+' consultats recentment</strong><button type="button" id="clrHist">× Esborrar</button></div>':'')+(list.length?list.map(o=>item(o.t,o.x)).join(''):'<div class="empty-search">'+(tab==='favorits'?'Encara no tens favorits. Obre un article i toca ☆.':'Encara no has consultat cap article.')+'</div>');
    p.querySelector('#clrHist')?.addEventListener('click',()=>{store.set(HK,[]);render('historial','');});bind(p);return;}
  const items=state.data[tab]||[];
  if(!items.length){p.innerHTML='<div class="placeholder-panel"><strong>'+esc(NORMS[tab])+'</strong><p>'+(META?'Aquesta norma encara no té dades carregades.':'Carregant…')+'</p></div>';return;}
  const ts=norm(q||'').split(/\s+/).filter(Boolean);
  const res=ts.length?items.filter(x=>{x._s=x._s||norm(x.article+' '+titleOf(x)+' '+x.text);return ts.every(t=>x._s.includes(t))}):items.slice(0,40);
  p.innerHTML='<div class="search-head"><strong>'+(ts.length?res.length+' resultat'+(res.length!==1?'s':''):items.length+' articles · escriu per cercar')+'</strong></div>'+(res.length?res.slice(0,80).map(x=>item(tab,x)).join('')+(res.length>80?'<p class="hero-note">Mostrant 80 de '+res.length+'. Afina la cerca.</p>':''):'<div class="empty-search">No s’han trobat articles.</div>')+(ts.length?'':'<p class="hero-note">Mostrant els 40 primers.</p>');
  bind(p);}

function addHist(tab,id){const k=tab+'|'+id;store.set(HK,[k].concat(store.get(HK).filter(x=>x!==k)).slice(0,50));}
function favBtn(tab,id){const k=tab+'|'+id,on=store.get(FK).includes(k);return '<button type="button" class="fav-btn'+(on?' on':'')+'" data-k="'+esc(k)+'">'+(on?'★ Favorit':'☆ Afegir a favorits')+'</button>';}
function extras(x,tab){return '<div class="detail-actions">'+favBtn(tab,x.id)+'<button type="button" class="fav-btn" id="cpyArt">📋 Copiar</button></div><details class="official"><summary>Text oficial (BOE)</summary><p>'+esc(x.text||x.summary||'')+'</p><p class="detail-source">'+esc(x.sourceLabel||'BOE')+(x.source?' · <a href="'+esc(x.source)+'" target="_blank" rel="noopener">Font ↗</a>':'')+'</p></details>';}
function wire(p,x,tab){p.querySelector('.fav-btn[data-k]')?.addEventListener('click',e=>{const k=e.currentTarget.dataset.k,l=store.get(FK),n=l.includes(k)?l.filter(v=>v!==k):[k].concat(l);store.set(FK,n);const on=n.includes(k);e.currentTarget.classList.toggle('on',on);e.currentTarget.textContent=on?'★ Favorit':'☆ Afegir a favorits';});
 p.querySelector('#cpyArt')?.addEventListener('click',e=>{const t=NORMS[tab]+' art. '+x.article+' — '+titleOf(x)+'\n'+(x.text||x.summary||'');(navigator.clipboard?.writeText(t)||Promise.reject()).then(()=>{e.target.textContent='✓ Copiat';setTimeout(()=>e.target.textContent='📋 Copiar',1500)}).catch(()=>{});});}

function openGeneric(tab,id,push=true){const x=find(tab,id);if(!x)return;const p=panel(tab);if(push)history.pushState({view:'gen',tab,id},'');addHist(tab,id);
 p.innerHTML='<button class="detail-back" type="button">← Tornar</button><article class="cp-detail"><div class="detail-number">'+esc(NORMS[tab].toUpperCase())+' · ARTICLE '+esc(x.article)+'</div><h2>'+esc(titleOf(x))+'</h2>'+extras(x,tab)+'</article>';
 p.querySelector('.detail-back').onclick=()=>history.back();wire(p,x,tab);p.querySelector('details').open=true;}

function openAny(tab,id){switchTab(tab,false);if(tab==='codi-penal')openArticle(id);else openGeneric(tab,id);}

/* Ganxos sobre app.js (funcions globals) */
const _switch=switchTab,_open=openArticle,_search=search;
window.switchTab=function(tab,push=true){if(GEN.includes(tab)||['favorits','historial','actualitzacions'].includes(tab)){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===tab));document.getElementById('search-input').value='';document.querySelector('.tab.active')?.scrollIntoView({inline:'center',block:'nearest'});render(tab,'');if(push)history.pushState({view:'tab',tab},'');}else _switch(tab,push);};
window.search=function(q){const t=current();if(t==='codi-penal')_search(q);else render(t,q);};
window.openArticle=function(id,push=true){_open(id,push);const raw=state.data['codi-penal'].find(x=>x.id===id);if(!raw)return;if(push!==false||true)addHist('codi-penal',id);const box=panel('codi-penal').querySelector('.cp-detail');if(box&&!box.querySelector('.official')){const w=document.createElement('div');w.innerHTML=extras(raw,'codi-penal');box.appendChild(w);wire(w,raw,'codi-penal');}};
})();