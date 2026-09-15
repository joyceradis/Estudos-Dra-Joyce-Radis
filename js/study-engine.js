const DAY_MS = 86_400_000;

function parseDate(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

function buildReviewPriority(review, todayDate) {
  if (!review || review.status === 'done' || !review.topic) return null;

  const dueDate = parseDate(review.dueDate);
  if (!dueDate) return null;

  const daysUntilDue = daysBetween(todayDate, dueDate);
  const overdueDays = Math.max(0, -daysUntilDue);
  const questionCount = Number(review.questionCount) || 0;
  const score = overdueDays > 0
    ? 120 + overdueDays * 10 + Math.min(questionCount, 10)
    : Math.max(10, 70 - daysUntilDue * 8) + Math.min(questionCount, 10);

  let detail;
  if (overdueDays > 0) {
    detail = `Revisão vencida há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}${questionCount ? ` · ${questionCount} questões` : ''}`;
  } else if (daysUntilDue === 0) {
    detail = `Revisar hoje${questionCount ? ` · ${questionCount} questões` : ''}`;
  } else {
    detail = `Revisão em ${daysUntilDue} ${daysUntilDue === 1 ? 'dia' : 'dias'}${questionCount ? ` · ${questionCount} questões` : ''}`;
  }

  return {
    type: 'review',
    title: review.topic,
    detail,
    score,
    dueDate: review.dueDate
  };
}

function buildErrorPriority(error, todayDate) {
  if (!error || !error.topic) return null;

  const occurrences = Math.max(1, Number(error.occurrences) || 1);
  const lastSeen = parseDate(error.lastSeen);
  const recencyDays = lastSeen ? Math.max(0, daysBetween(lastSeen, todayDate)) : 30;
  const recencyBoost = Math.max(0, 35 - recencyDays * 3);
  const score = 75 + occurrences * 18 + recencyBoost;

  return {
    type: 'error',
    title: error.topic,
    detail: `${occurrences} ${occurrences === 1 ? 'erro recente' : 'erros recorrentes'}${error.area ? ` · ${error.area}` : ''}`,
    score
  };
}

export function buildStudyPriorities({ errors = [], reviews = [], today } = {}) {
  const todayDate = parseDate(today) ?? new Date();
  const reviewPriorities = reviews.map((review) => buildReviewPriority(review, todayDate)).filter(Boolean);
  const errorPriorities = errors.map((error) => buildErrorPriority(error, todayDate)).filter(Boolean);

  return [...reviewPriorities, ...errorPriorities]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'pt-BR'));
}
