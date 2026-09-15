# Joyce • Estudos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first static study dashboard for residência médica that preserves known Joyce • Estudos requirements, starts with ENARE 2026 at 30/100, and derives metrics/revision priorities only from real registered data.

**Architecture:** Static HTML/CSS/ES modules with JSON as the persistence layer. Pure analytics and study-priority modules are independently testable and consumed by the UI renderer. The data schema is intentionally backend-agnostic so a future Supabase migration does not require replacing the presentation layer.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, JSON, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-15-joyce-estudos-design.md`

## Global Constraints

- Preserve all known prior product decisions; do not invent performance metrics.
- ENARE 2026 starts as `30/100` and `em andamento`.
- Mobile-first; desktop must remain comfortable and information-dense.
- No framework or runtime dependency for the deployed application.
- JSON data remains separable from rendering and calculations.
- “Atenção agora” is calculated from errors/reviews, not hard-coded.
- Empty data must produce honest empty states instead of fake numbers.

---

### Task 1: Establish data model and test harness

**Files:**
- Create: `package.json`
- Create: `data/provas.json`
- Create: `data/questoes.json`
- Create: `data/erros.json`
- Create: `data/revisoes.json`
- Create: `tests/analytics.test.mjs`
- Create: `tests/study-engine.test.mjs`

**Interfaces:**
- `provas.json` produces proof metadata consumed by `app.js`.
- `questoes.json` produces question records consumed by `analytics.js`.
- `erros.json` and `revisoes.json` produce priority inputs consumed by `study-engine.js`.

- [ ] **Step 1: Write failing analytics tests** for global accuracy, area accuracy, and empty-state null behavior.
- [ ] **Step 2: Run `npm test` and confirm failure** because analytics functions do not exist.
- [ ] **Step 3: Write failing study-engine tests** for overdue reviews and recurrent-error prioritization.
- [ ] **Step 4: Run `npm test` and confirm failure** because study-engine functions do not exist.
- [ ] **Step 5: Add truthful seed JSON** with ENARE 2026 at 30/100 and no fabricated question outcomes.

### Task 2: Implement analytics module

**Files:**
- Create: `js/analytics.js`
- Test: `tests/analytics.test.mjs`

**Interfaces:**
- Produces `calculateOverallAccuracy(questions)`, `calculateAreaPerformance(questions)`, and `calculateProgress(exam)`.
- Percentages return `null` when there is insufficient answered/correctness data.

- [ ] **Step 1: Implement minimal analytics functions** to satisfy the tests.
- [ ] **Step 2: Run `npm test` and confirm analytics tests pass.**
- [ ] **Step 3: Refactor names and guards without changing behavior.**

### Task 3: Implement study priority engine

**Files:**
- Create: `js/study-engine.js`
- Test: `tests/study-engine.test.mjs`

**Interfaces:**
- Produces `buildStudyPriorities({ errors, reviews, today })`.
- Output entries expose `type`, `title`, `detail`, `score`, and optional `dueDate`.

- [ ] **Step 1: Implement overdue-review scoring and recurrent-error scoring.**
- [ ] **Step 2: Sort priorities deterministically by score, then title.**
- [ ] **Step 3: Run `npm test` and confirm all engine tests pass.**

### Task 4: Build responsive dashboard shell

**Files:**
- Create: `index.html`
- Create: `css/styles.css`

**Interfaces:**
- Defines sections `today`, `performance`, `attention`, `exams`, `week` plus responsive navigation.
- Exposes element IDs used by `app.js`; no metrics are hard-coded as facts.

- [ ] **Step 1: Create semantic HTML structure** with loading/empty-state placeholders only.
- [ ] **Step 2: Implement mobile-first visual system** inspired by Linear/Notion: restrained palette, strong hierarchy, minimal cards, bottom nav on mobile and rail/header navigation on desktop.
- [ ] **Step 3: Add accessible focus states, reduced-motion support, and responsive breakpoints.**

### Task 5: Wire application rendering

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Fetches the four JSON datasets.
- Uses analytics/study-engine functions for all calculated UI.
- Renders ENARE progress, performance empty states, priorities, exam list, and weekly study layout.

- [ ] **Step 1: Implement resilient JSON loading with user-visible fallback.**
- [ ] **Step 2: Render ENARE 2026 progress from `provas.json`.**
- [ ] **Step 3: Render performance only when question data supports it.**
- [ ] **Step 4: Render calculated priorities and honest empty state.**
- [ ] **Step 5: Render exam list and seven-day weekly strip.**
- [ ] **Step 6: Implement navigation/scroll behavior and current-date greeting.**

### Task 6: Documentation and verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- README explains architecture, data updates, local preview, tests, and GitHub Pages deployment.

- [ ] **Step 1: Run `npm test`.** Expected: all tests pass.
- [ ] **Step 2: Validate all JSON with `python -m json.tool`.** Expected: all files parse.
- [ ] **Step 3: Check HTML/JS paths and module imports.** Expected: no missing relative files.
- [ ] **Step 4: Update README with operating instructions and non-regression rule.**
- [ ] **Step 5: Review branch diff against the spec.** Expected: no fabricated performance data, ENARE 30/100 preserved, all requested sections represented.
