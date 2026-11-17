// Conferências de arquivos do projeto.
// Na pasta principal, execute: node tests/estrutura.mjs

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const ler = arquivo => fs.readFileSync(arquivo, 'utf8');
const index = ler('index.html');
const nomes = ['01-dados', '02-telas', '03-navegacao', '04-interacoes', '05-formularios'];

for (const nome of nomes) {
  const arquivo = 'js/' + nome + '.js';
  assert.ok(index.includes(arquivo), 'Falta incluir ' + arquivo);
  execFileSync(process.execPath, ['--check', arquivo]);
}
console.log('OK: os cinco JS carregam e não têm erros de sintaxe.');

const paginas = [
  'templates/01-paginas.html',
  'templates/02-painel.html',
  'templates/03-componentes.html',
  'templates/04-janelas.html'
];
const html = paginas.map(ler).join('\n');
const ids = [...html.matchAll(/<script[^>]*id="([^"]+)"/g)].map(match => match[1]);
const javascript = nomes.map(nome => ler('js/' + nome + '.js')).join('\n');
const usados = [...javascript.matchAll(/htmlTela\s*\(\s*["']([^"']+)["']/g)]
  .map(match => match[1]);

assert.equal(ids.length, new Set(ids).size, 'Existe modelo HTML com ID repetido.');
for (const id of usados) {
  assert.ok(ids.includes(id), 'Falta o modelo HTML ' + id);
}
console.log('OK: modelos HTML chamados pelo JavaScript existem.');

const css = ler('style.css');
const importacoes = [...css.matchAll(/@import url\(["']?([^"'\)]+)/g)];
for (const item of importacoes) {
  assert.ok(fs.existsSync(item[1]), 'Falta arquivo de CSS ' + item[1]);
}
console.log('OK: estilos CSS importados existem.');
