/* LexBCN — normatives completes, traducció al català, favorits, historial i actualitzacions */
(function(){
const NORMS={'codi-penal':'Codi Penal',lecrim:'LECrim',circulacio:'Trànsit',ordenanca:'Ordenança',seguretat:'Seguretat'};
const GEN=['lecrim','circulacio','ordenanca','seguretat'],SPECIAL=['favorits','historial','actualitzacions'];
let META=null;const CA={};const lawF={};
const store={get:k=>{try{return JSON.parse(localStorage.getItem(k)||'[]').filter(x=>typeof x==='string')}catch(e){return[]}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const FK='1312_favorits',HK='1312_historial';
const $=id=>document.getElementById(id);
const find=(tab,id)=>(state.data[tab]||[]).find(x=>x.id===id);
const native=x=>/^ordenanca/.test(x.id);
const body=x=>CA[x.id]?.x||x.text||x.summary||'';
const heading=x=>{const h=body(x).split(/\.\s/)[0].trim();return h&&h.length<=90?h:''};
const titleOf=x=>/^Article/.test(x.title||'')?(heading(x)||x.title):(x.title||'Article '+x.article);
const cpCur=x=>typeof curated==='function'?curated(x.article):null;
const cpTitle=x=>cpCur(x)?.title||titleOf(x);
const tagOf=(tab,x)=>x.law||NORMS[tab];
const lang=x=>native(x)||CA[x.id]?'ca':'es';

function loadExtra(){
  fetch('./data/normativa-oficial.json').then(r=>r.json()).then(j=>{META=j;for(const k of GEN){if(!(state.data[k]||[]).length&&Array.isArray(j.data?.[k]))state.data[k]=j.data[k];}refreshView();}).catch(()=>{});
  fetch('./data/normativa-ca.json').then(r=>r.ok?r.json():null).then(j=>{if(j?.items){Object.assign(CA,j.items);document.querySelectorAll('.cp-detail').length||refreshView();}}).catch(()=>{});
}
function refreshView(){const t=current();if(GEN.includes(t)||SPECIAL.includes(t))render(t,$('search-input').value);}

function item(tab,x){const b=body(x).replace(/\s+/g,' ');
return '<button class="result-card" data-tab="'+tab+'" data-id="'+esc(x.id)+'" type="button"><div class="result-top"><span>Art. '+esc(x.article)+'</span><strong>'+esc(tab==='codi-penal'?cpTitle(x):titleOf(x))+'</strong><span class="norm-tag">'+esc(tagOf(tab,x))+'</span></div><p>'+esc(short(b,200))+'</p>'+(lang(x)==='es'?'<small class="es-note">Text en castellà · traducció pendent</small>':'')+'<em>Obrir article →</em></button>';}
function bind(p){p.querySelectorAll('.result-card[data-tab]').forEach(b=>b.onclick=()=>openAny(b.dataset.tab,b.dataset.id));}

function render(tab,q){
  const p=$(tab);if(!p)return;
  if(tab==='actualitzacions'){const s=META?.sources||{};p.innerHTML='<div class="search-head"><strong>Base normativa</strong></div><div class="detail-box"><small>ÚLTIMA ACTUALITZACIÓ AUTOMÀTICA</small><p>'+esc(META?new Date(META.generatedAt).toLocaleString('ca-ES'):'Carregant…')+'</p><p class="detail-source">'+esc(META?.notice||'')+' Les traduccions al català són automàtiques i orientatives.</p></div>'+Object.values(s).map(x=>'<a class="result-card" target="_blank" rel="noopener" href="'+esc(x.url)+'"><div class="result-top"><strong>'+esc(x.name)+'</strong></div><p>'+esc(x.count)+' articles'+(x.boeId?' · '+esc(x.boeId):'')+'</p><em>Veure font oficial ↗</em></a>').join('');return;}
  if(tab==='favorits'||tab==='historial'){const keys=store.get(tab==='favorits'?FK:HK);const its=keys.map(k=>{const [t,...r]=k.split('|');const x=find(t,r.join('|'));return x&&{t,x}}).filter(Boolean);
    const ql=norm(q||'');const list=ql?its.filter(o=>norm(titleOf(o.x)+' '+o.x.article+' '+body(o.x)).includes(ql)):its;
    p.innerHTML=(tab==='historial'&&its.length?'<div class="search-head"><strong>'+its.length+' consultats recentment</strong><button type="button" id="clrHist">× Esborrar</button></div>':'')+(list.length?list.map(o=>item(o.t,o.x)).join(''):'<div class="empty-search">'+(tab==='favorits'?'Encara no tens favorits. Obre un article i toca ☆.':'Encara no has consultat cap article.')+'</div>');
    p.querySelector('#clrHist')?.addEventListener('click',()=>{store.set(HK,[]);render('historial','');});bind(p);return;}
  const all=state.data[tab]||[];
  if(!all.length){p.innerHTML='<div class="placeholder-panel"><strong>'+esc(NORMS[tab])+'</strong><p>'+(META?'Aquesta normativa s’afegirà en la propera actualització automàtica de la base.':'Carregant…')+'</p></div>';return;}
  const laws=[...new Set(all.map(x=>x.law).filter(Boolean))];
  const items=lawF[tab]?all.filter(x=>x.law===lawF[tab]):all;
  const ts=norm(q||'').split(/\s+/).filter(Boolean);
  const res=ts.length?items.filter(x=>{x._s=x._s||norm(x.article+' '+titleOf(x)+' '+x.text);const s=x._s+(CA[x.id]?' '+norm(CA[x.id].x):'');return ts.every(t=>s.includes(t))}):items.slice(0,40);
  const chips=laws.length>1?'<div class="chips">'+['',...laws].map(l=>'<button type="button" class="chip'+((lawF[tab]||'')===l?' on':'')+'" data-law="'+esc(l)+'">'+esc(l||'Totes')+'</button>').join('')+'</div>':'';
  p.innerHTML=chips+'<div class="search-head"><strong>'+(ts.length?res.length+' resultat'+(res.length!==1?'s':''):items.length+' articles · escriu per cercar')+'</strong></div>'+(res.length?res.slice(0,80).map(x=>item(tab,x)).join('')+(res.length>80?'<p class="hero-note">Mostrant 80 de '+res.length+'. Afina la cerca.</p>':''):'<div class="empty-search">No s’han trobat articles.</div>');
  p.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{lawF[tab]=c.dataset.law;render(tab,q);});bind(p);}

function addHist(tab,id){const k=tab+'|'+id;store.set(HK,[k].concat(store.get(HK).filter(x=>x!==k)).slice(0,50));}
function favBtn(tab,id){const k=tab+'|'+id,on=store.get(FK).includes(k);return '<button type="button" class="fav-btn'+(on?' on':'')+'" data-k="'+esc(k)+'">'+(on?'★ Favorit':'☆ Afegir a favorits')+'</button>';}
function extras(x,tab){const ca=!!CA[x.id],nat=native(x);
 return '<div class="detail-actions">'+favBtn(tab,x.id)+'<button type="button" class="fav-btn" id="cpyArt">📋 Copiar</button></div>'
 +'<details class="official" open><summary>'+(nat?'Text oficial':ca?'Text en català':'Text oficial (en castellà · traducció pendent)')+'</summary><p>'+esc(body(x))+'</p>'+(ca?'<p class="detail-source">Traducció automàtica orientativa. El text vàlid és l’original oficial en castellà.</p>':'')+'</details>'
 +(ca?'<details class="official"><summary>Text original oficial (castellà)</summary><p>'+esc(x.text||'')+'</p></details>':'')
 +'<p class="detail-source">'+esc(x.sourceLabel||'')+(x.source?' · <a href="'+esc(x.source)+'" target="_blank" rel="noopener">Font ↗</a>':'')+'</p>';}
function wire(p,x,tab){p.querySelector('.fav-btn[data-k]')?.addEventListener('click',e=>{const b=e.currentTarget,k=b.dataset.k,l=store.get(FK),n=l.includes(k)?l.filter(v=>v!==k):[k].concat(l);store.set(FK,n);const on=n.includes(k);b.classList.toggle('on',on);b.textContent=on?'★ Favorit':'☆ Afegir a favorits';});
 p.querySelector('#cpyArt')?.addEventListener('click',e=>{const t=tagOf(tab,x)+' art. '+x.article+' — '+titleOf(x)+'\n'+body(x);(navigator.clipboard?.writeText(t)||Promise.reject()).then(()=>{e.target.textContent='✓ Copiat';setTimeout(()=>e.target.textContent='📋 Copiar',1500)}).catch(()=>{});});}

function openGeneric(tab,id,push=true){const x=find(tab,id);if(!x)return;const p=$(tab);if(push)history.pushState({view:'gen',tab,id},'');addHist(tab,id);
 p.innerHTML='<button class="detail-back" type="button">← Tornar</button><article class="cp-detail"><div class="detail-number">'+esc(tagOf(tab,x).toUpperCase())+' · ARTICLE '+esc(x.article)+'</div><h2>'+esc(titleOf(x))+'</h2>'+extras(x,tab)+'</article>';
 p.querySelector('.detail-back').onclick=()=>history.back();wire(p,x,tab);}
function openAny(tab,id){switchTab(tab,false);if(tab==='codi-penal')openArticle(id);else openGeneric(tab,id);}

/* Ganxos sobre app.js */
const _switch=switchTab,_open=openArticle,_search=search;
window.switchTab=function(tab,push=true){if(GEN.includes(tab)||SPECIAL.includes(tab)){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===tab));$('search-input').value='';document.querySelector('.tab.active')?.scrollIntoView({inline:'center',block:'nearest'});render(tab,'');if(push)history.pushState({view:'tab',tab},'');}else{_switch(tab,push);document.querySelector('.tab.active')?.scrollIntoView({inline:'center',block:'nearest'});}};
window.card=function(it){const c=cpCur(it),t=c?.title||titleOf(it),sm=c?.summary,pen=typeof penalty==='function'?penalty(c||it):'';
 return '<button class="result-card" data-id="'+esc(it.id)+'" type="button"><div class="result-top"><span>Art. '+esc(it.article)+'</span><strong>'+esc(t)+'</strong></div>'+(sm?'<small>RESUM</small><p>'+esc(short(sm,220))+'</p>':'<p>'+esc(short(body(it).replace(/\s+/g,' '),200))+'</p>'+(lang(it)==='es'?'<small class="es-note">Text en castellà · traducció pendent</small>':''))+(c&&pen?'<small class="penalty-label">PENES</small><p class="penalty">'+esc(short(pen,150))+'</p>':'')+'<em>Ampliar fitxa →</em></button>';};
window.search=function(q){const t=current();if(t!=='codi-penal'){render(t,q);return;}
 if(!q.trim()){hero();return;}const ts=terms(q);
 const res=state.data['codi-penal'].filter(x=>{x._s2=x._s2||norm([x.article,x.title,x.summary,x.text,...(x.keywords||[]),cpCur(x)?.title,cpCur(x)?.summary,...(cpCur(x)?.keywords||[])].join(' '));const s=x._s2+(CA[x.id]?' '+norm(CA[x.id].x):'');return ts.every(g=>g.some(w=>s.includes(w)));});
 renderResults(res.slice(0,100));const sh=document.querySelector('#codi-penal .search-head strong');if(sh)sh.textContent=res.length+' resultat'+(res.length!==1?'s':'')+(res.length>100?' (primers 100)':'');};
window.openArticle=function(id,push=true){_open(id,push);const raw=state.data['codi-penal'].find(x=>x.id===id);if(!raw)return;addHist('codi-penal',id);const box=$('codi-penal').querySelector('.cp-detail');if(box&&!box.querySelector('.official')){const w=document.createElement('div');w.innerHTML=extras(raw,'codi-penal');box.appendChild(w);wire(w,raw,'codi-penal');}};
loadExtra();
})();
