/* Codex — ampliació de consulta dels mòduls jurídics. Síntesis de consulta, no text oficial. */
(function(){
'use strict';
const PLUS={
lecrim:[
['2','Acció penal i procediment','acció penal denúncia delicte procediment','La denúncia posa els fets en coneixement de l’autoritat competent i activa les actuacions que corresponguin.'],
['11','Nul·litat d’actuacions','nul·litat actuacions processals','Les actuacions practicades fora dels requisits essencials poden quedar sotmeses al règim de nul·litat previst legalment.'],
['14','Competència penal','competència jurisdicció tribunal','Determina criteris generals de competència dins de l’ordre penal.'],
['17','Responsabilitat civil','responsabilitat civil delicte perjudicat indemnització','El procediment penal pot comprendre les responsabilitats civils derivades del delicte en els termes legals.'],
['109','Acció civil','acció civil perjudicat reparació dany','La persona perjudicada pot exercir les accions que li corresponguin per obtenir la reparació del dany.'],
['262','Obligació de denunciar','obligació denunciar delicte autoritat','Determinades persones tenen el deure de posar en coneixement de l’autoritat els delictes que coneguin.'],
['263','Exempcions de denúncia','exempció denunciar familiars secret professional','La llei estableix excepcions i matisos al deure general de denunciar.'],
['264','Denúncia del delicte','denúncia policia jutjat fiscal','La denúncia pot formular-se davant les autoritats i funcionaris habilitats en els termes legals.'],
['282 bis','Agent encobert','agent encobert policia investigació autorització','Regula l’ús de l’agent encobert en investigacions de determinats delictes, amb autorització i garanties específiques.'],
['492 bis','Detenció i requisits','detenció requisits policia agent','La detenció policial ha d’ajustar-se als supòsits i garanties establerts per la llei.'],
['496','Posada en llibertat','llibertat detingut termini policia','La persona detinguda ha de ser posada en llibertat o a disposició judicial dins dels terminis legals.'],
['505','Presó provisional','presó provisional compareixença mesures cautelars','Regula la compareixença i els requisits de les mesures cautelars personals.'],
['588 bis','Intervencions telefòniques','telèfon escolta intervenció comunicacions judicial','Les intervencions de comunicacions requereixen els pressupòsits, autorització i control previstos legalment.'],
['770.2','Inspecció ocular','inspecció ocular policia atestat urgències','En les diligències urgents es practiquen actuacions per assegurar proves i deixar-ne constància.'],
['795','Judici ràpid','judici ràpid procediment atestat delictes','Regula l’àmbit del procediment per a l’enjudiciament ràpid de determinats delictes.']
],
circulacio:[
['3','Responsabilitat dels usuaris','responsabilitat conductor via seguretat','Els usuaris de la via han d’actuar amb diligència i respecte a la seguretat dels altres.'],
['5','Competències','competències trànsit municipi autoritat','Distribueix competències administratives en matèria de trànsit i seguretat viària.'],
['11','Menors','menors sistemes retenció conductor seguretat','Estableix obligacions específiques de protecció dels menors en els vehicles.'],
['15','Proves d’alcohol i drogues','proves alcohol drogues conductor agents','Les proves es practiquen en els casos i amb els procediments establerts per la normativa.'],
['17','Control del vehicle','control vehicle conductor atenció conducció','El conductor ha de mantenir el control i una atenció adequada durant la conducció.'],
['19','Càrrega','càrrega vehicle transport seguretat','La càrrega ha d’anar disposada de manera segura i sense comprometre l’estabilitat o la visibilitat.'],
['21','Velocitats específiques','velocitat específica via vehicle límit','Els límits poden variar segons via, vehicle i circumstàncies.'],
['27','Casc','casc motocicleta ciclomotor seguretat','Regula l’ús dels cascos i les excepcions legalment previstes.'],
['36','Autopistes i autovies','autopista autovia circulació prohibició','Estableix regles específiques de circulació per autopistes i autovies.'],
['37','Marxa enrere','marxa enrere maniobra prohibició','La marxa enrere només pot efectuar-se dins dels límits i amb les precaucions establertes.'],
['52','Canvis de sentit','canvi sentit maniobra prohibició','Regula quan i com es pot efectuar un canvi de sentit.'],
['53','Interseccions','intersecció cruïlla prioritat senyalització','La prioritat a les interseccions depèn de la senyalització i de les regles generals.'],
['65','Potestat sancionadora','competència sanció trànsit administració','Determina qui pot exercir la potestat sancionadora en funció de la infracció.'],
['93','Procediment sancionador','multa notificació trànsit procediment','Estableix aspectes del procediment administratiu sancionador de trànsit.'],
['105','Retirada del vehicle','retirada grua vehicle via pública','Preveu supòsits de retirada i dipòsit del vehicle quan concorrin les circumstàncies legals.']
],
seguretat:[
['1','Objecte de la llei','seguretat ciutadana objecte drets llibertats','La llei estableix el marc general de protecció de la seguretat ciutadana compatible amb els drets i llibertats.'],
['2','Àmbit d’aplicació','àmbit aplicació seguretat ciutadana','Determina l’àmbit material i territorial d’aplicació de la norma.'],
['3','Finalitats','finalitats seguretat ciutadana prevenció','Defineix finalitats de protecció de persones, béns i convivència dins del marc legal.'],
['4','Principis d’actuació','proporcionalitat necessitat idoneïtat seguretat','Les actuacions han de respectar els principis de legalitat, proporcionalitat i control.'],
['7','Deure de col·laboració','col·laboració policia requeriment informació','Regula el deure de col·laborar amb les autoritats i agents quan la llei ho exigeix.'],
['14','Ordres i requeriments','ordre requeriment agents autoritat','Les autoritats poden impartir ordres i requeriments dins de les seves competències.'],
['19','Mesures de seguretat','mesures seguretat preventiva policia','Permet adoptar mesures preventives en els supòsits legalment habilitats.'],
['21','Mesures extraordinàries','emergència seguretat ordre públic','Preveu mesures específiques davant situacions que comprometin greument la seguretat ciutadana.'],
['23','Reunions i manifestacions','manifestació reunió via pública seguretat','Les actuacions policials s’han d’ajustar al règim constitucional i legal.'],
['25','Armes','armes prohibides via pública seguretat','Regula obligacions i limitacions relacionades amb armes i altres instruments perillosos.'],
['26','Espectacles','espectacles activitats recreatives seguretat','Preveu actuacions de prevenció i control en espectacles i activitats recreatives.'],
['32','Òrgans competents','competència sancionadora delegació seguretat ciutadana','Distribueix competències per a la tramitació i resolució dels expedients sancionadors.'],
['33','Graduació de sancions','graduació sanció reincidència proporcionalitat','La sanció s’ha de graduar segons els criteris establerts per la norma.'],
['34','Classificació d’infraccions','infraccions molt greus greus lleus','La llei diferencia les infraccions segons la seva gravetat.'],
['39','Sancions','multa sanció seguretat ciutadana quantia','Estableix el règim general de multes i altres conseqüències administratives.']
],
ordenanca:[
['2','Àmbit d’aplicació','Barcelona ordenança espai públic convivència','S’aplica a les conductes regulades que tenen lloc en els espais inclosos en el seu àmbit.'],
['3','Principis de convivència','civisme respecte convivència Barcelona','La convivència a l’espai públic es basa en respecte, tolerància i ús responsable.'],
['10','Protecció de menors','menors protecció espai públic Barcelona','Preveu especial protecció de les persones menors en determinades situacions de risc o convivència.'],
['20','Ús de l’espai públic','ús espai públic convivència ocupació','L’ús de l’espai públic no pot impedir injustificadament els drets dels altres usuaris.'],
['30','Contaminació acústica','soroll música molèsties nit Barcelona','Les activitats sorolloses han de respectar les condicions municipals i la convivència.'],
['31','Soroll en habitatges','soroll veïns habitatge molèsties','Les molèsties acústiques poden quedar sotmeses a les normes municipals i sectorials aplicables.'],
['35','Venda ambulant','venda ambulant espai públic Barcelona','Regula determinades activitats de venda o oferta de productes a l’espai públic.'],
['40','Comerç i activitats','comerç activitat via pública autorització','Determinades ocupacions o activitats requereixen autorització i condicions específiques.'],
['45','Mobiliari urbà','mobiliari bancs fonts papereres danys','Protegeix els elements de mobiliari i equipament públic.'],
['49','Begudes i convivència','begudes alcohol espai públic convivència','Estableix limitacions sobre determinades formes de consum que afecten la convivència.'],
['52','Jocs i activitats','jocs pilota bicicleta espai públic','Regula activitats lúdiques quan poden generar riscos o interferències amb altres usuaris.'],
['57','Residus','residus contenidors papereres neteja','Estableix obligacions relacionades amb dipòsit i gestió correcta dels residus a la via pública.'],
['61','Animals de companyia','gossos animals corretja excrements Barcelona','Regula la presència i conducta dels animals de companyia a l’espai públic.'],
['69','Platja i bany','platja bany comportament Barcelona convivència','Estableix normes específiques per preservar seguretat, higiene i convivència a les platges.'],
['102','Responsabilitat sancionadora','responsabilitat sanció ordenança Barcelona','El règim sancionador municipal determina responsabilitats, procediment i conseqüències segons la infracció.']
]};
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function key(){const p=document.querySelector('.panel.active');return p&&PLUS[p.id]?p.id:null}
function render(k,q){const p=document.getElementById(k), n=norm(q);if(!p)return false;const rows=PLUS[k].filter(x=>!n||norm(x.join(' ')).includes(n));if(!rows.length)return false;let old=p.querySelector('.plus-results');if(old)old.remove();const w=document.createElement('div');w.className='norm-results plus-results';w.innerHTML='<div class="norm-results-head"><strong>'+rows.length+' resultats ampliats</strong><span>Codex · síntesi de consulta</span></div>'+rows.map(x=>'<article class="norm-card"><div class="norm-card-art">Art. '+x[0]+'</div><h3>'+x[1]+'</h3><div class="norm-section"><b>Què regula?</b><p>'+x[3]+'</p></div><div class="norm-source">Font: '+(k==='lecrim'?'LECrim':k==='circulacio'?'Llei de trànsit':k==='seguretat'?'LO 4/2015':'Ordenança Barcelona')+'</div></article>').join('');p.appendChild(w);return true}
function init(){const input=document.getElementById('search-input');if(!input)return;input.addEventListener('input',e=>{const k=key();if(!k)return;const q=input.value.trim();if(render(k,q)){e.stopImmediatePropagation();e.preventDefault()}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
