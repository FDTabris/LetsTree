import { quizThemes, speciesMap, templatesByDifficulty } from './content';
import {
  DailyQuiz,
  Difficulty,
  LocalizedText,
  Locale,
  QuizState,
  QuizTemplate,
  SolutionTreeNode,
  TreeDisplayNode,
  TreeEditorNode,
  TreeEditorState,
} from './types';

const cycleLength = 50;
const cycleStartDayKey = '2026-01-01';

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

const dailyDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const dayKeyToOrdinal = (dayKey: string): number => {
  const [year, month, day] = dayKey.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
};

const getCycleDayIndex = (dayKey: string): number => {
  const rawIndex = dayKeyToOrdinal(dayKey) - dayKeyToOrdinal(cycleStartDayKey);
  return ((rawIndex % cycleLength) + cycleLength) % cycleLength;
};

const templatesByDifficultyAndTheme: Record<Difficulty, Record<QuizTemplate['theme'], QuizTemplate[]>> = Object.fromEntries(
  dailyDifficulties.map((difficulty) => [
    difficulty,
    Object.fromEntries(
      quizThemes.map((theme) => [
        theme,
        templatesByDifficulty[difficulty].filter((template) => template.theme === theme),
      ]),
    ),
  ]),
) as Record<Difficulty, Record<QuizTemplate['theme'], QuizTemplate[]>>;

const pickDailyTemplates = (dayKey: string): QuizTemplate[] => {
  const cycleIndex = getCycleDayIndex(dayKey);
  const roundIndex = Math.floor(cycleIndex / quizThemes.length);
  const slotIndex = cycleIndex % quizThemes.length;

  return dailyDifficulties.map((difficulty, difficultyIndex) => {
    const theme = quizThemes[(slotIndex + difficultyIndex) % quizThemes.length];
    return templatesByDifficultyAndTheme[difficulty][theme][roundIndex];
  });
};

export const buildDailyQuizzes = (dayKey: string): DailyQuiz[] =>
  pickDailyTemplates(dayKey).map((template) => ({
    ...template,
    dayKey,
  }));

export const toLocaleText = (text: { en: string; zhHans: string }, locale: Locale): string =>
  text[locale];

export const getSpecies = (id: string) => speciesMap.get(id);

const getNodeLabel = (node: SolutionTreeNode): LocalizedText => {
  if (node.kind === 'internal') return node.ancestor;
  const species = getSpecies(node.speciesId);
  return species?.names ?? { en: node.speciesId, zhHans: node.speciesId };
};

const collectExplanationSegments = (node: SolutionTreeNode): LocalizedText[] => {
  if (node.kind === 'species') return [];

  const [leftChild, rightChild] = node.children;
  const leftLabel = getNodeLabel(leftChild);
  const rightLabel = getNodeLabel(rightChild);

  return [
    ...node.children.flatMap(collectExplanationSegments),
    {
      en: `${leftLabel.en} and ${rightLabel.en} form ${node.ancestor.en}.`,
      zhHans: `${leftLabel.zhHans}和${rightLabel.zhHans}组成${node.ancestor.zhHans}。`,
    },
  ];
};

export const buildQuizExplanation = (solutionTree: SolutionTreeNode): LocalizedText => {
  const segments = collectExplanationSegments(solutionTree);
  return {
    en: segments.map((segment) => segment.en).join(' '),
    zhHans: segments.map((segment) => segment.zhHans).join(''),
  };
};

const cloneEditorNode = (node: TreeEditorNode): TreeEditorNode => ({
  ...node,
  childIds: [...node.childIds],
});

export const cloneEditorState = (editor: TreeEditorState): TreeEditorState => ({
  nodes: Object.fromEntries(Object.entries(editor.nodes).map(([id, node]) => [id, cloneEditorNode(node)])),
  rootIds: [...editor.rootIds],
  nextInternalId: editor.nextInternalId,
});

export const createInitialEditorState = (speciesIds: string[]): TreeEditorState => ({
  nodes: Object.fromEntries(
    speciesIds.map((speciesId) => [
      speciesId,
      {
        id: speciesId,
        kind: 'species',
        speciesId,
        childIds: [],
        parentId: null,
      } satisfies TreeEditorNode,
    ]),
  ),
  rootIds: [...speciesIds],
  nextInternalId: 1,
});

const collectSpeciesIds = (node: SolutionTreeNode): string[] => {
  if (node.kind === 'species') return [node.speciesId];
  return node.children.flatMap(collectSpeciesIds);
};

const serializeSolutionTree = (node: SolutionTreeNode): string => {
  if (node.kind === 'species') return node.speciesId;
  return `(${node.children.map(serializeSolutionTree).sort().join(',')})`;
};

export type SolutionAncestorStep = {
  id: string;
  ancestor: { en: string; zhHans: string };
  speciesIds: string[];
};

const serializeEditorTree = (editor: TreeEditorState, nodeId: string): string => {
  const node = editor.nodes[nodeId];
  if (!node) throw new Error(`Unknown editor node: ${nodeId}`);
  if (node.kind === 'species') return node.speciesId ?? node.id;
  return `(${node.childIds.map((childId) => serializeEditorTree(editor, childId)).sort().join(',')})`;
};

export const isEditorComplete = (editor: TreeEditorState): boolean => editor.rootIds.length === 1;

export const canGroupNodes = (editor: TreeEditorState, firstId: string, secondId: string): boolean =>
  firstId !== secondId && editor.rootIds.includes(firstId) && editor.rootIds.includes(secondId);

export const groupNodes = (editor: TreeEditorState, firstId: string, secondId: string): TreeEditorState | null => {
  if (!canGroupNodes(editor, firstId, secondId)) return null;

  const next = cloneEditorState(editor);
  const newId = `internal-${next.nextInternalId}`;
  next.nextInternalId += 1;

  next.nodes[firstId] = { ...next.nodes[firstId], parentId: newId };
  next.nodes[secondId] = { ...next.nodes[secondId], parentId: newId };
  next.nodes[newId] = {
    id: newId,
    kind: 'internal',
    childIds: [firstId, secondId],
    parentId: null,
  };

  const selected = new Set([firstId, secondId]);
  const insertIndex = next.rootIds.findIndex((rootId) => selected.has(rootId));
  const remainingRootIds = next.rootIds.filter((rootId) => !selected.has(rootId));
  remainingRootIds.splice(insertIndex, 0, newId);
  next.rootIds = remainingRootIds;

  return next;
};

export const canUngroupNode = (editor: TreeEditorState, nodeId: string): boolean => {
  const node = editor.nodes[nodeId];
  return Boolean(node && node.kind === 'internal' && node.parentId === null && node.childIds.length === 2);
};

export const ungroupNode = (editor: TreeEditorState, nodeId: string): TreeEditorState | null => {
  if (!canUngroupNode(editor, nodeId)) return null;

  const next = cloneEditorState(editor);
  const node = next.nodes[nodeId];
  const replaceIndex = next.rootIds.indexOf(nodeId);

  next.rootIds.splice(replaceIndex, 1, ...node.childIds);
  for (const childId of node.childIds) {
    next.nodes[childId] = { ...next.nodes[childId], parentId: null };
  }
  delete next.nodes[nodeId];

  return next;
};

const buildDisplayNodeFromSolution = (node: SolutionTreeNode): TreeDisplayNode => {
  if (node.kind === 'species') {
    return {
      id: node.id,
      kind: 'species',
      speciesId: node.speciesId,
      children: [],
      leafCount: 1,
    };
  }

  const children = node.children.map(buildDisplayNodeFromSolution);
  return {
    id: node.id,
    kind: 'internal',
    children,
    leafCount: children.reduce((sum, child) => sum + child.leafCount, 0),
  };
};

const buildDisplayNodeFromEditor = (editor: TreeEditorState, nodeId: string): TreeDisplayNode => {
  const node = editor.nodes[nodeId];
  if (!node) throw new Error(`Unknown editor node: ${nodeId}`);
  if (node.kind === 'species') {
    return {
      id: node.id,
      kind: 'species',
      speciesId: node.speciesId ?? node.id,
      children: [],
      leafCount: 1,
    };
  }

  const children = node.childIds.map((childId) => buildDisplayNodeFromEditor(editor, childId));
  return {
    id: node.id,
    kind: 'internal',
    children,
    leafCount: children.reduce((sum, child) => sum + child.leafCount, 0),
  };
};

export const buildEditorForest = (editor: TreeEditorState): TreeDisplayNode[] =>
  editor.rootIds.map((rootId) => buildDisplayNodeFromEditor(editor, rootId));

export const buildSolutionDisplayTree = (solutionTree: SolutionTreeNode): TreeDisplayNode =>
  buildDisplayNodeFromSolution(solutionTree);

const collectAncestorStepsFromNode = (node: SolutionTreeNode): SolutionAncestorStep[] => {
  if (node.kind === 'species') return [];

  const speciesIds = collectSpeciesIds(node);
  return [
    ...node.children.flatMap(collectAncestorStepsFromNode),
    {
      id: node.id,
      ancestor: node.ancestor,
      speciesIds,
    },
  ];
};

export const collectSolutionAncestorSteps = (solutionTree: SolutionTreeNode): SolutionAncestorStep[] =>
  collectAncestorStepsFromNode(solutionTree);

export const evaluateEditorTree = (template: QuizTemplate, editor: TreeEditorState): boolean =>
  isEditorComplete(editor) &&
  serializeEditorTree(editor, editor.rootIds[0]) === serializeSolutionTree(template.solutionTree);

export const getEditorProgress = (editor: TreeEditorState) => ({
  componentCount: editor.rootIds.length,
  cladeCount: Object.values(editor.nodes).filter((node) => node.kind === 'internal').length,
  remainingGroups: Math.max(0, editor.rootIds.length - 1),
  readyToSubmit: isEditorComplete(editor),
});

export const buildInitialQuizStates = (quizzes: DailyQuiz[]): QuizState[] =>
  quizzes.map((quiz) => ({
    editor: createInitialEditorState(quiz.speciesIds),
    history: [],
    future: [],
    revealed: false,
    isCorrect: null,
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
