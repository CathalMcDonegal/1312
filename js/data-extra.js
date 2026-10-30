/* Actua — actuacions addicionals (s'afegeixen a ACT) */
ACT.push(
{id:'genere',i:'🛡️',c:'#be123c',t:'Violència de gènere i domèstica',s:'Protecció de la víctima i atestat',refs:['LO 1/2004','CP art. 153 i 173.2','LECrim art. 544 ter','Llei 4/2015 (Estatut de la víctima)'],steps:[
['Assegura la seguretat','Separa l’agressor de la víctima i dels menors presents. No els deixis sols en cap moment.'],
['Atén la víctima','Valora lesions i sol·licita assistència sanitària si cal. Parla amb ella de manera separada i en un lloc segur.'],
['Valora la flagrància','Si hi ha delicte flagrant, procedeix a la detenció de l’agressor (vegeu «Detenció»).'],
['Informa dels seus drets','Assistència, protecció, ordre de protecció i recursos disponibles, en un llenguatge comprensible. Telèfons: 016 i 900 900 120 (Eines).'],
['Valora el risc','Aplica la valoració policial del risc segons el protocol vigent (p. ex. VioGén).'],
['Recull proves','Lesions, fotografies, testimonis (també veïns i menors), gravacions del 112 i danys materials.'],
['Sol·licita l’ordre de protecció','Si escau, tramita-la a l’autoritat judicial (art. 544 ter LECrim).'],
['Instrueix l’atestat','Remet-lo al jutjat de guàrdia i fes constar la valoració del risc i les mesures adoptades.']],
avis:'No proposis mediació ni conciliació. Informa sempre la víctima de la possibilitat de rebre protecció, encara que dubti de denunciar.'},
{id:'menors',i:'🧒',c:'#0d9488',t:'Menors d’edat',s:'Detenció i atenció (LO 5/2000)',refs:['LO 5/2000','CE art. 17'],steps:[
['Determina l’edat','Menor de 14 anys: no s’aplica la LO 5/2000. De 14 a 17: responsabilitat penal del menor.'],
['Menor de 14 anys','No es detén. Lliura’l als representants legals o als serveis de protecció de menors i informa’n.'],
['De 14 a 17 anys: tracte adequat','Mantén-lo separat dels adults a les dependències i amb ús mínim de força.'],
['Informa dels drets','Amb llenguatge entenedor. Té dret a advocat i a l’assistència dels pares o tutors.'],
['Comunica la detenció','Immediatament als representants legals i a la Fiscalia de Menors.'],
['Respecta el termini','La detenció ha de durar el temps estrictament necessari i, com a màxim, 24 hores abans de lliurar-lo en llibertat o a disposició del Ministeri Fiscal.'],
['Instrueix i remet','Atestat a la Fiscalia de Menors, amb la relació de les actuacions i les circumstàncies personals.']],
avis:'Si el menor és víctima, prioritza la protecció i comunica-ho als serveis de protecció de menors competents.'},
{id:'domicili',i:'🏠',c:'#4f46e5',t:'Entrada i registre en domicili',s:'Consentiment, mandat o flagrància',refs:['CE art. 18.2','LECrim arts. 545-572','CP art. 202'],steps:[
['Identifica el títol habilitant','Només es pot entrar amb consentiment del titular, resolució judicial o delicte flagrant (CE art. 18.2).'],
['Consentiment','Ha de ser lliure, informat i de qui pot atorgar-lo. Fes-ne constar l’acte i la identitat.'],
['Mandat judicial','Comprova l’abast: domicili, objecte, termini i persones.'],
['Flagrància','Evidència immediata i necessitat urgent. Deixa escrits els motius objectius que van justificar l’entrada.'],
['Practica el registre','En presència del titular o del seu representant i de testimonis, evitant danys innecessaris.'],
['Aixeca acta','Descriu el lloc, el que es troba i s’intervé. Mantén la cadena de custòdia dels efectes.'],
['Comunica-ho a l’autoritat judicial','Remet l’atestat i, si escau, els efectes intervinguts.']],
avis:'Una entrada sense cobertura legal pot comportar responsabilitat penal (CP art. 202) i la nul·litat de les proves.'},
{id:'atestat',i:'📝',c:'#475569',t:'Atestat policial',s:'Estructura i remissió',refs:['LECrim arts. 282, 284, 292, 293'],steps:[
['Diligència d’inici','Hora, lloc, agents actuants i motiu de la intervenció.'],
['Relat dels fets','Descriu els fets de manera cronològica, objectiva i sense valoracions.'],
['Identifica les persones','Víctimes, denunciats, detinguts i testimonis, amb les seves dades.'],
['Drets i comunicacions','Fes constar la lectura de drets, les comunicacions fetes i l’assistència d’advocat.'],
['Diligències practicades','Inspecció ocular, proves, declaracions, fotografies i informes (alcoholèmia, lesions, etc.).'],
['Efectes intervinguts','Relació d’efectes i cadena de custòdia.'],
['Comunica i remet','Comunica-ho a l’autoritat judicial o al Ministeri Fiscal i remet l’atestat (art. 284 LECrim).']],
avis:'Revisa que les dades, hores i signatures siguin coherents abans de remetre l’atestat.'}
);
if(typeof tab!=='undefined'&&tab==='home')render();
