import { Difficulty, LocalizedText, SolutionTreeNode, TaxonStep } from '../types';

export const t = (en: string, zhHans: string): LocalizedText => ({ en, zhHans });

export const taxon = (key: string, rank: string, en: string, zhHans: string): TaxonStep => ({
  key,
  rank,
  label: t(en, zhHans),
});

export const lineage = (...steps: TaxonStep[]): TaxonStep[] => steps;

export const leaf = (speciesId: string): SolutionTreeNode => ({ id: speciesId, kind: 'species', speciesId });

export const branch = (
  id: string,
  ancestor: LocalizedText,
  children: [SolutionTreeNode, SolutionTreeNode],
): SolutionTreeNode => ({
  id,
  kind: 'internal',
  ancestor,
  children,
});

export const collectSpeciesIds = (node: SolutionTreeNode): string[] => {
  if (node.kind === 'species') return [node.speciesId];
  return node.children.flatMap(collectSpeciesIds);
};

const hashString = (input: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const shuffleDeterministic = (values: string[], seed: string): string[] => {
  const next = [...values];
  let state = hashString(seed);

  for (let index = next.length - 1; index > 0; index -= 1) {
    state = Math.imul(state ^ (index + 1), 16777619) >>> 0;
    const swapIndex = state % (index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

export const buildLadderTree = (
  idPrefix: string,
  speciesIds: string[],
  ancestors: LocalizedText[],
  index = 0,
): SolutionTreeNode => {
  if (speciesIds.length === 2) {
    return branch(`${idPrefix}-node-${index}`, ancestors[0], [leaf(speciesIds[0]), leaf(speciesIds[1])]);
  }

  return branch(`${idPrefix}-node-${index}`, ancestors[0], [
    leaf(speciesIds[0]),
    buildLadderTree(idPrefix, speciesIds.slice(1), ancestors.slice(1), index + 1),
  ]);
};

export const buildDifficulties = (): Difficulty[] => ['easy', 'medium', 'hard'];
