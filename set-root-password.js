/* Uso: node set-root-password.js NOVA_SENHA   (troca a senha padrão do superusuário root) */
const fs=require('fs'),c=require('crypto'),p=process.argv[2];
if(!p||p.length<6){console.log('Uso: node set-root-password.js NOVA_SENHA   (mínimo 6 caracteres)');process.exit(1)}
const h=c.createHash('sha256').update('radia.root'+p).digest('hex'),f=__dirname+'/index.html',s=fs.readFileSync(f,'utf8');
const n=s.replace(/(const ROOT=\{u:'root',salt:'radia\.root',h:')[0-9a-f]{64}(')/,'$1'+h+'$2');
if(n===s){console.log('Nada alterado (a senha já é essa ou o padrão não foi encontrado).');process.exit(1)}
fs.writeFileSync(f,n);console.log('Senha do root atualizada. Recarregue a página (Ctrl+F5).');
