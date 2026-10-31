import fs from 'fs';
import path from 'path';

const filePath = path.join('node_modules', 'whatsapp-web.js', 'src', 'util', 'Injected', 'Utils.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('delete message.__x_id;')) {
    content = content.replace('if (botOptions) {', 'delete message.__x_id;\n        if (botOptions) {');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ [Patch] Successfully patched whatsapp-web.js (__x_id fix)');
  }
}
