// Rebuild only the PowerPoint renderer in the migrated static runtime.
// Other bundled features retain their shipped implementation. Source-module
// consumers use the same renderer through src/file-import.js.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {parse} from 'acorn';
import {build} from 'rolldown';
const root=resolve(process.argv[2] || dirname(fileURLToPath(import.meta.url))+'/..');
const app=join(root,'apps/docmkr'),bundlePath=join(app,'app.bundle.js');
const start='/* docmkr-pptx-renderer:start */',end='/* docmkr-pptx-renderer:end */';
let runtime=await readFile(bundlePath,'utf8');
if(runtime.startsWith(start)){
 const boundary=runtime.indexOf(end);if(boundary<0)throw Error('Incomplete renderer boundary.');
 runtime=runtime.slice(boundary+end.length).replace(/^\s+/,'');
}
const ast=parse(runtime,{ecmaVersion:'latest'}),functions=[];
function walk(node){
 if(!node||typeof node!=='object')return;
 if(node.type==='FunctionDeclaration')functions.push({name:node.id.name,node,source:runtime.slice(node.start,node.end)});
 if(node.type==='VariableDeclarator'&&node.id.type==='Identifier'&&['ArrowFunctionExpression','FunctionExpression'].includes(node.init?.type))functions.push({name:node.id.name,node:node.init,source:runtime.slice(node.init.start,node.init.end)});
 for(const val of Object.values(node))if(Array.isArray(val))val.forEach(walk);else if(val&&typeof val==='object')walk(val);
}
walk(ast);
const shortest=predicate=>functions.filter(predicate).sort((a,b)=>a.source.length-b.source.length)[0];
const old=shortest(f=>f.node.type==='FunctionDeclaration'&&f.source.includes('No slides found in this PowerPoint file.'));
if(old){
 const helpers={
  readXml:shortest(f=>f.source.includes('Missing document component:')),
  relationships:shortest(f=>f.source.includes('TargetMode')&&f.source.includes('External')),
  zipImage:shortest(f=>f.source.includes('application/octet-stream')&&f.source.includes('uint8array')&&f.source.includes('.file(')),
  attribute:shortest(f=>f.source.includes('attributes')&&f.source.includes('localName')&&f.source.includes('.find(')&&f.source.endsWith('?.value')),
 };
 for(const [key,helper]of Object.entries(helpers))if(!helper||!old.source.includes(helper.name+'('))throw Error('Cannot safely identify existing '+key+' helper.');
 const param=old.node.params[0];if(param.type!=='Identifier')throw Error('Unexpected renderer signature.');
 const delegate=`async function ${old.name}(${param.name}){return DocMkrPowerPoint.pptxPdf(${param.name},{${Object.entries(helpers).map(([key,f])=>key+':'+f.name).join(',')}})}`;
 runtime=runtime.slice(0,old.node.start)+delegate+runtime.slice(old.node.end);
}else if(!functions.some(f=>f.node.type==='FunctionDeclaration'&&/return DocMkrPowerPoint\.pptxPdf\(/.test(f.source))){
 throw Error('The runtime does not contain a recognized PowerPoint renderer.');
}
const temp=await mkdtemp(join(tmpdir(),'docmkr-pptx-'));
try{
 const output=join(temp,'renderer.js');
 await build({input:join(app,'src/pptx-import.js'),output:{file:output,format:'iife',name:'DocMkrPowerPoint',minify:true}});
 await writeFile(bundlePath,start+'\n'+await readFile(output,'utf8')+'\n'+end+'\n'+runtime);
}finally{await rm(temp,{recursive:true,force:true});}
console.log('Updated DocMkr PowerPoint renderer: '+root);
