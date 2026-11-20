// Rebuild DocMkr's complete static runtime from its maintained source modules.
import {build} from 'rolldown';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(process.argv[2] || dirname(fileURLToPath(import.meta.url))+'/..');
await build({
  input:resolve(root,'apps/docmkr/src/app.js'),
  plugins:[{name:'local-versioned-imports',resolveId(source,importer){
    if(source.startsWith('.') && source.includes('?'))return resolve(dirname(importer),source.split('?')[0]);
  }}],
  output:{file:resolve(root,'apps/docmkr/app.bundle.js'),format:'iife',minify:true},
});
