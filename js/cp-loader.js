/* Carrega els articles complets del Codi Penal generats des del BOE */
(async function(){
  try{
    let payload;
    let r=await fetch('data/codi-penal.json',{cache:'no-store'});
    if(r.ok) payload=await r.json();
    if(!payload || !Array.isArray(payload.data) || payload.data.length<700){
      r=await fetch('data/normativa-oficial.json',{cache:'no-store'});
      if(!r.ok) throw new Error('No es poden carregar les dades');
      payload=await r.json();
    }
    const items=payload.data?.['codi-penal'] || payload.data;
    if(!Array.isArray(items)||items.length<700) throw new Error('Dades incompletes');
    const curatedByArticle=new Map(CURATED_CP.map(x=>[String(x.article).toLowerCase(),x]));
    state.data['codi-penal']=items.map(x=>{
      const c=curatedByArticle.get(String(x.article).toLowerCase());
      return c ? {...x,title:c.title,keywords:c.keywords,summary:c.summary} : x;
    });
    if(typeof hero==='function') hero();
  }catch(e){
    console.warn('1312: Codi Penal complet no disponible encara',e);
  }
})();
