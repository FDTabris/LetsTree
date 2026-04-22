import { Difficulty, LayoutNode, LocalizedText, QuizTemplate, Species, TreeTopologyOption } from './types';

const t = (en: string, zhHans: string): LocalizedText => ({ en, zhHans });

const leaf = (id: string): LayoutNode => ({ id, kind: 'slot', slotId: id });
const branch = (id: string, children: LayoutNode[]): LayoutNode => ({ id, kind: 'branch', children });

const linearFive = (a: string, b: string, c: string, d: string, e: string): LayoutNode =>
  branch('root', [leaf(a), branch('n1', [leaf(b), branch('n2', [leaf(c), branch('n3', [leaf(d), leaf(e)])])])]);

const balancedFive = (a: string, b: string, c: string, d: string, e: string): LayoutNode =>
  branch('root', [branch('n1', [leaf(a), leaf(b)]), branch('n2', [leaf(c), branch('n3', [leaf(d), leaf(e)])])]);

const splitFive = (a: string, b: string, c: string, d: string, e: string): LayoutNode =>
  branch('root', [branch('n1', [branch('n2', [leaf(a), leaf(b)]), leaf(c)]), branch('n3', [leaf(d), leaf(e)])]);

const topology = (id: string, en: string, zhHans: string, layout: LayoutNode): TreeTopologyOption => ({
  id,
  label: t(en, zhHans),
  layout,
});

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
  layout: LayoutNode,
  correctPlacements: Record<string, string>,
  topologyChoices?: TreeTopologyOption[],
  correctTopologyId?: string,
): QuizTemplate => ({
  id,
  difficulty,
  prompt,
  explanation,
  layout,
  correctPlacements,
  topologyChoices,
  correctTopologyId,
  requiredTopologyChoice: Boolean(topologyChoices?.length),
});

const topologyChoices5 = (
  correctLayout: LayoutNode,
): { choices: TreeTopologyOption[]; correctTopologyId: string } => {
  const choices = [
    topology('linear', 'Linear', '线性', linearFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e')),
    topology('balanced', 'Balanced', '平衡', balancedFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e')),
    topology('split', 'Split', '分叉', splitFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e')),
  ];
  const correct = choices.find((choice) => JSON.stringify(choice.layout) === JSON.stringify(correctLayout));
  return { choices, correctTopologyId: correct?.id ?? 'linear' };
};

const fiveSpeciesQuiz = (
  id: string,
  difficulty: Difficulty,
  prompt: LocalizedText,
  explanation: LocalizedText,
  placements: Record<string, string>,
  correctLayout: LayoutNode,
): QuizTemplate => {
  const { choices, correctTopologyId } = topologyChoices5(correctLayout);
  return quiz(id, difficulty, prompt, explanation, correctLayout, placements, choices, correctTopologyId);
};

export const quizTemplates: QuizTemplate[] = [
  quiz(
    'primates-3',
    'easy',
    t('Arrange the closest primate relatives.', '请把最接近的灵长类亲缘关系排好。'),
    t('Humans and chimpanzees are the closest pair in this puzzle; gorilla branches earlier.', '在人类和黑猩猩这对最接近；大猩猩更早分出。'),
    branch('root', [branch('great-apes', [leaf('slot-a'), leaf('slot-b')]), leaf('slot-c')]),
    { 'slot-a': 'human', 'slot-b': 'chimpanzee', 'slot-c': 'gorilla' },
  ),
  quiz(
    'mammals-3',
    'easy',
    t('Place these mammals from the closest pair outward.', '请把这些哺乳动物从最近的一对开始排列。'),
    t('Dog and cat sit together here, with horse as the outer branch.', '这里狗和猫是一对，马是更外侧的分支。'),
    branch('root', [branch('carnivora', [leaf('slot-a'), leaf('slot-b')]), leaf('slot-c')]),
    { 'slot-a': 'dog', 'slot-b': 'cat', 'slot-c': 'horse' },
  ),
  quiz(
    'plants-3',
    'easy',
    t('Arrange these plant lineages from earliest branch to most recent.', '请把这些植物谱系从最早分支到最近分支排列。'),
    t('Moss is the earliest branch, fern comes next, and oak represents the seed-plant branch.', '苔藓最早分出，其次是蕨类，橡树代表种子植物分支。'),
    branch('root', [leaf('slot-a'), branch('vascular', [leaf('slot-b'), leaf('slot-c')])]),
    { 'slot-a': 'moss', 'slot-b': 'fern', 'slot-c': 'oak' },
  ),
  quiz(
    'fungi-3',
    'easy',
    t('Put the fungi and plant lineages in the right order.', '请把真菌和植物谱系放到正确顺序。'),
    t('Yeast and mushroom are grouped together as fungi, with sunflower as the outgroup.', '酵母菌和蘑菇同属真菌，向日葵是外群。'),
    branch('root', [branch('fungi', [leaf('slot-a'), leaf('slot-b')]), leaf('slot-c')]),
    { 'slot-a': 'yeast', 'slot-b': 'mushroom', 'slot-c': 'sunflower' },
  ),
  quiz(
    'primates-4',
    'medium',
    t('Place these primates in the right branching order.', '请把这些灵长类放到正确分支顺序。'),
    t('Orangutan branches first, gorilla next, and human/chimpanzee are the closest pair.', '红毛猩猩最先分出，大猩猩次之，人类和黑猩猩最接近。'),
    branch('root', [leaf('slot-a'), branch('ape-2', [leaf('slot-b'), branch('human-chimp', [leaf('slot-c'), leaf('slot-d')])])]),
    { 'slot-a': 'orangutan', 'slot-b': 'gorilla', 'slot-c': 'human', 'slot-d': 'chimpanzee' },
  ),
  quiz(
    'vertebrates-4',
    'medium',
    t('Arrange these vertebrates from fish to land animals.', '请把这些脊椎动物从鱼类排到陆生动物。'),
    t('Shark is the earliest branch, salmon follows, then frog, with chicken as the most recent branch.', '鲨鱼最早分出，随后是鲑鱼，再到青蛙，鸡是最近的分支。'),
    branch('root', [leaf('slot-a'), branch('bony-fish', [leaf('slot-b'), branch('tetrapods', [leaf('slot-c'), leaf('slot-d')])])]),
    { 'slot-a': 'shark', 'slot-b': 'salmon', 'slot-c': 'frog', 'slot-d': 'chicken' },
  ),
  quiz(
    'mammals-4',
    'medium',
    t('Sort these mammals by their branching order.', '请按这些哺乳动物的分支顺序排序。'),
    t('Mouse branches off first, then gorilla, and human/chimpanzee are the closest pair.', '小鼠最先分出，然后是大猩猩，人类和黑猩猩最接近。'),
    branch('root', [leaf('slot-a'), branch('apes', [leaf('slot-b'), branch('human-chimp', [leaf('slot-c'), leaf('slot-d')])])]),
    { 'slot-a': 'mouse', 'slot-b': 'gorilla', 'slot-c': 'human', 'slot-d': 'chimpanzee' },
  ),
  quiz(
    'plants-4',
    'medium',
    t('Arrange these plants by how deep their branch is.', '请按这些植物分支深浅排序。'),
    t('Moss comes first, then fern, with pine and oak forming the seed-plant pair.', '苔藓最先，其次蕨类，松树和橡树组成种子植物对。'),
    branch('root', [leaf('slot-a'), branch('vascular', [leaf('slot-b'), branch('seed-plants', [leaf('slot-c'), leaf('slot-d')])])]),
    { 'slot-a': 'moss', 'slot-b': 'fern', 'slot-c': 'pine', 'slot-d': 'oak' },
  ),
  fiveSpeciesQuiz(
    'primates-5',
    'hard',
    t('Choose the right tree shape, then place the primates.', '先选对树形，再放入灵长类。'),
    t('The correct topology is a linear ladder: gibbon, orangutan, gorilla, human, chimpanzee.', '正确拓扑是一条线性阶梯：长臂猿、红毛猩猩、大猩猩、人类、黑猩猩。'),
    { 'slot-a': 'gibbon', 'slot-b': 'orangutan', 'slot-c': 'gorilla', 'slot-d': 'human', 'slot-e': 'chimpanzee' },
    linearFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e'),
  ),
  fiveSpeciesQuiz(
    'vertebrates-5',
    'hard',
    t('Choose the right tree shape, then place the vertebrates.', '先选对树形，再放入脊椎动物。'),
    t('The correct topology is a linear ladder from shark to chicken.', '正确拓扑是从鲨鱼到鸡的一条线性阶梯。'),
    { 'slot-a': 'shark', 'slot-b': 'salmon', 'slot-c': 'frog', 'slot-d': 'lizard', 'slot-e': 'chicken' },
    linearFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e'),
  ),
  fiveSpeciesQuiz(
    'mammals-5',
    'hard',
    t('Choose the right tree shape, then place the mammals.', '先选对树形，再放入哺乳动物。'),
    t('The correct topology is split: mouse is outer, horse and cow group together, and dog and cat group together.', '正确拓扑是分叉形：小鼠在外侧，马和牛成组，狗和猫成组。'),
    { 'slot-a': 'mouse', 'slot-b': 'horse', 'slot-c': 'cow', 'slot-d': 'dog', 'slot-e': 'cat' },
    splitFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e'),
  ),
  fiveSpeciesQuiz(
    'plants-5',
    'hard',
    t('Choose the right tree shape, then place the plants.', '先选对树形，再放入植物。'),
    t('The correct topology is linear: moss, fern, pine, oak, sunflower.', '正确拓扑是线性：苔藓、蕨类、松树、橡树、向日葵。'),
    { 'slot-a': 'moss', 'slot-b': 'fern', 'slot-c': 'pine', 'slot-d': 'oak', 'slot-e': 'sunflower' },
    linearFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e'),
  ),
  fiveSpeciesQuiz(
    'fungi-5',
    'hard',
    t('Choose the right tree shape, then place the fungi and outgroup.', '先选对树形，再放入真菌和外群。'),
    t('The correct topology is balanced: yeast and mushroom group together, while moss, fern, and sunflower occupy the other side.', '正确拓扑是平衡形：酵母菌和蘑菇成组，苔藓、蕨类和向日葵在另一侧。'),
    { 'slot-a': 'yeast', 'slot-b': 'mushroom', 'slot-c': 'moss', 'slot-d': 'fern', 'slot-e': 'sunflower' },
    balancedFive('slot-a', 'slot-b', 'slot-c', 'slot-d', 'slot-e'),
  ),
];

export const speciesMap = new Map(speciesCatalog.map((species) => [species.id, species]));

export const templatesByDifficulty: Record<Difficulty, QuizTemplate[]> = {
  easy: quizTemplates.filter((quiz) => quiz.difficulty === 'easy'),
  medium: quizTemplates.filter((quiz) => quiz.difficulty === 'medium'),
  hard: quizTemplates.filter((quiz) => quiz.difficulty === 'hard'),
};
