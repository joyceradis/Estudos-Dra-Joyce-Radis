# JOYCE • ESTUDOS — ESPECIFICAÇÃO DE ARQUITETURA E UX

Data: 15/09/2026
Status: APROVADO EM CONCEITO PELA USUÁRIA — AGUARDANDO REVISÃO FORMAL DESTA ESPECIFICAÇÃO

## 1. OBJETIVO

Construir uma plataforma pessoal de preparação para residência médica, com foco em decisão prática de estudo: o que fazer hoje, onde estão os maiores erros, quais áreas exigem revisão e como o desempenho evolui ao longo das provas.

A plataforma não será apenas um painel visual. Ela deverá funcionar como um sistema longitudinal de estudo, acumulando resultados de provas e questões ao longo do tempo.

## 2. PRINCÍPIO DE NÃO REGRESSÃO

A nova implementação não deve apagar nem reduzir funcionalidades, dados ou decisões já presentes na versão anterior do Joyce • Estudos.

Como o repositório GitHub foi criado vazio e a versão anterior está fora deste repositório, a migração será feita de forma conservadora:

- preservar todos os dados já conhecidos da versão anterior;
- manter o ENARE 2026 como prova em andamento;
- manter o progresso conhecido de 30/100 questões;
- não inventar desempenho, erros ou revisões ainda não confirmados;
- estruturar os arquivos de dados para receber o histórico anterior sem necessidade de reconstrução da interface;
- qualquer dado fictício usado apenas para composição visual deverá ser identificado no código como placeholder e não confundido com dado real.

## 3. ARQUITETURA

Estrutura inicial solicitada:

```text
Joyce-Estudos/
│
├── index.html
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── analytics.js
│   └── study-engine.js
│
├── data/
│   ├── provas.json
│   ├── questoes.json
│   ├── erros.json
│   └── revisoes.json
│
└── README.md
```

Responsabilidades:

- `index.html`: estrutura semântica da aplicação e containers de cada seção.
- `css/styles.css`: sistema visual, responsividade e componentes.
- `js/app.js`: carregamento dos dados, renderização, navegação e interações.
- `js/analytics.js`: cálculos de desempenho global, por grande área, por tema e por prova.
- `js/study-engine.js`: cálculo de prioridade de revisão e geração do bloco "Atenção agora".
- `data/provas.json`: catálogo e progresso das provas.
- `data/questoes.json`: registro granular das questões respondidas.
- `data/erros.json`: erros consolidados, recorrência e tema.
- `data/revisoes.json`: fila de revisão, vencimento e prioridade.

## 4. MODELO DE DADOS

### provas.json
Cada prova deverá poder armazenar:

- id;
- nome;
- instituição;
- ano;
- total de questões;
- questões respondidas;
- acertos;
- erros;
- status;
- data de início;
- data de conclusão;
- observações.

### questoes.json
Cada questão deverá poder armazenar:

- id;
- provaId;
- número;
- grande área;
- tema;
- subtema;
- resposta marcada;
- gabarito;
- acertou;
- dificuldade percebida;
- motivo do erro;
- comentário/revisão;
- data.

### erros.json
Cada registro deverá poder armazenar:

- id;
- questãoId;
- tema;
- grande área;
- categoria do erro;
- recorrência;
- gravidade/prioridade;
- última ocorrência.

Categorias previstas de erro:

- conhecimento;
- interpretação;
- distração;
- conduta/algoritmo;
- memorização;
- dúvida entre alternativas.

### revisoes.json
Cada revisão deverá poder armazenar:

- id;
- origem;
- tema;
- grande área;
- prioridade;
- data de criação;
- próxima revisão;
- status;
- número de repetições.

## 5. DASHBOARD

A Home deverá priorizar ação, não estatística ornamental.

Ordem visual:

### Cabeçalho

JOYCE • ESTUDOS
Data atual
Saudação dinâmica: Bom dia / Boa tarde / Boa noite, Joyce.

### Hoje

Mostrar a prova ativa principal.

Exemplo inicial real conhecido:

- ENARE 2026
- 30/100 questões
- 30% concluído
- CTA: CONTINUAR PROVA

Abaixo, exibir quantidade de revisões previstas para o dia quando houver dados suficientes.

### Seu desempenho

- acerto geral calculado exclusivamente a partir de questões registradas;
- desempenho por grande área;
- barras de progresso discretas;
- nenhuma porcentagem inventada para parecer completo.

Grandes áreas:

- Clínica Médica;
- Cirurgia;
- Ginecologia e Obstetrícia;
- Pediatria;
- Medicina Preventiva / Saúde Coletiva.

### Atenção agora

Lista priorizada pelo motor de estudo.

Prioridade deverá considerar, inicialmente:

1. erros recorrentes;
2. revisões vencidas;
3. temas com pior taxa de acerto;
4. temas com alta frequência na prova e baixa performance;
5. erros recentes ainda não revisados.

### Provas

Listagem compacta de provas com:

- nome;
- progresso ou percentual final;
- status;
- acesso ao detalhamento.

## 6. VISÃO SEMANAL

Incorporar uma visão semanal inspirada no padrão simples que a usuária utilizava no Notion: dias da semana claramente separados e itens concluíveis.

A plataforma deverá melhorar esse conceito:

- mostrar revisões previstas por dia;
- mostrar blocos de questões/provas planejados;
- permitir identificar atraso visualmente;
- destacar o dia atual;
- funcionar bem em mobile sem forçar sete colunas estreitas.

No desktop, pode usar grade semanal. No celular, deve virar lista/scroll horizontal controlado.

## 7. DESIGN

Direção visual:

- profissional;
- limpa;
- contemporânea;
- sem aparência infantil;
- sem excesso de cards independentes;
- alta legibilidade;
- sensação de produto pessoal premium, não de painel hospitalar.

Referências conceituais:

- clareza do Linear;
- organização do Notion;
- densidade informacional controlada de plataformas de questões.

Componentes:

- fundo claro/off-white;
- cards brancos apenas quando houver ganho de agrupamento;
- tipografia sans-serif de alta legibilidade;
- uma cor primária consistente;
- verde, âmbar e vermelho apenas para estados semânticos;
- sombras discretas;
- bordas e espaçamentos consistentes;
- animações mínimas e funcionais.

## 8. RESPONSIVIDADE

Mobile-first.

### Desktop

- sidebar ou navegação lateral;
- área principal ampla;
- visão semanal em grade;
- dashboard com blocos de largura variável.

### Mobile

- navegação inferior ou compacta;
- CTA "Continuar prova" visível sem rolagem excessiva;
- gráficos e barras em uma coluna;
- cards sem largura fixa;
- alvos de toque adequados.

## 9. NAVEGAÇÃO DA V1

Seções:

- Início;
- Provas;
- Erros;
- Revisões;
- Desempenho;
- Semana.

Na V1, as seções podem ser renderizadas dentro da mesma aplicação sem roteamento complexo.

## 10. MOTOR ANALÍTICO

`analytics.js` deverá fornecer funções puras para:

- taxa de acerto geral;
- taxa de acerto por grande área;
- taxa de acerto por tema;
- progresso por prova;
- temas com maior número absoluto de erros;
- temas com maior taxa proporcional de erros;
- recorrência de erro.

As funções não devem depender diretamente do DOM.

## 11. MOTOR DE ESTUDO

`study-engine.js` deverá transformar dados brutos em prioridade prática.

Primeira regra de prioridade proposta:

`score = recorrencia*3 + atrasoRevisao*3 + erroRecente*2 + baixaPerformance*2 + pesoFrequencia`

O score é interno e não precisa aparecer para a usuária.

O objetivo é gerar recomendações como:

- Revisar distúrbios hidroeletrolíticos;
- Refazer questões de hipertensão na gestação;
- Revisão vencida de vacinação.

O motor deverá ser desenhado para mudança posterior sem alterar os arquivos de interface.

## 12. ESTADO INICIAL DOS DADOS

Dados confirmados que podem entrar na primeira versão:

- ENARE 2026;
- total: 100 questões;
- respondidas: 30;
- status: em andamento.

Percentuais de acerto por área, número de revisões e temas prioritários não deverão ser tratados como reais até que os dados correspondentes estejam registrados.

Os números exemplificativos mostrados no mockup anterior (68%, 78%, 62%, 54%, 71%, 65%, 12 revisões etc.) são referências visuais e não dados clínico-acadêmicos reais da usuária.

## 13. ESTRATÉGIA DE EVOLUÇÃO

V1:

- GitHub Pages;
- HTML/CSS/JS sem framework;
- JSON versionado;
- dashboard funcional;
- cálculo analítico local;
- visão semanal;
- navegação responsiva.

V2, apenas se necessário:

- formulário interno para registrar questões;
- persistência local;
- importação de provas;
- filtros avançados.

V3, apenas se houver ganho real:

- backend/Supabase;
- autenticação;
- sincronização entre dispositivos;
- edição direta de dados pela interface.

## 14. TESTES E CRITÉRIOS DE ACEITAÇÃO

A V1 será considerada válida quando:

- abrir sem erros no GitHub Pages;
- funcionar em desktop e celular;
- carregar os quatro JSONs sem erro;
- mostrar corretamente ENARE 2026 em 30/100;
- não exibir percentuais inventados como dados reais;
- calcular métricas a partir dos registros existentes;
- gerar prioridades sem quebrar quando ainda houver poucos dados;
- a navegação entre seções funcionar;
- a visão semanal existir;
- o layout permanecer legível em 375 px de largura;
- erros de carregamento produzirem estado vazio inteligível, não tela quebrada.

## 15. FORA DE ESCOPO DA V1

- login;
- banco de dados remoto;
- IA embutida no site;
- scraping automático de provas;
- gamificação complexa;
- notificações push;
- edição colaborativa.

Esses recursos só serão adicionados se passarem a resolver um problema real do fluxo de estudo.

## 16. NOTION COMO REFERÊNCIA

No workspace atualmente conectado, as buscas por material antigo de estudos/medicina não localizaram as páginas da época da faculdade. A página acessível com padrão organizacional relevante usa uma visão semanal por dias, com checkboxes.

Esse princípio será absorvido na seção Semana, sem transformar o Notion em dependência técnica da aplicação.

## 17. DECISÃO DE IMPLEMENTAÇÃO

A implementação deve seguir esta especificação e a estrutura de arquivos definida pela usuária, priorizando:

1. preservação de dados e decisões anteriores;
2. ação de estudo imediatamente visível;
3. separação entre dados, análise e apresentação;
4. mobile-first;
5. simplicidade tecnológica na V1;
6. facilidade de evolução sem reescrever o projeto.
