/* CODEX — ampliació de consulta penal.
   Síntesis en català basades en el Codi Penal consolidat del BOE.
   No substitueix el text legal vigent. */
(function(){
'use strict';
if(typeof CURATED_CP==='undefined') return;
const EXTRA=[
{id:'cp-142',article:'142',title:'Homicidi per imprudència',keywords:['homicidi imprudent','mort','imprudència','accident','trànsit'],summary:'Causar la mort d’una altra persona per imprudència greu pot constituir homicidi imprudent. La pena general és de presó d’1 a 4 anys, amb conseqüències addicionals quan s’utilitza un vehicle o una arma.'},
{id:'cp-195',article:'195',title:'Omissió del deure d’auxili',keywords:['auxili','auxilio','accident','ajuda','emergència'],summary:'Qui no auxiliï una persona que es trobi desemparada i en perill manifest i greu, quan pugui fer-ho sense risc propi ni de tercers, pot incórrer en responsabilitat penal. La pena depèn de les circumstàncies.'},
{id:'cp-197',article:'197',title:'Descobriment i revelació de secrets',keywords:['intimitat','privacitat','dades','missatges','fotografies','secrets'],summary:'Protegeix la intimitat i les dades reservades davant accessos, apoderaments, intercepcions o usos no autoritzats en els supòsits previstos pel Codi Penal. Les penes poden incloure presó i multa.'},
{id:'cp-197bis',article:'197 bis',title:'Accés il·lícit a sistemes informàtics',keywords:['hacking','hackeig','sistema informàtic','accés il·lícit','ordinador','informàtica'],summary:'L’accés no autoritzat a un sistema d’informació vulnerant les mesures de seguretat, o la interceptació de transmissions no públiques, pot constituir delicte. La pena pot arribar a 2 anys de presó.'},
{id:'cp-203',article:'203',title:'Entrada en local o establiment fora d’horari',keywords:['local','establiment','oficina','despatx','entrada','negoci'],summary:'Regula l’entrada o permanència contra la voluntat del titular en determinats domicilis de persones jurídiques, despatxos, oficines o establiments oberts al públic fora dels supòsits permesos.'},
{id:'cp-205',article:'205',title:'Calúmnia',keywords:['calúmnia','acusació falsa','delicte','honor','falsedat'],summary:'Imputar a una persona un delicte sabent que és fals o amb menyspreu temerari cap a la veritat pot constituir calúmnia.'},
{id:'cp-208',article:'208',title:'Injúria',keywords:['injúria','insult','honor','dignitat','reputació'],summary:'Una acció o expressió que lesioni greument la dignitat, la fama o l’estimació pròpia d’una persona pot constituir injúria en els casos previstos legalment.'},
{id:'cp-226',article:'226',title:'Incompliment dels deures d’assistència familiar',keywords:['família','assistència familiar','pàtria potestat','menors','deures'],summary:'L’incompliment dels deures legals d’assistència inherents a la pàtria potestat, tutela, guarda o acolliment, o dels deures d’assistència econòmica previstos legalment, pot constituir delicte.'},
{id:'cp-227',article:'227',title:'Impagament de pensions',keywords:['pensions','pensió aliments','impagament','divorci','fills'],summary:'Deixar de pagar durant dos mesos consecutius o quatre no consecutius una prestació econòmica establerta judicialment en els supòsits previstos pot constituir delicte.'},
{id:'cp-229',article:'229',title:'Abandonament de menor o persona amb discapacitat',keywords:['abandonament','menor','infant','discapacitat','guarda'],summary:'L’abandonament d’un menor o d’una persona amb discapacitat necessitada d’especial protecció per qui en té la guarda pot constituir delicte, amb agreujaments segons les circumstàncies.'},
{id:'cp-270',article:'270',title:'Delictes contra la propietat intel·lectual',keywords:['pirateria','copyright','propietat intel·lectual','obres','reproducció','distribució'],summary:'La reproducció, plagi, distribució o comunicació pública no autoritzada d’obres protegides amb ànim de lucre i en perjudici de tercers pot constituir delicte.'},
{id:'cp-273',article:'273',title:'Delictes contra la propietat industrial',keywords:['patent','marca','propietat industrial','producte fals','comerç'],summary:'La fabricació, importació, possessió, ús o comercialització no autoritzada de determinats objectes protegits per patents, models o altres drets de propietat industrial pot constituir delicte.'},
{id:'cp-278',article:'278',title:'Descobriment de secrets d’empresa',keywords:['secret d’empresa','empresa','documents','informació confidencial'],summary:'Apoderar-se de dades, documents o suports per descobrir un secret d’empresa pot constituir delicte. La difusió o cessió posterior pot comportar una pena més greu.'},
{id:'cp-351',article:'351',title:'Incendi amb perill per a les persones',keywords:['incendi','foc','perill','edifici','persones'],summary:'Provocar un incendi que comporti perill per a la vida o la integritat física de les persones pot constituir delicte greu, amb pena de presó de 10 a 20 anys, sens perjudici d’altres conseqüències.'},
{id:'cp-352',article:'352',title:'Incendi forestal',keywords:['incendi forestal','bosc','forestal','muntanya','foc'],summary:'Incendiar monts o masses forestals pot constituir delicte. La pena general prevista és de presó d’1 a 5 anys i multa, amb agreujaments quan hi ha perill per a les persones o especial gravetat.'},
{id:'cp-380',article:'380',title:'Conducció temerària',keywords:['conducció temerària','temeritat','perill','trànsit','conduir'],summary:'Conduir amb temeritat manifesta i posar en concret perill la vida o la integritat de les persones pot constituir delicte. La pena és de presó de 6 mesos a 2 anys i privació del dret a conduir d’1 a 6 anys.'},
{id:'cp-381',article:'381',title:'Conducció amb menyspreu manifest per la vida',keywords:['menyspreu vida','conducció','temerària','trànsit','perill'],summary:'La conducció amb menyspreu manifest per la vida dels altres comporta un règim penal especialment greu. Les penes poden arribar a 5 anys de presó i a 10 anys de privació del dret a conduir.'},
{id:'cp-383',article:'383',title:'Negativa a les proves d’alcohol o drogues',keywords:['negativa','prova alcohol','prova drogues','alcoholèmia','agent'],summary:'Negar-se, quan ho requereix un agent de l’autoritat, a sotmetre’s a les proves legalment establertes d’alcoholèmia o drogues pot constituir delicte. La pena és de presó de 6 mesos a 1 any i privació del dret a conduir d’1 a 4 anys.'},
{id:'cp-385',article:'385',title:'Creació de risc greu per a la circulació',keywords:['risc trànsit','obstacles','senyalització','via pública','circulació'],summary:'Originar un greu risc per a la circulació col·locant obstacles, vessant substàncies perilloses, alterant la senyalització o no restablint la seguretat quan existeix obligació de fer-ho pot constituir delicte.'},
{id:'cp-468',article:'468',title:'Quebrantament de condemna o mesura',keywords:['quebrantament','ordre judicial','prohibició','allunyament','mesura cautelar'],summary:'Incomplir una condemna, mesura de seguretat, presó, mesura cautelar o determinades prohibicions imposades judicialment pot constituir delicte de quebrantament, amb conseqüències que depenen del supòsit.'}
];
const existing=new Set(CURATED_CP.map(x=>String(x.article)));
EXTRA.forEach(x=>{if(!existing.has(String(x.article)))CURATED_CP.push(x)});
function addPoliceQuick(){
 const hero=document.querySelector('.cp-hero');
 if(!hero||hero.parentElement.querySelector('.codex-police-quick'))return;
 const box=document.createElement('section');
 box.className='codex-police-quick';
 box.innerHTML='<div class="quick-title">⚡ Consultes policials</div><div class="quick-grid">'+[
 ['Negativa alcohol/drogues','negativa'],['Conducció temerària','conducció temerària'],['Omissió d’auxili','auxili'],['Intimitat i dades','intimitat'],['Entrada en local','local'],['Quebrantament','quebrantament']
 ].map(x=>'<button type="button" data-codex-q="'+x[1]+'">'+x[0]+'</button>').join('')+'</div>';
 hero.parentElement.insertBefore(box,hero.nextElementSibling);
 box.querySelectorAll('[data-codex-q]').forEach(b=>b.onclick=()=>{const i=document.getElementById('search-input');if(i){i.value=b.dataset.codexQ; if(typeof search==='function')search(b.dataset.codexQ);i.focus();}});
}
function init(){addPoliceQuick();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
const mo=new MutationObserver(()=>addPoliceQuick());
if(document.body)mo.observe(document.body,{subtree:true,childList:true});
})();
