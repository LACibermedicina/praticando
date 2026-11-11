/* Camada de banco compartilhado para o radIA.M3D: fala com server.js (/api/db). Sem servidor, o app usa só o armazenamento local. */
(function(){
 const j=(u,o)=>fetch(u,o).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
 const split=p=>{const i=p.indexOf('/');return [p.slice(0,i),p.slice(i+1)]};
 const mk=x=>({id:x.id,data:()=>x.data});
 const snap=(l,ch)=>({docs:l.map(mk),docChanges:()=>ch,size:l.length,empty:!l.length});
 async function list(col,ord,lim){let l=await j('/api/db/'+encodeURIComponent(col));
  if(ord)l.sort((a,b)=>{const x=a.data[ord.f],y=b.data[ord.f];return (x>y?1:x<y?-1:0)*(ord.d==='desc'?-1:1)});
  return lim?l.slice(0,lim):l}
 function Query(col,ord,lim){return{
  orderBy(f,d){return Query(col,{f,d:d||'asc'},lim)},limit(n){return Query(col,ord,n)},
  async get(){return snap(await list(col,ord,lim),[])},
  onSnapshot(cb,err){let prev=null,stop=false;const tick=async()=>{if(stop)return;try{const l=await list(col,ord,lim),pm=new Map((prev||[]).map(x=>[x.id,JSON.stringify(x.data)])),cm=new Map(l.map(x=>[x.id,JSON.stringify(x.data)])),ch=[];
    l.forEach(x=>{if(!pm.has(x.id))ch.push({type:'added',doc:mk(x)});else if(pm.get(x.id)!==cm.get(x.id))ch.push({type:'modified',doc:mk(x)})});
    (prev||[]).forEach(x=>{if(!cm.has(x.id))ch.push({type:'removed',doc:mk(x)})});
    const first=prev===null;prev=l;if(first||ch.length)cb(snap(l,ch))}catch(e){err&&err(e)}setTimeout(tick,2500)};tick();return()=>{stop=true}}}}
 const DB={doc(p){const [c,i]=split(p),u='/api/db/'+encodeURIComponent(c)+'/'+encodeURIComponent(i);
  return{set:d=>j(u,{method:'PUT',body:JSON.stringify(d)}),delete:()=>j(u,{method:'DELETE'}),async get(){const x=(await list(c)).find(v=>v.id===i);return{exists:!!x,data:()=>x&&x.data}}}},collection:c=>Query(c)};
 window.claude={use:async n=>{if(n!=='db')throw new Error('recurso indisponível: '+n);await j('/api/ping');return DB}};
})();
