import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pages = ['index.html', 'provas.html', 'desempenho.html', 'erros.html', 'revisoes.html', 'semana.html'];

test('plataforma usa páginas separadas para as áreas principais', () => {
  for (const page of pages) {
    assert.equal(fs.existsSync(page), true, `${page} deve existir`);
  }
});

test('home não empilha todas as telas na mesma página', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.equal(html.includes('id="desempenho"'), false);
  assert.equal(html.includes('id="atencao"'), false);
  assert.equal(html.includes('id="provas"'), false);
  assert.equal(html.includes('id="semana"'), false);
});

test('navegação principal aponta para páginas reais', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  for (const target of ['provas.html', 'desempenho.html', 'erros.html', 'revisoes.html', 'semana.html']) {
    assert.equal(html.includes(target), true, `home deve apontar para ${target}`);
  }
});
