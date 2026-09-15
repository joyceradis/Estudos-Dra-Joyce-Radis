import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudyPriorities } from '../js/study-engine.js';

test('overdue reviews are prioritized and include overdue detail', () => {
  const priorities = buildStudyPriorities({
    errors: [],
    reviews: [{ id: 'r1', topic: 'Vacinação', dueDate: '2026-09-14', status: 'pending', questionCount: 4 }],
    today: '2026-09-15'
  });
  assert.equal(priorities[0].type, 'review');
  assert.equal(priorities[0].title, 'Vacinação');
  assert.match(priorities[0].detail, /vencida/i);
});

test('recurrent errors outrank a low-priority future review', () => {
  const priorities = buildStudyPriorities({
    errors: [{ id: 'e1', topic: 'Distúrbios hidroeletrolíticos', occurrences: 3, lastSeen: '2026-09-15' }],
    reviews: [{ id: 'r1', topic: 'Vacinação', dueDate: '2026-09-20', status: 'pending', questionCount: 2 }],
    today: '2026-09-15'
  });
  assert.equal(priorities[0].type, 'error');
  assert.equal(priorities[0].title, 'Distúrbios hidroeletrolíticos');
  assert.match(priorities[0].detail, /3 erros recorrentes/i);
});

test('empty inputs produce no fake priorities', () => {
  assert.deepEqual(buildStudyPriorities({ errors: [], reviews: [], today: '2026-09-15' }), []);
});
