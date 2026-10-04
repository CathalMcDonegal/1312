/* Carrega els articles complets del Codi Penal generats des del BOE */
(async function(){
  try{
    const r=await fetch('data/codi-penal.json',{cache:'no-store'});
    if(!r.ok) throw new Error('No es pot carregar el Codi Penal');
    const payload=await r.json();
    if(!Array.isArray(payload.data)||payload.data.length<700) throw new Error('Dades incompletes');
    const curatedByArticle=new Map(CURATED_CP.map(x=>[String(x.article).toLowerCase(),x]));
    state.data['codi-penal']=payload.data.map(x=>{
      const c=curatedByArticle.get(String(x.article).toLowerCase());
      return c ? {...x,title:c.title,keywords:c.keywords,summary:c.summary} : x;
    });
    if(typeof hero==='function') hero();
  }catch(e){
    console.warn('1312: Codi Penal complet no disponible encara',e);
  }
})();
