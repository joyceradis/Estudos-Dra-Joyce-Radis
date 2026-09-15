const isBoolean = (value) => value === true || value === false;
const round1 = (value) => Math.round(value * 10) / 10;

export function calculateOverallAccuracy(questions = []) {
  const answered = questions.filter((question) => isBoolean(question?.correct));
  if (!answered.length) return null;

  const correct = answered.filter((question) => question.correct === true).length;
  return round1((correct / answered.length) * 100);
}

export function calculateAreaPerformance(questions = []) {
  const grouped = new Map();

  for (const question of questions) {
    if (!isBoolean(question?.correct) || !question?.area) continue;

    const current = grouped.get(question.area) ?? { area: question.area, answered: 0, correct: 0 };
    current.answered += 1;
    if (question.correct) current.correct += 1;
    grouped.set(question.area, current);
  }

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      accuracy: round1((item.correct / item.answered) * 100)
    }))
    .sort((a, b) => a.area.localeCompare(b.area, 'pt-BR'));
}

export function calculateProgress(exam = {}) {
  const total = Number(exam.totalQuestions) || 0;
  const answered = Math.max(0, Math.min(Number(exam.answeredQuestions) || 0, total || Infinity));
  const percentage = total > 0 ? round1((answered / total) * 100) : 0;

  return { answered, total, percentage };
}
