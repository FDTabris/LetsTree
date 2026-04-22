import { speciesMap, templatesByDifficulty } from './content';
import { DailyQuiz, Difficulty, LayoutNode, Locale, QuizState, QuizTemplate } from './types';

const contentVersion = 'v1';

export const localStorageKeys = {
  locale: 'letstree.locale',
  state: 'letstree.state',
};

export const formatDayKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const msUntilNextLocalMidnight = (date = new Date()): number => {
  const next = new Date(date);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - date.getTime();
};

const hashString = (input: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const pickTemplate = (difficulty: Difficulty, dayKey: string): QuizTemplate => {
  const templates = templatesByDifficulty[difficulty];
  const index = hashString(`${dayKey}:${difficulty}:${contentVersion}`) % templates.length;
  return templates[index];
};

export const buildDailyQuizzes = (dayKey: string): DailyQuiz[] =>
  (['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => {
    const template = pickTemplate(difficulty, dayKey);
    return {
      ...template,
      dayKey,
      speciesIds: Object.values(template.correctPlacements),
    };
  });

export const toLocaleText = (text: { en: string; zhHans: string }, locale: Locale): string =>
  text[locale];

export const getSpecies = (id: string) => speciesMap.get(id);

export const collectSlotIds = (layout: LayoutNode): string[] => {
  if (layout.kind === 'slot') return [layout.slotId ?? layout.id];
  return layout.children?.flatMap(collectSlotIds) ?? [];
};

export const createEmptyPlacements = (layout: LayoutNode): Record<string, string | null> =>
  Object.fromEntries(collectSlotIds(layout).map((slotId) => [slotId, null]));

export const evaluatePlacements = (
  template: QuizTemplate,
  placements: Record<string, string | null>,
): boolean => {
  return Object.entries(template.correctPlacements).every(([slotId, speciesId]) => placements[slotId] === speciesId);
};

export const normalizePlacements = (
  placements: Record<string, string | null>,
  slotIds: string[],
  speciesId: string,
  targetSlotId: string,
): Record<string, string | null> => {
  const next = { ...placements };
  for (const slotId of slotIds) {
    if (next[slotId] === speciesId) {
      next[slotId] = null;
    }
  }
  next[targetSlotId] = speciesId;
  return next;
};

export const clearPlacements = (
  placements: Record<string, string | null>,
  slotIds: string[],
): Record<string, string | null> => Object.fromEntries(slotIds.map((slotId) => [slotId, null]));

export const getPlacedSpeciesIds = (placements: Record<string, string | null>) =>
  new Set(Object.values(placements).filter((value): value is string => Boolean(value)));

export const getUnplacedSpecies = (placements: Record<string, string | null>, speciesIds: string[]) => {
  const placed = getPlacedSpeciesIds(placements);
  return speciesIds
    .map((speciesId) => speciesMap.get(speciesId))
    .filter((species): species is NonNullable<typeof species> => Boolean(species) && !placed.has(species.id));
};

export const buildInitialQuizStates = (quizzes: DailyQuiz[]): QuizState[] =>
  quizzes.map((quiz) => ({
    placements: createEmptyPlacements(quiz.layout),
    revealed: false,
    isCorrect: null,
    selectedTopologyId: null,
  }));

export const serializeState = (state: unknown): string => JSON.stringify(state);

export const deserializeState = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
