import { Difficulty, LocalizedText, QuizTemplate, QuizTheme } from '../types';
import { buildDifficulties, buildLadderTree, collectSpeciesIds, shuffleDeterministic } from './helpers';
import { seriesCatalog } from './quizSeries';
import { speciesCatalog, speciesMap } from './speciesCatalog';

const getSpeciesNames = (speciesIds: string[]): LocalizedText[] =>
  speciesIds.map((speciesId) => speciesMap.get(speciesId)?.names ?? { en: speciesId, zhHans: speciesId });

const joinNames = (names: string[], locale: 'en' | 'zhHans'): string => {
  if (locale === 'zhHans') return names.join('、');
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

const buildPrompt = (speciesIds: string[]): LocalizedText => {
  const names = getSpeciesNames(speciesIds);
  return {
    en: `Build the tree for these ${speciesIds.length} taxa: ${joinNames(
      names.map((name) => name.en),
      'en',
    )}.`,
    zhHans: `为这${speciesIds.length}种生物构建系统树：${joinNames(
      names.map((name) => name.zhHans),
      'zhHans',
    )}。`,
  };
};

const buildQuiz = (
  id: string,
  difficulty: Difficulty,
  theme: QuizTheme,
  speciesIds: string[],
  ancestors: LocalizedText[],
): QuizTemplate => {
  const solutionTree = buildLadderTree(id, speciesIds, ancestors);
  const candidateSpeciesIds = shuffleDeterministic(collectSpeciesIds(solutionTree), id);
  return {
    id,
    difficulty,
    theme,
    prompt: buildPrompt(candidateSpeciesIds),
    solutionTree,
    speciesIds: candidateSpeciesIds,
  };
};

const buildSeriesQuizzes = (series: (typeof seriesCatalog)[number]): QuizTemplate[] => [
  buildQuiz(`${series.id}-easy`, 'easy', series.theme, series.speciesIds.slice(2), series.ancestors.slice(2)),
  buildQuiz(`${series.id}-medium`, 'medium', series.theme, series.speciesIds.slice(1), series.ancestors.slice(1)),
  buildQuiz(`${series.id}-hard`, 'hard', series.theme, series.speciesIds, series.ancestors),
];

export { speciesCatalog, speciesMap } from './speciesCatalog';

export const quizTemplates: QuizTemplate[] = seriesCatalog.flatMap(buildSeriesQuizzes);

export const quizThemes: QuizTheme[] = ['apes', 'mammals', 'vertebrates', 'plants', 'fungi'];

export const templatesByDifficulty: Record<Difficulty, QuizTemplate[]> = Object.fromEntries(
  buildDifficulties().map((difficulty) => [difficulty, quizTemplates.filter((quiz) => quiz.difficulty === difficulty)]),
) as Record<Difficulty, QuizTemplate[]>;
