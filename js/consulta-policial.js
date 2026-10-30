/* Codex — Consulta policial 10 segons */
(function(){
'use strict';
const CONSULTES=[
 ['🍷','Positiu alcohol','alcohol'],
 ['🚗','Conducció temerària','conducció temerària'],
 ['🧪','Negativa a la prova','negativa prova alcohol'],
 ['🆘','Omissió d’auxili','omissió auxili'],
 ['🏠','Entrada en domicili','entrada domicili'],
 ['🚪','Entrada en local','entrada local'],
 ['🚫','Desobediència','desobediència'],
 ['📍','Quebrantament','quebrantament'],
 ['🪪','Identificació','identificació policia'],
 ['🔎','Escorcoll','registre corporal']
];
function run(q){
 const input=document.getElementById('search-input');
 if(!input)return;
 input.value=q;
 if(typeof window.search==='function') window.search(q);
 else input.dispatchEvent(new Event('input',{bubbles:true}));
 input.focus();
}
function mount(){
 if(document.getElementById('consultaPolicial'))return;
 const box=document.querySelector('.search-box');
 if(!box)return;
 const wrap=document.createElement('section');
 wrap.id='consultaPolicial';
 wrap.className='consulta-policial';
 wrap.innerHTML='<div class="consulta-title"><strong>Consulta policial · 10 segons</strong><span>Accés ràpid</span></div><div class="consulta-grid">'+CONSULTES.map(x=>'<button type="button" data-q="'+x[2]+'"><span>'+x[0]+'</span>'+x[1]+'</button>').join('')+'</div>';
 box.insertAdjacentElement('afterend',wrap);
 wrap.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>run(b.dataset.q)));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
