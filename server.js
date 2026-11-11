#!/usr/bin/env node
/* Servidor do radIA.M3D: arquivos estáticos + banco JSON compartilhado (sem dependências). */
const http=require('http'),fs=require('fs'),path=require('path'),https=require('https');
const PORT=process.env.PORT||8080,HOST=process.env.HOST||'0.0.0.0',ROOT=__dirname,DATA=path.join(ROOT,'data'),FILE=path.join(DATA,'db.json');
fs.mkdirSync(DATA,{recursive:true});
let db={};try{db=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch(e){}
let t=null;const flush=()=>{clearTimeout(t);t=setTimeout(()=>fs.writeFile(FILE,JSON.stringify(db),()=>{}),300)};
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const V=path.join(ROOT,'vendor','three.min.js');
if(!fs.existsSync(V)){fs.mkdirSync(path.dirname(V),{recursive:true});
 https.get('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',r=>{if(r.statusCode!==200){r.resume();return}const f=fs.createWriteStream(V);r.pipe(f);f.on('finish',()=>console.log('three.js salvo em vendor/ (funciona offline)'))}).on('error',()=>console.log('Sem internet: o navegador carregará o three.js do CDN.'))}
const send=(res,c,b)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(b))};
http.createServer((req,res)=>{let p;try{p=decodeURIComponent(new URL(req.url,'http://x').pathname)}catch(e){return send(res,400,{error:'url'})}
 if(p==='/api/ping')return send(res,200,{ok:true});
 const m=p.match(/^\/api\/db\/([^/]+)(?:\/(.+))?$/);
 if(m){const col=m[1],id=m[2];db[col]=db[col]||{};
  if(req.method==='GET'&&!id)return send(res,200,Object.entries(db[col]).map(([k,v])=>({id:k,data:v})));
  if(req.method==='PUT'&&id){let b='';req.on('data',d=>{b+=d;if(b.length>2e6)req.destroy()});req.on('end',()=>{try{db[col][id]=JSON.parse(b);flush();send(res,200,{ok:true})}catch(e){send(res,400,{error:'json'})}});return}
  if(req.method==='DELETE'&&id){delete db[col][id];flush();return send(res,200,{ok:true})}
  return send(res,405,{error:'method'})}
 const f=path.normalize(path.join(ROOT,p==='/'?'index.html':p));
 if(!f.startsWith(ROOT+path.sep)||f.startsWith(DATA)||/(server\.js|set-root-password\.js|\.sh|\.bat|Dockerfile)$/.test(f))return send(res,404,{error:'não encontrado'});
 fs.readFile(f,(e,d)=>{if(e)return send(res,404,{error:'não encontrado'});res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});res.end(d)})
}).listen(PORT,HOST,()=>console.log(`radIA.M3D rodando em http://localhost:${PORT}  (banco: data/db.json)`));
