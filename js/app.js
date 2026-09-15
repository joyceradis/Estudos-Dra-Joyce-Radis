import { calculateAreaPerformance, calculateOverallAccuracy, calculateProgress } from './analytics.js';
import { buildStudyPriorities } from './study-engine.js';

const DATA_PATHS = {
  exams: './data/provas.json',
  questions: './data/questoes.json',
  errors: './data/erros.json',
  reviews: './data/revisoes.json'
};

const AREA_ORDER = ['Clínica Médica', 'Cirurgia', 'Ginecologia e Obstetrícia', 'Pediatria', 'Medicina Preventiva'];
const STATUS_LABELS = { in_progress: 'Em andamento', completed: 'Concluída', planned: 'Planejada' };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function safeText(value, fallback = '—') { return value === null || value === undefined || value === '' ? fallback : String(value); }
function localDateISO(date = new Date()) { const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10); }
function formatDate(date, options = {}) { return new Intl.DateTimeFormat('pt-BR', options).format(date); }
function greetingForHour(hour) { if (hour < 12) return 'Bom dia, Joyce.'; if (hour < 18) return 'Boa tarde, Joyce.'; return 'Boa noite, Joyce.'; }

async function loadJSON(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Falha ao carregar ${path}: HTTP ${response.status}`);
  return response.json();
}
async function loadAllData() {
  const entries = await Promise.all(Object.entries(DATA_PATHS).map(async ([key, path]) => [key, await loadJSON(path)]));
  return Object.fromEntries(entries);
}
function renderDateAndGreeting() {
  const now = new Date();
  $('#today-date').textContent = formatDate(now, { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase();
  $('#greeting').textContent = greetingForHour(now.getHours());
}
function renderFocus(exams) {
  const exam = exams.find((item) => item.status === 'in_progress') ?? exams[0];
  if (!exam) {
    $('#focus-title').textContent = 'Nenhuma prova em andamento';
    $('#focus-status').textContent = 'Livre';
    $('#focus-progress-count').textContent = '0 / 0 questões';
    $('#focus-progress-percent').textContent = '0%';
    $('#focus-progress-bar').style.width = '0%';
    $('#continue-exam').textContent = 'Ver provas →';
    return;
  }
  const progress = calculateProgress(exam);
  $('#focus-title').textContent = safeText(exam.name, 'Prova em andamento');
  $('#focus-status').textContent = STATUS_LABELS[exam.status] ?? 'Em andamento';
  $('#focus-progress-count').textContent = `${progress.answered} / ${progress.total} questões`;
  $('#focus-progress-percent').textContent = `${progress.percentage}%`;
  $('#focus-progress-bar').style.width = `${progress.percentage}%`;
  $('.progress-track').setAttribute('aria-valuenow', String(progress.percentage));
  $('#continue-exam').setAttribute('href', `#prova-${exam.id}`);
  $('#hero-subtitle').textContent = progress.percentage < 100 ? `Continue de onde parou. ${progress.total - progress.answered} questões ainda não foram registradas como concluídas.` : 'Prova concluída. Agora o foco é consolidar erros e revisões.';
}
function renderTodaySummary(questions, reviews, priorities) {
  const today = localDateISO();
  const dueToday = reviews.filter((review) => review.status !== 'done' && review.dueDate === today);
  $('#reviews-today').textContent = String(dueToday.length);
  $('#reviews-today-detail').textContent = dueToday.length ? `${dueToday.reduce((sum, item) => sum + (Number(item.questionCount) || 0), 0)} questões previstas` : 'nenhuma revisão cadastrada';
  const registered = questions.filter((question) => question.correct === true || question.correct === false).length;
  $('#questions-registered').textContent = String(registered);
  if (priorities[0]) { $('#current-focus').textContent = priorities[0].title; $('#current-focus-detail').textContent = priorities[0].detail; }
}
function renderPerformance(questions) {
  const overall = calculateOverallAccuracy(questions);
  const areas = calculateAreaPerformance(questions);
  const areaContainer = $('#area-performance');
  if (overall === null) {
    $('#overall-accuracy').textContent = '—';
    $('#accuracy-caption').textContent = 'Ainda não há questões corrigidas suficientes para calcular sua taxa.';
  } else {
    $('#overall-accuracy').textContent = `${overall}%`;
    $('#accuracy-caption').textContent = `${questions.filter((q) => q.correct === true || q.correct === false).length} questões com resultado registrado.`;
  }
  if (!areas.length) {
    areaContainer.innerHTML = '<div class="empty-state">Assim que você registrar acertos e erros, o desempenho por grande área aparece aqui automaticamente.</div>';
    return;
  }
  const orderedAreas = [...areas].sort((a, b) => {
    const ia = AREA_ORDER.indexOf(a.area); const ib = AREA_ORDER.indexOf(b.area);
    if (ia === -1 && ib === -1) return a.area.localeCompare(b.area, 'pt-BR');
    if (ia === -1) return 1; if (ib === -1) return -1; return ia - ib;
  });
  areaContainer.innerHTML = orderedAreas.map((area) => `<div class="area-row"><span class="area-name">${area.area}</span><span class="area-track" aria-hidden="true"><span class="area-fill" style="width:${area.accuracy}%"></span></span><span class="area-value">${area.accuracy}%</span></div>`).join('');
}
function renderPriorities(priorities) {
  const list = $('#priority-list');
  if (!priorities.length) { list.innerHTML = '<li class="empty-state">Sem prioridades calculáveis ainda. Erros recorrentes e revisões vencidas aparecerão aqui quando forem registrados.</li>'; return; }
  list.innerHTML = priorities.slice(0, 5).map((priority) => `<li class="priority-item"><div><span class="priority-title">${priority.title}</span><span class="priority-detail">${priority.detail}</span></div><span class="priority-kind ${priority.type}">${priority.type === 'error' ? 'Erro' : 'Revisão'}</span></li>`).join('');
}
function renderExams(exams) {
  const list = $('#exam-list');
  if (!exams.length) { list.innerHTML = '<div class="empty-state">Nenhuma prova cadastrada.</div>'; return; }
  list.innerHTML = exams.map((exam) => {
    const progress = calculateProgress(exam);
    const accuracy = exam.correctAnswers === null || exam.correctAnswers === undefined || exam.answeredQuestions === 0 ? null : Math.round((exam.correctAnswers / exam.answeredQuestions) * 1000) / 10;
    return `<article class="exam-row" id="prova-${exam.id}"><div class="exam-main"><span class="exam-title">${safeText(exam.name)}</span><span class="exam-meta"><span>${STATUS_LABELS[exam.status] ?? safeText(exam.status)}</span><span>${progress.answered}/${progress.total} respondidas</span>${exam.startedAt ? `<span>início ${new Date(`${exam.startedAt}T12:00:00`).toLocaleDateString('pt-BR')}</span>` : ''}</span></div><div class="exam-progress"><strong>${accuracy === null ? `${progress.percentage}% concluída` : `${accuracy}% de acerto`}</strong><span>${accuracy === null ? 'resultado individual ainda não registrado' : `${exam.correctAnswers} acertos`}</span></div></article>`;
  }).join('');
}
function startOfWeek(date) { const current = new Date(date); const day = current.getDay(); const diff = day === 0 ? -6 : 1 - day; current.setDate(current.getDate() + diff); current.setHours(12, 0, 0, 0); return current; }
function renderWeek(reviews, exams) {
  const container = $('#week-strip'); const today = new Date(); const todayISO = localDateISO(today); const monday = startOfWeek(today); const activeExam = exams.find((exam) => exam.status === 'in_progress');
  container.innerHTML = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday); date.setDate(monday.getDate() + index); const iso = localDateISO(date); const dayReviews = reviews.filter((review) => review.status !== 'done' && review.dueDate === iso); const tasks = [];
    if (iso === todayISO && activeExam) { const remaining = Math.max(0, (Number(activeExam.totalQuestions) || 0) - (Number(activeExam.answeredQuestions) || 0)); tasks.push(`<li class="week-task"><strong>${activeExam.name}</strong><br>${remaining} questões restantes na prova</li>`); }
    dayReviews.forEach((review) => tasks.push(`<li class="week-task"><strong>${review.topic}</strong><br>${review.questionCount || 0} questões de revisão</li>`));
    if (!tasks.length) tasks.push('<li class="week-task">Sem tarefa registrada</li>');
    return `<article class="week-day ${iso === todayISO ? 'is-today' : ''}"><div class="week-day-head"><span class="week-day-name">${formatDate(date, { weekday: 'short' }).replace('.', '')}</span><span class="week-day-date">${formatDate(date, { day: '2-digit' })}</span></div><ul class="week-tasks">${tasks.join('')}</ul></article>`;
  }).join('');
}
function updateActiveNavigation() {
  const sections = ['hoje', 'desempenho', 'atencao', 'provas', 'semana'].map((id) => document.getElementById(id));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return; const id = visible.target.id;
    $$('.nav-link, .mobile-nav-link').forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] });
  sections.forEach((section) => observer.observe(section));
}
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('is-visible'); window.setTimeout(() => toast.classList.remove('is-visible'), 3500); }
function renderFatalState(error) { console.error(error); $('#focus-title').textContent = 'Não foi possível carregar os dados'; $('#hero-subtitle').textContent = 'O painel continua intacto, mas os arquivos JSON não responderam.'; showToast('Falha ao carregar os dados. Abra o site por um servidor HTTP, não diretamente pelo arquivo.'); }
async function init() {
  renderDateAndGreeting(); updateActiveNavigation();
  try {
    const data = await loadAllData(); const today = localDateISO(); const priorities = buildStudyPriorities({ errors: data.errors, reviews: data.reviews, today });
    renderFocus(data.exams); renderTodaySummary(data.questions, data.reviews, priorities); renderPerformance(data.questions); renderPriorities(priorities); renderExams(data.exams); renderWeek(data.reviews, data.exams);
  } catch (error) { renderFatalState(error); }
}
document.addEventListener('DOMContentLoaded', init);
