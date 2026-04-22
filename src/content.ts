import { Difficulty, LocalizedText, QuizTemplate, SolutionTreeNode, Species } from './types';

const t = (en: string, zhHans: string): LocalizedText => ({ en, zhHans });

const leaf = (speciesId: string): SolutionTreeNode => ({ id: speciesId, kind: 'species', speciesId });
const branch = (id: string, children: [SolutionTreeNode, SolutionTreeNode]): SolutionTreeNode => ({
  id,
  kind: 'internal',
  children,
});

const linearFive = (a: string, b: string, c: string, d: string, e: string): SolutionTreeNode =>
  branch('root', [leaf(a), branch('n1', [leaf(b), branch('n2', [leaf(c), branch('n3', [leaf(d), leaf(e)])])])]);

const balancedFive = (a: string, b: string, c: string, d: string, e: string): SolutionTreeNode =>
  branch('root', [branch('n1', [leaf(a), leaf(b)]), branch('n2', [leaf(c), branch('n3', [leaf(d), leaf(e)])])]);

const splitFive = (a: string, b: string, c: string, d: string, e: string): SolutionTreeNode =>
  branch('root', [branch('n1', [branch('n2', [leaf(a), leaf(b)]), leaf(c)]), branch('n3', [leaf(d), leaf(e)])]);

const collectSpeciesIds = (node: SolutionTreeNode): string[] => {
  if (node.kind === 'species') return [node.speciesId];
  return node.children.flatMap(collectSpeciesIds);
};

export const speciesCatalog: Species[] = [
  { id: 'human', names: t('Human', '人类'), photoUrl: 'https://loremflickr.com/640/420/human?lock=1', clade: 'primates' },
  { id: 'chimpanzee', names: t('Chimpanzee', '黑猩猩'), photoUrl: 'https://loremflickr.com/640/420/chimpanzee?lock=2', clade: 'primates' },
  { id: 'gorilla', names: t('Gorilla', '大猩猩'), photoUrl: 'https://loremflickr.com/640/420/gorilla?lock=3', clade: 'primates' },
  { id: 'orangutan', names: t('Orangutan', '红毛猩猩'), photoUrl: 'https://loremflickr.com/640/420/orangutan?lock=4', clade: 'primates' },
  { id: 'gibbon', names: t('Gibbon', '长臂猿'), photoUrl: 'https://loremflickr.com/640/420/gibbon?lock=5', clade: 'primates' },
  { id: 'mouse', names: t('Mouse', '小鼠'), photoUrl: 'https://loremflickr.com/640/420/mouse?lock=6', clade: 'mammals' },
  { id: 'cat', names: t('Cat', '猫'), photoUrl: 'https://loremflickr.com/640/420/cat?lock=7', clade: 'mammals' },
  { id: 'dog', names: t('Dog', '狗'), photoUrl: 'https://loremflickr.com/640/420/dog?lock=8', clade: 'mammals' },
  { id: 'horse', names: t('Horse', '马'), photoUrl: 'https://loremflickr.com/640/420/horse?lock=9', clade: 'mammals' },
  { id: 'cow', names: t('Cow', '牛'), photoUrl: 'https://loremflickr.com/640/420/cow?lock=10', clade: 'mammals' },
  { id: 'chicken', names: t('Chicken', '鸡'), photoUrl: 'https://loremflickr.com/640/420/chicken?lock=11', clade: 'birds' },
  { id: 'duck', names: t('Duck', '鸭'), photoUrl: 'https://loremflickr.com/640/420/duck?lock=12', clade: 'birds' },
  { id: 'crocodile', names: t('Crocodile', '鳄鱼'), photoUrl: 'https://loremflickr.com/640/420/crocodile?lock=13', clade: 'reptiles' },
  { id: 'lizard', names: t('Lizard', '蜥蜴'), photoUrl: 'https://loremflickr.com/640/420/lizard?lock=14', clade: 'reptiles' },
  { id: 'frog', names: t('Frog', '青蛙'), photoUrl: 'https://loremflickr.com/640/420/frog?lock=15', clade: 'amphibians' },
  { id: 'salmon', names: t('Salmon', '鲑鱼'), photoUrl: 'https://loremflickr.com/640/420/salmon?lock=16', clade: 'fish' },
  { id: 'shark', names: t('Shark', '鲨鱼'), photoUrl: 'https://loremflickr.com/640/420/shark?lock=17', clade: 'fish' },
  { id: 'pine', names: t('Pine', '松树'), photoUrl: 'https://loremflickr.com/640/420/pine?lock=18', clade: 'plants' },
  { id: 'oak', names: t('Oak', '橡树'), photoUrl: 'https://loremflickr.com/640/420/oak?lock=19', clade: 'plants' },
  { id: 'fern', names: t('Fern', '蕨'), photoUrl: 'https://loremflickr.com/640/420/fern?lock=20', clade: 'plants' },
  { id: 'moss', names: t('Moss', '苔藓'), photoUrl: 'https://loremflickr.com/640/420/moss?lock=21', clade: 'plants' },
  { id: 'sunflower', names: t('Sunflower', '向日葵'), photoUrl: 'https://loremflickr.com/640/420/sunflower?lock=22', clade: 'plants' },
  { id: 'mushroom', names: t('Mushroom', '蘑菇'), photoUrl: 'https://loremflickr.com/640/420/mushroom?lock=23', clade: 'fungi' },
  { id: 'yeast', names: t('Yeast', '酵母菌'), photoUrl: 'https://loremflickr.com/640/420/yeast?lock=24', clade: 'fungi' },
];

const quiz = (
  id: string,
  difficulty: Difficulty,
  prompt: LocalizedText,
  explanation: LocalizedText,
  solutionTree: SolutionTreeNode,
): QuizTemplate => ({
  id,
  difficulty,
  prompt,
  explanation,
  solutionTree,
  speciesIds: collectSpeciesIds(solutionTree),
});

export const quizTemplates: QuizTemplate[] = [
  quiz(
    'primates-3',
    'easy',
    t('Build the primate tree by grouping the closest relatives first.', '请先把最近的灵长类亲缘关系分组，构建这棵树。'),
    t('Humans and chimpanzees are the closest pair in this puzzle; gorilla branches earlier.', '在人类和黑猩猩这对最接近；大猩猩更早分出。'),
    branch('root', [branch('great-apes', [leaf('human'), leaf('chimpanzee')]), leaf('gorilla')]),
  ),
  quiz(
    'mammals-3',
    'easy',
    t('Build the mammal tree by grouping the closest pair.', '请先把最接近的一对哺乳动物分组，构建这棵树。'),
    t('Dog and cat sit together here, with horse as the outer branch.', '这里狗和猫是一对，马是更外侧的分支。'),
    branch('root', [branch('carnivora', [leaf('dog'), leaf('cat')]), leaf('horse')]),
  ),
  quiz(
    'plants-3',
    'easy',
    t('Build the plant tree from the earliest branch toward the closest pair.', '请从最早分支到最近的一对，构建这棵植物树。'),
    t('Moss is the earliest branch, fern comes next, and oak represents the seed-plant branch.', '苔藓最早分出，其次是蕨类，橡树代表种子植物分支。'),
    branch('root', [leaf('moss'), branch('vascular', [leaf('fern'), leaf('oak')])]),
  ),
  quiz(
    'fungi-3',
    'easy',
    t('Group the fungi first, then finish the tree.', '请先把真菌分成一组，再完成这棵树。'),
    t('Yeast and mushroom are grouped together as fungi, with sunflower as the outgroup.', '酵母菌和蘑菇同属真菌，向日葵是外群。'),
    branch('root', [branch('fungi', [leaf('yeast'), leaf('mushroom')]), leaf('sunflower')]),
  ),
  quiz(
    'primates-4',
    'medium',
    t('Build the primate tree from the outer branch inward.', '请从外侧分支往内构建这棵灵长类树。'),
    t('Orangutan branches first, gorilla next, and human/chimpanzee are the closest pair.', '红毛猩猩最先分出，大猩猩次之，人类和黑猩猩最接近。'),
    branch('root', [leaf('orangutan'), branch('ape-2', [leaf('gorilla'), branch('human-chimp', [leaf('human'), leaf('chimpanzee')])])]),
  ),
  quiz(
    'vertebrates-4',
    'medium',
    t('Build the vertebrate tree from fish toward land animals.', '请从鱼类往陆生动物方向构建这棵脊椎动物树。'),
    t('Shark is the earliest branch, salmon follows, then frog, with chicken as the most recent branch.', '鲨鱼最早分出，随后是鲑鱼，再到青蛙，鸡是最近的分支。'),
    branch('root', [leaf('shark'), branch('bony-fish', [leaf('salmon'), branch('tetrapods', [leaf('frog'), leaf('chicken')])])]),
  ),
  quiz(
    'mammals-4',
    'medium',
    t('Build this mammal tree by repeatedly grouping the closest relatives.', '请不断把最近亲缘关系分组，构建这棵哺乳动物树。'),
    t('Mouse branches off first, then gorilla, and human/chimpanzee are the closest pair.', '小鼠最先分出，然后是大猩猩，人类和黑猩猩最接近。'),
    branch('root', [leaf('mouse'), branch('apes', [leaf('gorilla'), branch('human-chimp', [leaf('human'), leaf('chimpanzee')])])]),
  ),
  quiz(
    'plants-4',
    'medium',
    t('Build the plant tree by grouping the seed plants together.', '请先把种子植物分成一组，再构建这棵植物树。'),
    t('Moss comes first, then fern, with pine and oak forming the seed-plant pair.', '苔藓最先，其次蕨类，松树和橡树组成种子植物对。'),
    branch('root', [leaf('moss'), branch('vascular', [leaf('fern'), branch('seed-plants', [leaf('pine'), leaf('oak')])])]),
  ),
  quiz(
    'primates-5',
    'hard',
    t('Build the primate tree by chaining the closest relatives into one rooted tree.', '请把最近亲缘关系依次连成一棵灵长类有根树。'),
    t('The correct topology is a linear ladder: gibbon, orangutan, gorilla, human, chimpanzee.', '正确拓扑是一条线性阶梯：长臂猿、红毛猩猩、大猩猩、人类、黑猩猩。'),
    linearFive('gibbon', 'orangutan', 'gorilla', 'human', 'chimpanzee'),
  ),
  quiz(
    'vertebrates-5',
    'hard',
    t('Build the vertebrate tree from shark toward chicken.', '请从鲨鱼到鸡，构建这棵脊椎动物树。'),
    t('The correct topology is a linear ladder from shark to chicken.', '正确拓扑是从鲨鱼到鸡的一条线性阶梯。'),
    linearFive('shark', 'salmon', 'frog', 'lizard', 'chicken'),
  ),
  quiz(
    'mammals-5',
    'hard',
    t('Build the mammal tree by grouping both close pairs before joining them.', '请先把两组最近的哺乳动物分别分组，再把它们连接起来。'),
    t('The correct topology is split: mouse is outer, horse and cow group together, and dog and cat group together.', '正确拓扑是分叉形：小鼠在外侧，马和牛成组，狗和猫成组。'),
    splitFive('mouse', 'horse', 'cow', 'dog', 'cat'),
  ),
  quiz(
    'plants-5',
    'hard',
    t('Build the plant tree from moss toward sunflower.', '请从苔藓到向日葵，构建这棵植物树。'),
    t('The correct topology is linear: moss, fern, pine, oak, sunflower.', '正确拓扑是线性：苔藓、蕨类、松树、橡树、向日葵。'),
    linearFive('moss', 'fern', 'pine', 'oak', 'sunflower'),
  ),
  quiz(
    'fungi-5',
    'hard',
    t('Build the tree by grouping the fungi pair, then connecting the plant outgroup side.', '请先把真菌这一对分组，再连接植物外群一侧。'),
    t('The correct topology is balanced: yeast and mushroom group together, while moss, fern, and sunflower occupy the other side.', '正确拓扑是平衡形：酵母菌和蘑菇成组，苔藓、蕨类和向日葵在另一侧。'),
    balancedFive('yeast', 'mushroom', 'moss', 'fern', 'sunflower'),
  ),
];

export const speciesMap = new Map(speciesCatalog.map((species) => [species.id, species]));

export const templatesByDifficulty: Record<Difficulty, QuizTemplate[]> = {
  easy: quizTemplates.filter((quiz) => quiz.difficulty === 'easy'),
  medium: quizTemplates.filter((quiz) => quiz.difficulty === 'medium'),
  hard: quizTemplates.filter((quiz) => quiz.difficulty === 'hard'),
};
