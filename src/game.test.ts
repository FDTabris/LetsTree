import { describe, expect, it } from 'vitest';
import { quizTemplates, quizThemes, speciesCatalog, templatesByDifficulty } from './content';
import {
  buildDailyQuizzes,
  buildQuizExplanation,
  collectSolutionAncestorSteps,
  createInitialEditorState,
  evaluateEditorTree,
  formatDayKey,
  groupNodes,
  isEditorComplete,
} from './game';

const addDays = (dayKey: string, offset: number): string => {
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

describe('daily selection', () => {
  const collectLeafOrder = (node: (typeof quizTemplates)[number]['solutionTree']): string[] =>
    node.kind === 'species' ? [node.speciesId] : node.children.flatMap(collectLeafOrder);

  it('creates three quizzes per day', () => {
    const quizzes = buildDailyQuizzes('2026-04-22');
    expect(quizzes).toHaveLength(3);
    expect(quizzes.map((quiz) => quiz.difficulty)).toEqual(['easy', 'medium', 'hard']);
  });

  it('ships 150 total quizzes with 50 per difficulty', () => {
    expect(quizTemplates).toHaveLength(150);
    expect(templatesByDifficulty.easy).toHaveLength(50);
    expect(templatesByDifficulty.medium).toHaveLength(50);
    expect(templatesByDifficulty.hard).toHaveLength(50);
  });

  it('uses enough species to support the larger catalog', () => {
    expect(speciesCatalog.length).toBeGreaterThanOrEqual(60);
  });

  it('formats local dates as yyyy-mm-dd', () => {
    const dayKey = formatDayKey(new Date('2026-04-22T12:00:00Z'));
    expect(dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('keeps themes distributed within each day and prevents repeats for 50 days', () => {
    const easyIds = new Set<string>();
    const mediumIds = new Set<string>();
    const hardIds = new Set<string>();
    const startDay = '2026-01-01';

    for (let index = 0; index < 50; index += 1) {
      const quizzes = buildDailyQuizzes(addDays(startDay, index));
      expect(quizzes).toHaveLength(3);
      expect(quizzes.map((quiz) => quiz.difficulty)).toEqual(['easy', 'medium', 'hard']);
      expect(new Set(quizzes.map((quiz) => quiz.theme)).size).toBe(3);

      easyIds.add(quizzes[0].id);
      mediumIds.add(quizzes[1].id);
      hardIds.add(quizzes[2].id);
    }

    expect(easyIds.size).toBe(50);
    expect(mediumIds.size).toBe(50);
    expect(hardIds.size).toBe(50);
  });

  it('keeps ten quizzes per theme for each difficulty', () => {
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      for (const theme of quizThemes) {
        expect(templatesByDifficulty[difficulty].filter((quiz) => quiz.theme === theme)).toHaveLength(10);
      }
    }
  });

  it('stores canonical solution trees with species ids for each quiz', () => {
    for (const quiz of quizTemplates) {
      expect(quiz.speciesIds.length).toBeGreaterThanOrEqual(3);
      expect(quiz.solutionTree.kind).toBe('internal');
      expect(collectSolutionAncestorSteps(quiz.solutionTree).length).toBe(quiz.speciesIds.length - 1);
    }
  });

  it('does not expose the solution leaf order as the candidate order', () => {
    const quiz = quizTemplates.find((template) => template.id === 'apes-06-hard');
    expect(quiz).toBeDefined();
    expect(quiz?.speciesIds).not.toEqual(collectLeafOrder(quiz!.solutionTree));
  });

  it('evaluates topology independent of grouping order', () => {
    const quiz = buildDailyQuizzes('2026-04-22')[0];
    expect(quiz.solutionTree.kind).toBe('internal');
    const [leftChild, rightChild] = quiz.solutionTree.children;
    const pairNode = leftChild.kind === 'internal' ? leftChild : rightChild;
    const soloNode = leftChild.kind === 'species' ? leftChild : rightChild;
    expect(pairNode.kind).toBe('internal');
    expect(soloNode.kind).toBe('species');

    const pairSpeciesIds = collectLeafOrder(pairNode);
    const firstPairEditor = groupNodes(createInitialEditorState(quiz.speciesIds), pairSpeciesIds[0], pairSpeciesIds[1]);
    expect(firstPairEditor).not.toBeNull();
    const pairRootId = firstPairEditor!.rootIds.find((rootId) => rootId !== soloNode.speciesId);
    expect(pairRootId).toBeDefined();
    const completedEditor = groupNodes(firstPairEditor!, soloNode.speciesId, pairRootId!);
    expect(completedEditor).not.toBeNull();
    expect(isEditorComplete(completedEditor!)).toBe(true);
    expect(evaluateEditorTree(quiz, completedEditor!)).toBe(true);
  });

  it('generates explanations from the solution tree', () => {
    const quiz = quizTemplates.find((template) => template.id === 'apes-06-hard');
    expect(quiz).toBeDefined();
    expect(buildQuizExplanation(quiz!.solutionTree)).toEqual({
      en: 'Human and Chimpanzee form Human-chimp clade. Western gorilla and Human-chimp clade form African great apes. Bornean orangutan and African great apes form Great apes. Lar gibbon and Great apes form Apes.',
      zhHans:
        '人类和黑猩猩组成人-黑猩猩支。西部大猩猩和人-黑猩猩支组成非洲大型类人猿。婆罗洲红毛猩猩和非洲大型类人猿组成大型类人猿。白手长臂猿和大型类人猿组成类人猿。',
    });
  });

  it('stores richer ape lineage details', () => {
    const human = speciesCatalog.find((species) => species.id === 'human');
    const chimpanzee = speciesCatalog.find((species) => species.id === 'chimpanzee');
    const gorilla = speciesCatalog.find((species) => species.id === 'gorilla');
    const orangutan = speciesCatalog.find((species) => species.id === 'orangutan');

    expect(human?.lineage.map((step) => step.key)).toEqual(
      expect.arrayContaining(['apes', 'great-apes', 'african-great-apes', 'human-chimp-clade']),
    );
    expect(chimpanzee?.lineage.map((step) => step.key)).toEqual(
      expect.arrayContaining(['apes', 'great-apes', 'african-great-apes', 'human-chimp-clade', 'pan-clade']),
    );
    expect(gorilla?.lineage.map((step) => step.key)).toEqual(
      expect.arrayContaining(['apes', 'great-apes', 'african-great-apes']),
    );
    expect(gorilla?.lineage.map((step) => step.key)).not.toContain('pan-clade');
    expect(orangutan?.lineage.map((step) => step.key)).toEqual(expect.arrayContaining(['apes', 'great-apes']));
    expect(orangutan?.lineage.map((step) => step.key)).not.toContain('african-great-apes');
  });
});
