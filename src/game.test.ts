import { describe, expect, it } from 'vitest';
import {
  buildDailyQuizzes,
  createInitialEditorState,
  evaluateEditorTree,
  formatDayKey,
  groupNodes,
  isEditorComplete,
} from './game';

describe('daily selection', () => {
  it('creates three quizzes per day', () => {
    const quizzes = buildDailyQuizzes('2026-04-22');
    expect(quizzes).toHaveLength(3);
    expect(quizzes.map((quiz) => quiz.difficulty)).toEqual(['easy', 'medium', 'hard']);
  });

  it('stores canonical solution trees with species ids for each quiz', () => {
    for (const quiz of buildDailyQuizzes('2026-04-22')) {
      expect(quiz.speciesIds.length).toBeGreaterThanOrEqual(3);
      expect(quiz.solutionTree.kind).toBe('internal');
    }
  });

  it('formats local dates as yyyy-mm-dd', () => {
    const dayKey = formatDayKey(new Date('2026-04-22T12:00:00Z'));
    expect(dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('evaluates topology independent of grouping order', () => {
    const quiz = buildDailyQuizzes('2026-04-22')[0];
    const [a, b, c] = quiz.speciesIds;
    const firstPairEditor = groupNodes(createInitialEditorState(quiz.speciesIds), a, b);
    expect(firstPairEditor).not.toBeNull();
    const completedEditor = groupNodes(firstPairEditor!, firstPairEditor!.rootIds[0], c);
    expect(completedEditor).not.toBeNull();
    expect(isEditorComplete(completedEditor!)).toBe(true);
    expect(evaluateEditorTree(quiz, completedEditor!)).toBe(true);
  });
});
