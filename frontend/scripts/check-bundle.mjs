// Fails the build when the JavaScript needed for first paint grows past the budget.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = new URL('../dist/', import.meta.url).pathname;
// React 19 + React Router + TanStack Query alone are ~105 kB; every page is lazy-loaded on top of this.
const INITIAL_JS_BUDGET_KB = 180;

const kb = (bytes) => bytes / 1024;
const gzipKb = (file) => kb(gzipSync(readFileSync(join(DIST, file))).length);

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
// The entry module plus everything Vite asks the browser to preload with it.
const initial = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((match) => match[1]);

const rows = readdirSync(join(DIST, 'assets'))
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => ({ file: `assets/${file}`, gzip: gzipKb(`assets/${file}`) }))
  .sort((a, b) => b.gzip - a.gzip);

console.log('\nAsset sizes (gzip):');
for (const { file, gzip } of rows) {
  console.log(`  ${initial.includes(file) ? '*' : ' '} ${gzip.toFixed(1).padStart(7)} kB  ${file}`);
}

const initialTotal = initial.reduce((acc, file) => acc + gzipKb(file), 0);
console.log(`\n* initial JS: ${initialTotal.toFixed(1)} kB gzip (budget ${INITIAL_JS_BUDGET_KB} kB)\n`);

if (initialTotal > INITIAL_JS_BUDGET_KB) {
  console.error('Initial JavaScript is over budget. Lazy-load the new dependency or route.');
  process.exit(1);
}
