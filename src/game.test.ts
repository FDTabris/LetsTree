import { describe, expect, it } from 'vitest';
import { buildDailyQuizzes, collectSlotIds, formatDayKey } from './game';

describe('daily selection', () => {
  it('creates three quizzes per day', () => {
    const quizzes = buildDailyQuizzes('2026-04-22');
    expect(quizzes).toHaveLength(3);
    expect(quizzes.map((quiz) => quiz.difficulty)).toEqual(['easy', 'medium', 'hard']);
  });

  it('keeps slot ids available on each layout', () => {
    for (const quiz of buildDailyQuizzes('2026-04-22')) {
      expect(collectSlotIds(quiz.layout).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('formats local dates as yyyy-mm-dd', () => {
    const dayKey = formatDayKey(new Date('2026-04-22T12:00:00Z'));
    expect(dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('requires topology choice for 5-species quizzes', () => {
    const quizzes = buildDailyQuizzes('2026-04-22');
    const hardQuiz = quizzes.find((quiz) => quiz.speciesIds.length === 5);
    expect(hardQuiz?.requiredTopologyChoice).toBe(true);
    expect(hardQuiz?.topologyChoices).toHaveLength(3);
  });
});
