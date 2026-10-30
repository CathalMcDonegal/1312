/* APPOL — botons ràpids específics per mòdul */
(function(){
'use strict';
const QUICK={
  lecrim:[['detenció','Detenció'],['drets detingut','Drets del detingut'],['registre','Entrada i registre'],['judici ràpid','Judici ràpid']],
  circulacio:[['alcohol','Alcohol i drogues'],['mòbil','Mòbil'],['velocitat','Velocitat'],['immobilització','Immobilització']],
  seguretat:[['identificació','Identificació'],['drogues','Drogues'],['desobediència','Desobediència'],['escorcoll','Escorcoll']],
  ordenanca:[['soroll','Soroll'],['alcohol','Alcohol'],['platges','Platges'],['brutícia','Brutícia']]
};
function refresh(){
  document.querySelectorAll('.norm-actions').forEach(box=>{
    const panel=box.closest('.panel');
    if(!panel||!QUICK[panel.id]) return;
    box.innerHTML=QUICK[panel.id].map(([q,label])=>'<button type="button" data-q="'+q+'">'+label+'</button>').join('');
    box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
      const input=document.getElementById('search-input');
      if(input){input.value=b.dataset.q;input.dispatchEvent(new Event('input',{bubbles:true}));}
    });
  });
  document.querySelectorAll('.norm-hero span').forEach(el=>{el.textContent='APPOL · CONSULTA RÀPIDA';});
}
const observer=new MutationObserver(refresh);
function init(){
  observer.observe(document.body,{subtree:true,childList:true});
  refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
