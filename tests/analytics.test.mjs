import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOverallAccuracy, calculateAreaPerformance, calculateProgress } from '../js/analytics.js';

test('overall accuracy uses only questions with explicit correctness', () => {
  const questions = [
    { area: 'Clínica Médica', correct: true },
    { area: 'Clínica Médica', correct: false },
    { area: 'Cirurgia', correct: true },
    { area: 'Cirurgia', correct: null }
  ];
  assert.equal(calculateOverallAccuracy(questions), 66.7);
});

test('overall accuracy is null when no correctness data exists', () => {
  assert.equal(calculateOverallAccuracy([{ correct: null }, {}]), null);
});

test('area performance groups answered questions without fabricating empty areas', () => {
  const result = calculateAreaPerformance([
    { area: 'Clínica Médica', correct: true },
    { area: 'Clínica Médica', correct: false },
    { area: 'Pediatria', correct: true }
  ]);
  assert.deepEqual(result, [
    { area: 'Clínica Médica', answered: 2, correct: 1, accuracy: 50 },
    { area: 'Pediatria', answered: 1, correct: 1, accuracy: 100 }
  ]);
});

test('exam progress is calculated from answered and total questions', () => {
  assert.deepEqual(calculateProgress({ answeredQuestions: 30, totalQuestions: 100 }), {
    answered: 30,
    total: 100,
    percentage: 30
  });
});
