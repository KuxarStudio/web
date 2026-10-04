// Uso: node scripts/indexnow/run.mjs --before <sha> --after <sha> [--dry-run]
// Se ejecuta tras desplegar (ver .github/workflows/deploy.yml). Nunca rompe el despliegue:
// si IndexNow falla, solo lo cuenta en el log.
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildPayload, urlsFromChangedFiles } from './lib.mjs';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const dry = process.argv.includes('--dry-run');
const before = arg('before');
const after = arg('after') ?? 'HEAD';
const zeros = /^0+$/;

if (!before || zeros.test(before)) {
  console.log('IndexNow: sin commit anterior (primer push o ejecución manual); no hay nada que notificar.');
  process.exit(0);
}

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.log('IndexNow: no hay archivo de clave en public/; nada que hacer.');
  process.exit(0);
}
const key = keyFile.replace(/\.txt$/, '');

let files;
try {
  files = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', before, after], { encoding: 'utf8' }).split('\n').filter(Boolean);
} catch (e) {
  console.log(`IndexNow: no se pudo calcular el diff (${e.message.split('\n')[0]}); se omite.`);
  process.exit(0);
}

const urls = urlsFromChangedFiles(files);
if (!urls.length) {
  console.log('IndexNow: ninguna URL de contenido ha cambiado.');
  process.exit(0);
}
const payload = buildPayload({ host: new URL(urls[0]).host, key, urls });
console.log(`IndexNow: ${urls.length} URL(s)\n${urls.map((u) => `  ${u}`).join('\n')}`);
if (dry) process.exit(0);

try {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  // 200/202 = aceptado. 403 = la clave no se pudo verificar todavía; 422 = URLs que no son del host.
  console.log(`IndexNow: respuesta ${res.status} ${res.statusText}`);
} catch (e) {
  console.log(`IndexNow: error de red (${e.message}); se omite.`);
}
