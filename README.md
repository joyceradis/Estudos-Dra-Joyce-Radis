# Joyce · Estudos

**Plataforma longitudinal de preparação para residência médica orientada por desempenho, erros e revisão.**

> **English:** Medical-residency training platform for performance analytics, error tracking and adaptive review.

## O que este repositório demonstra

| Competência | Evidência no projeto |
| --- | --- |
| Modelagem de dados | provas, questões, erros e revisões desacoplados da interface em JSON |
| Analytics | métricas calculadas apenas sobre respostas explicitamente corrigidas |
| Motor de priorização | recorrência, recência e atraso de revisão transformados em prioridade operacional |
| Testes | suíte com Node.js para proteger regras de integridade e não regressão |
| Product thinking | dashboard construído para responder “onde perco pontos?” e “o que estudar agora?”, não apenas exibir porcentagens |

**Portfolio signal:** data modeling · analytics · JavaScript · rule engine · automated tests · adaptive learning product

Este projeto transforma provas e simulados em um sistema pessoal de treinamento. Em vez de mostrar apenas uma porcentagem de acertos, a plataforma tenta responder quatro perguntas operacionais:

1. Como estou indo?
2. Onde estou perdendo pontos?
3. O que preciso estudar agora?
4. O que eu já sabia, mas não consegui converter em acerto?

## Modelo do produto

```text
PROVA / SIMULADO
      ↓
QUESTÕES CORRIGIDAS
      ↓
ERROS + TIPO DE FALHA
      ↓
RECORRÊNCIA + RECÊNCIA
      ↓
PRIORIDADE DE REVISÃO
      ↓
NOVO DESEMPENHO
```

A complexidade analítica fica na camada de dados e regras; a interface deve permanecer simples o suficiente para orientar a próxima sessão de estudo.

## O que a plataforma acompanha

- progresso por prova;
- acerto geral e por grande área;
- temas e subtemas;
- erros recorrentes;
- tipo de erro;
- revisões pendentes e vencidas;
- prioridade de estudo por recorrência, recência e atraso;
- evolução longitudinal conforme novos dados são adicionados.

## Regra central de integridade

**A plataforma não inventa desempenho.**

Percentuais só são calculados quando uma questão possui correção explícita em `data/questoes.json` com `correct: true` ou `correct: false`. Questões ainda não corrigidas permanecem fora do denominador.

Da mesma forma, ausência de dado deve produzir estado vazio — nunca uma métrica fictícia para preencher o dashboard.

## Arquitetura

```text
Estudos-Dra-Joyce-Radis/
├── index.html
├── provas.html
├── erros.html
├── revisoes.html
├── desempenho.html
├── semana.html
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

## Separação de responsabilidades

- **Interface:** páginas e componentes apresentam o estado de estudo sem expor complexidade desnecessária.
- **Dados:** arquivos JSON preservam histórico independentemente da camada visual.
- **Analytics:** calcula métricas somente a partir de respostas válidas.
- **Study engine:** transforma recorrência, recência e revisão em prioridade operacional.
- **Testes:** protegem regras que não podem regredir durante mudanças de design.

## Testes

Requer Node.js 20+.

```bash
npm test
```

A suíte verifica, entre outros comportamentos:

- questões sem correção não entram nas métricas;
- ausência de dados não gera números fictícios;
- desempenho por área usa apenas respostas válidas;
- progresso respeita questões respondidas e total da prova;
- revisão vencida ganha prioridade;
- recorrência e recência alteram a prioridade de estudo.

## Desenvolvimento local

Como a aplicação carrega JSON por `fetch()`, use um servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Dados

Cada questão pode registrar prova, número, área, tema, subtema, correção, tipo de erro e observações. Essa granularidade permite evoluir a análise sem acoplar o histórico a uma interface específica.

Exemplo:

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

## Publicação

O projeto é estático e pode ser publicado pelo GitHub Pages diretamente da branch `main`.

## Não regressão

Evoluções de interface não devem apagar histórico, substituir dados reais por demonstrações ou reduzir a capacidade de acompanhar provas, questões, erros, revisões e desempenho.

## Autoria

Projeto pessoal de **Dra. Joyce Radis**, desenvolvido para preparação longitudinal e competitiva para residência médica.
