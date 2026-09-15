# Joyce • Estudos

Plataforma pessoal de preparação para residência médica da Dra. Joyce Radis.

O objetivo não é apenas armazenar provas: o projeto organiza **progresso, desempenho, erros recorrentes, revisões e prioridade de estudo** ao longo do tempo.

## Estado atual

- ENARE 2026: **30/100 questões concluídas**.
- Não há percentuais de acerto inventados.
- O painel só calcula desempenho quando `data/questoes.json` possui questões com `correct: true` ou `correct: false`.
- `Atenção agora` é calculado por `js/study-engine.js` a partir de erros e revisões reais.

## Estrutura

```text
Estudos-Dra-Joyce-Radis/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── analytics.js
│   └── study-engine.js
├── data/
│   ├── provas.json
│   ├── questoes.json
│   ├── erros.json
│   └── revisoes.json
├── tests/
│   ├── analytics.test.mjs
│   └── study-engine.test.mjs
└── package.json
```

## Responsabilidades

- `index.html`: estrutura e navegação do dashboard.
- `css/styles.css`: design responsivo mobile-first.
- `js/app.js`: carrega os dados e renderiza a interface.
- `js/analytics.js`: calcula progresso, acerto geral e desempenho por área.
- `js/study-engine.js`: ordena prioridades por recorrência, recência e atraso de revisão.
- `data/*.json`: camada de dados versionada e independente da interface.

## Como visualizar localmente

Por usar `fetch()` para carregar JSON, não abra apenas o arquivo `index.html` no Finder. Rode um servidor local:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Testes

Requer Node.js 20+.

```bash
npm test
```

Os testes cobrem o comportamento que não pode regredir:

- métricas ignoram questões sem correção;
- ausência de dados retorna estado vazio, não números fictícios;
- desempenho por área é calculado apenas de respostas válidas;
- progresso da prova respeita respondidas/total;
- revisão vencida vira prioridade;
- erro recorrente recente ganha prioridade adequada.

## Atualização dos dados

### Provas

Edite `data/provas.json`. Para uma prova em andamento, mantenha `status: "in_progress"` e atualize `answeredQuestions`.

### Questões

Cada questão corrigida pode ser registrada em `data/questoes.json` com campos como:

```json
{
  "examId": "enare-2026-tipo-1",
  "number": 31,
  "area": "Clínica Médica",
  "topic": "Insuficiência cardíaca",
  "subtopic": "ICFEp",
  "correct": false,
  "errorType": "conteúdo",
  "notes": "Revisar critérios diagnósticos"
}
```

### Erros

`data/erros.json` guarda consolidação por tema, incluindo `occurrences` e `lastSeen`.

### Revisões

`data/revisoes.json` guarda `topic`, `dueDate`, `status` e `questionCount`.

## Publicação no GitHub Pages

O site é estático e pode ser publicado diretamente a partir da branch `main` pela raiz do repositório.

Em **Settings → Pages**:

1. Source: `Deploy from a branch`.
2. Branch: `main`.
3. Folder: `/ (root)`.
4. Salvar.

## Regra de não regressão

Nenhuma evolução do projeto deve substituir dados reais por demonstrações, apagar histórico ou reduzir a capacidade de acompanhar provas, questões, erros, revisões e desempenho. Mudanças de design devem preservar o modelo de dados e as decisões funcionais já documentadas.
