import { Difficulty, LocalizedText, QuizTemplate, QuizTheme, SolutionTreeNode, Species, TaxonStep } from './types';

const t = (en: string, zhHans: string): LocalizedText => ({ en, zhHans });
const taxon = (key: string, rank: string, en: string, zhHans: string): TaxonStep => ({ key, rank, label: t(en, zhHans) });
const lineage = (...steps: TaxonStep[]): TaxonStep[] => steps;

const leaf = (speciesId: string): SolutionTreeNode => ({ id: speciesId, kind: 'species', speciesId });
const branch = (id: string, ancestor: LocalizedText, children: [SolutionTreeNode, SolutionTreeNode]): SolutionTreeNode => ({
  id,
  kind: 'internal',
  ancestor,
  children,
});

const collectSpeciesIds = (node: SolutionTreeNode): string[] => {
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

const shuffleDeterministic = (values: string[], seed: string): string[] => {
  const next = [...values];
  let state = hashString(seed);

  for (let index = next.length - 1; index > 0; index -= 1) {
    state = Math.imul(state ^ (index + 1), 16777619) >>> 0;
    const swapIndex = state % (index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

const createSpecies = (
  id: string,
  en: string,
  zhHans: string,
  scientificName: string,
  photoKeyword: string,
  lock: number,
  speciesLineage: TaxonStep[],
): Species => ({
  id,
  names: t(en, zhHans),
  scientificName,
  photoUrl: `https://loremflickr.com/640/420/${photoKeyword}?lock=${lock}`,
  lineage: speciesLineage,
});

const eukaryota = taxon('eukaryota', 'domain', 'Eukaryota', '真核生物域');
const animalia = taxon('animalia', 'kingdom', 'Animalia', '动物界');
const chordata = taxon('chordata', 'phylum', 'Chordata', '脊索动物门');
const mammalia = taxon('mammalia', 'class', 'Mammalia', '哺乳纲');
const primates = taxon('primates', 'order', 'Primates', '灵长目');
const haplorhini = taxon('haplorhini', 'clade', 'Haplorhini', '简鼻亚目');
const anthropoids = taxon('anthropoids', 'clade', 'Anthropoids', '类人猿猴总类');
const catarrhini = taxon('catarrhini', 'clade', 'Catarrhini', '狭鼻小目');
const apes = taxon('apes', 'clade', 'Apes', '类人猿');
const greatApes = taxon('great-apes', 'clade', 'Great apes', '大型类人猿');
const africanGreatApes = taxon('african-great-apes', 'clade', 'African great apes', '非洲大型类人猿');
const humanChimpClade = taxon('human-chimp-clade', 'clade', 'Human-chimp clade', '人-黑猩猩支');
const panClade = taxon('pan-clade', 'clade', 'Pan clade', '黑猩猩属支');

const therians = taxon('therians', 'clade', 'Therians', '兽亚纲');
const placentals = taxon('placentals', 'clade', 'Placental mammals', '有胎盘类');
const boreoeutherians = taxon('boreoeutherians', 'clade', 'Boreoeutherians', '北方真兽类');
const euarchontoglires = taxon('euarchontoglires', 'clade', 'Euarchontoglires', '灵长总目');
const laurasiatherians = taxon('laurasiatherians', 'clade', 'Laurasiatherians', '北方真兽类支');
const glires = taxon('glires', 'clade', 'Glires', '啮形总目');
const rodents = taxon('rodents', 'order', 'Rodents', '啮齿目');
const carnivorans = taxon('carnivorans', 'order', 'Carnivorans', '食肉目');
const catFamily = taxon('cat-family', 'family', 'Cat family', '猫科');
const canisLineage = taxon('canis-lineage', 'clade', 'Canis lineage', '犬属支');

const vertebrates = taxon('vertebrates', 'clade', 'Vertebrates', '脊椎动物');
const jawedVertebrates = taxon('jawed-vertebrates', 'clade', 'Jawed vertebrates', '有颌脊椎动物');
const bonyVertebrates = taxon('bony-vertebrates', 'clade', 'Bony vertebrates', '硬骨脊椎动物');
const tetrapods = taxon('tetrapods', 'clade', 'Tetrapods', '四足动物');
const amniotes = taxon('amniotes', 'clade', 'Amniotes', '羊膜动物');
const sauropsids = taxon('sauropsids', 'clade', 'Sauropsids', '蜥形类');
const archosaurs = taxon('archosaurs', 'clade', 'Archosaurs', '主龙类');
const crocodilians = taxon('crocodilians', 'clade', 'Crocodilians', '鳄形类');
const rayFinnedFishes = taxon('ray-finned-fishes', 'class', 'Ray-finned fishes', '辐鳍鱼类');

const greenPlants = taxon('green-plants', 'kingdom', 'Green plants', '绿色植物');
const landPlants = taxon('land-plants', 'clade', 'Land plants', '陆生植物');
const vascularPlants = taxon('vascular-plants', 'clade', 'Vascular plants', '维管植物');
const seedPlants = taxon('seed-plants', 'clade', 'Seed plants', '种子植物');
const floweringPlants = taxon('flowering-plants', 'clade', 'Flowering plants', '被子植物');
const conifers = taxon('conifers', 'clade', 'Conifers', '针叶植物');
const grassFamily = taxon('grass-family', 'family', 'Grass family', '禾本科');
const roseFamily = taxon('rose-family', 'family', 'Rose family', '蔷薇科');
const daisyFamily = taxon('daisy-family', 'family', 'Daisy family', '菊科');

const fungi = taxon('fungi', 'kingdom', 'Fungi', '真菌界');
const dikarya = taxon('dikarya', 'clade', 'Dikarya', '双核亚界');
const ascomycetes = taxon('ascomycetes', 'phylum', 'Ascomycetes', '子囊菌');
const mushroomFungi = taxon('mushroom-fungi', 'clade', 'Mushroom-forming fungi', '大型伞菌类');
const gilledMushrooms = taxon('gilled-mushrooms', 'clade', 'Gilled mushrooms', '褶伞菌类');
const cupFungi = taxon('cup-fungi', 'clade', 'Cup fungi', '杯菌类');
const commonMolds = taxon('common-molds', 'clade', 'Common molds', '常见霉菌支');

const primateLineage = (...steps: TaxonStep[]) => lineage(eukaryota, animalia, chordata, mammalia, primates, ...steps);
const mammalLineage = (...steps: TaxonStep[]) => lineage(eukaryota, animalia, chordata, mammalia, ...steps);
const vertebrateLineage = (...steps: TaxonStep[]) => lineage(eukaryota, animalia, chordata, ...steps);
const plantLineage = (...steps: TaxonStep[]) => lineage(eukaryota, greenPlants, ...steps);
const fungiLineage = (...steps: TaxonStep[]) => lineage(eukaryota, ...steps);

export const speciesCatalog: Species[] = [
  createSpecies('lemur', 'Ring-tailed lemur', '环尾狐猴', 'Lemur catta', 'lemur', 1, primateLineage(taxon('strepsirrhini', 'clade', 'Strepsirrhini', '曲鼻亚目'))),
  createSpecies('tarsier', 'Philippine tarsier', '菲律宾眼镜猴', 'Carlito syrichta', 'tarsier', 2, primateLineage(haplorhini, taxon('tarsiiformes', 'family', 'Tarsiiformes', '眼镜猴形类'))),
  createSpecies('capuchin', 'Tufted capuchin', '卷尾猴', 'Sapajus apella', 'capuchin', 3, primateLineage(haplorhini, anthropoids, taxon('new-world-primates', 'clade', 'New World primates', '新世界灵长类'))),
  createSpecies('macaque', 'Rhesus macaque', '恒河猴', 'Macaca mulatta', 'macaque', 4, primateLineage(haplorhini, anthropoids, catarrhini, taxon('old-world-monkeys', 'clade', 'Old World monkeys', '旧世界猴类'))),
  createSpecies('baboon', 'Olive baboon', '狒狒', 'Papio anubis', 'baboon', 5, primateLineage(haplorhini, anthropoids, catarrhini, taxon('old-world-monkeys', 'clade', 'Old World monkeys', '旧世界猴类'))),
  createSpecies('gibbon', 'Lar gibbon', '白手长臂猿', 'Hylobates lar', 'gibbon', 6, primateLineage(haplorhini, anthropoids, catarrhini, apes, taxon('gibbon-family', 'family', 'Gibbon family', '长臂猿科'))),
  createSpecies('siamang', 'Siamang', '合趾猿', 'Symphalangus syndactylus', 'siamang', 7, primateLineage(haplorhini, anthropoids, catarrhini, apes, taxon('gibbon-family', 'family', 'Gibbon family', '长臂猿科'))),
  createSpecies('orangutan', 'Bornean orangutan', '婆罗洲红毛猩猩', 'Pongo pygmaeus', 'orangutan', 8, primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, taxon('orangutan-line', 'clade', 'Orangutan line', '红毛猩猩支'))),
  createSpecies('gorilla', 'Western gorilla', '西部大猩猩', 'Gorilla gorilla', 'gorilla', 9, primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, taxon('gorilla-line', 'clade', 'Gorilla line', '大猩猩支'))),
  createSpecies('human', 'Human', '人类', 'Homo sapiens', 'human', 10, primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, taxon('homo', 'genus', 'Homo', '人属'))),
  createSpecies('bonobo', 'Bonobo', '倭黑猩猩', 'Pan paniscus', 'bonobo', 11, primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, panClade)),
  createSpecies('chimpanzee', 'Chimpanzee', '黑猩猩', 'Pan troglodytes', 'chimpanzee', 12, primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, panClade)),

  createSpecies('platypus', 'Platypus', '鸭嘴兽', 'Ornithorhynchus anatinus', 'platypus', 13, mammalLineage(taxon('monotremes', 'clade', 'Monotremes', '单孔类'))),
  createSpecies('opossum', 'Virginia opossum', '弗吉尼亚负鼠', 'Didelphis virginiana', 'opossum', 14, mammalLineage(therians, taxon('marsupials', 'clade', 'Marsupials', '有袋类'))),
  createSpecies('rabbit', 'European rabbit', '欧洲兔', 'Oryctolagus cuniculus', 'rabbit', 15, mammalLineage(placentals, glires, taxon('lagomorphs', 'order', 'Lagomorphs', '兔形目'))),
  createSpecies('mouse', 'House mouse', '小家鼠', 'Mus musculus', 'mouse', 16, mammalLineage(placentals, boreoeutherians, euarchontoglires, glires, rodents)),
  createSpecies('squirrel', 'Red squirrel', '赤松鼠', 'Sciurus vulgaris', 'squirrel', 17, mammalLineage(placentals, euarchontoglires, glires, rodents)),
  createSpecies('bat', 'Little brown bat', '小棕蝠', 'Myotis lucifugus', 'bat', 18, mammalLineage(placentals, boreoeutherians, laurasiatherians, taxon('bats', 'order', 'Bats', '翼手目'))),
  createSpecies('horse', 'Horse', '家马', 'Equus ferus caballus', 'horse', 19, mammalLineage(placentals, laurasiatherians, taxon('hoofed-mammals', 'clade', 'Hoofed mammals', '有蹄哺乳类'))),
  createSpecies('pig', 'Pig', '猪', 'Sus scrofa domesticus', 'pig', 20, mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'))),
  createSpecies('cow', 'Cow', '家牛', 'Bos taurus', 'cow', 21, mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'), taxon('whippomorpha', 'clade', 'Whippomorpha', '鲸河马类群'))),
  createSpecies('dolphin', 'Bottlenose dolphin', '宽吻海豚', 'Tursiops truncatus', 'dolphin', 22, mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'), taxon('whippomorpha', 'clade', 'Whippomorpha', '鲸河马类群'))),
  createSpecies('gray-wolf', 'Gray wolf', '灰狼', 'Canis lupus', 'wolf', 23, mammalLineage(placentals, laurasiatherians, carnivorans, canisLineage)),
  createSpecies('dog', 'Domestic dog', '家犬', 'Canis familiaris', 'dog', 24, mammalLineage(placentals, laurasiatherians, carnivorans, canisLineage)),
  createSpecies('fox', 'Red fox', '赤狐', 'Vulpes vulpes', 'fox', 25, mammalLineage(placentals, laurasiatherians, carnivorans, taxon('fox-line', 'clade', 'Fox line', '狐支'))),
  createSpecies('domestic-cat', 'Domestic cat', '家猫', 'Felis catus', 'cat', 26, mammalLineage(placentals, laurasiatherians, carnivorans, catFamily)),
  createSpecies('lion', 'Lion', '狮子', 'Panthera leo', 'lion', 27, mammalLineage(placentals, laurasiatherians, carnivorans, catFamily, taxon('panthera', 'genus', 'Panthera', '豹属'))),
  createSpecies('tiger', 'Tiger', '老虎', 'Panthera tigris', 'tiger', 28, mammalLineage(placentals, laurasiatherians, carnivorans, catFamily, taxon('panthera', 'genus', 'Panthera', '豹属'))),

  createSpecies('lamprey', 'Sea lamprey', '七鳃鳗', 'Petromyzon marinus', 'lamprey', 29, vertebrateLineage(vertebrates, taxon('jawless-vertebrates', 'clade', 'Jawless vertebrates', '无颌脊椎动物'))),
  createSpecies('shark', 'Great white shark', '大白鲨', 'Carcharodon carcharias', 'shark', 30, vertebrateLineage(vertebrates, jawedVertebrates, taxon('cartilaginous-fishes', 'class', 'Cartilaginous fishes', '软骨鱼类'))),
  createSpecies('ray', 'Manta ray', '蝠鲼', 'Mobula birostris', 'ray', 31, vertebrateLineage(vertebrates, jawedVertebrates, taxon('cartilaginous-fishes', 'class', 'Cartilaginous fishes', '软骨鱼类'))),
  createSpecies('salmon', 'Atlantic salmon', '大西洋鲑', 'Salmo salar', 'salmon', 32, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('trout', 'Rainbow trout', '虹鳟', 'Oncorhynchus mykiss', 'trout', 33, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('carp', 'Common carp', '鲤鱼', 'Cyprinus carpio', 'carp', 34, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('frog', 'Common frog', '普通蛙', 'Rana temporaria', 'frog', 35, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, taxon('amphibians', 'class', 'Amphibians', '两栖类'))),
  createSpecies('salamander', 'Fire salamander', '火蝾螈', 'Salamandra salamandra', 'salamander', 36, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, taxon('amphibians', 'class', 'Amphibians', '两栖类'))),
  createSpecies('turtle', 'Pond turtle', '池龟', 'Emys orbicularis', 'turtle', 37, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids)),
  createSpecies('lizard', 'Green anole', '绿变色龙蜥', 'Anolis carolinensis', 'lizard', 38, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids)),
  createSpecies('crocodile', 'Nile crocodile', '尼罗鳄', 'Crocodylus niloticus', 'crocodile', 39, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, crocodilians)),
  createSpecies('alligator', 'American alligator', '短吻鳄', 'Alligator mississippiensis', 'alligator', 40, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, crocodilians)),
  createSpecies('chicken', 'Chicken', '鸡', 'Gallus gallus', 'chicken', 41, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, taxon('birds', 'class', 'Birds', '鸟类'))),
  createSpecies('duck', 'Mallard duck', '绿头鸭', 'Anas platyrhynchos', 'duck', 42, vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, taxon('birds', 'class', 'Birds', '鸟类'))),

  createSpecies('charophyte', 'Stonewort', '轮藻', 'Chara vulgaris', 'algae', 43, plantLineage(taxon('charophytes', 'clade', 'Charophytes', '轮藻类'))),
  createSpecies('moss', 'Common haircap moss', '普通金发藓', 'Polytrichum commune', 'moss', 44, plantLineage(landPlants, taxon('mosses', 'clade', 'Mosses', '藓类'))),
  createSpecies('fern', 'Bracken fern', '欧洲蕨', 'Pteridium aquilinum', 'fern', 45, plantLineage(landPlants, vascularPlants, taxon('ferns', 'clade', 'Ferns', '蕨类'))),
  createSpecies('horsetail', 'Field horsetail', '问荆', 'Equisetum arvense', 'horsetail', 46, plantLineage(landPlants, vascularPlants, taxon('horsetails', 'clade', 'Horsetails', '木贼类'))),
  createSpecies('pine', 'Scots pine', '欧洲赤松', 'Pinus sylvestris', 'pine', 47, plantLineage(landPlants, vascularPlants, seedPlants, conifers)),
  createSpecies('spruce', 'Norway spruce', '云杉', 'Picea abies', 'spruce', 48, plantLineage(landPlants, vascularPlants, seedPlants, conifers)),
  createSpecies('oak', 'English oak', '欧洲栎', 'Quercus robur', 'oak', 49, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants)),
  createSpecies('beech', 'European beech', '欧洲山毛榉', 'beech', 50, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants)),
  createSpecies('sunflower', 'Common sunflower', '向日葵', 'Helianthus annuus', 'sunflower', 51, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, daisyFamily)),
  createSpecies('daisy', 'Oxeye daisy', '滨菊', 'Leucanthemum vulgare', 'daisy', 52, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, daisyFamily)),
  createSpecies('wheat', 'Bread wheat', '小麦', 'Triticum aestivum', 'wheat', 53, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, grassFamily)),
  createSpecies('rice', 'Rice', '水稻', 'Oryza sativa', 'rice', 54, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, grassFamily)),
  createSpecies('rose', 'Rose', '蔷薇', 'Rosa chinensis', 'rose', 55, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, roseFamily)),
  createSpecies('apple', 'Apple tree', '苹果树', 'Malus domestica', 'apple', 56, plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, roseFamily)),

  createSpecies('slime-mold', 'Slime mold', '黏菌', 'Physarum polycephalum', 'slime-mold', 57, fungiLineage(taxon('amoebozoa', 'clade', 'Amoebozoa', '变形虫总群'))),
  createSpecies('yeast', 'Baker’s yeast', '酿酒酵母', 'Saccharomyces cerevisiae', 'yeast', 58, fungiLineage(fungi, taxon('budding-yeasts', 'clade', 'Budding yeasts', '出芽酵母类'))),
  createSpecies('penicillium', 'Penicillium', '青霉', 'Penicillium chrysogenum', 'penicillium', 59, fungiLineage(fungi, dikarya, ascomycetes, commonMolds)),
  createSpecies('aspergillus', 'Aspergillus', '曲霉', 'Aspergillus niger', 'aspergillus', 60, fungiLineage(fungi, dikarya, ascomycetes, commonMolds)),
  createSpecies('morel', 'Morel', '羊肚菌', 'Morchella esculenta', 'morel', 61, fungiLineage(fungi, dikarya, ascomycetes, cupFungi)),
  createSpecies('truffle', 'Black truffle', '黑松露', 'Tuber melanosporum', 'truffle', 62, fungiLineage(fungi, dikarya, ascomycetes, cupFungi)),
  createSpecies('oyster-mushroom', 'Oyster mushroom', '平菇', 'Pleurotus ostreatus', 'oyster mushroom', 63, fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('shiitake', 'Shiitake', '香菇', 'Lentinula edodes', 'shiitake', 64, fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('button-mushroom', 'Button mushroom', '双孢蘑菇', 'Agaricus bisporus', 'button mushroom', 65, fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('fly-agaric', 'Fly agaric', '毒蝇伞', 'Amanita muscaria', 'mushroom', 66, fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
];

const speciesMapLocal = new Map(speciesCatalog.map((species) => [species.id, species]));

const getSpeciesNames = (speciesIds: string[]): LocalizedText[] =>
  speciesIds.map((speciesId) => speciesMapLocal.get(speciesId)?.names ?? t(speciesId, speciesId));

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

type LadderSeries = {
  id: string;
  theme: QuizTheme;
  speciesIds: [string, string, string, string, string];
  ancestors: [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
};

const buildLadderTree = (
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

const buildQuiz = (id: string, difficulty: Difficulty, theme: QuizTheme, speciesIds: string[], ancestors: LocalizedText[]): QuizTemplate => {
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

const buildSeriesQuizzes = (series: LadderSeries): QuizTemplate[] => [
  buildQuiz(`${series.id}-easy`, 'easy', series.theme, series.speciesIds.slice(2), series.ancestors.slice(2)),
  buildQuiz(`${series.id}-medium`, 'medium', series.theme, series.speciesIds.slice(1), series.ancestors.slice(1)),
  buildQuiz(`${series.id}-hard`, 'hard', series.theme, series.speciesIds, series.ancestors),
];

const seriesCatalog: LadderSeries[] = [
  {
    id: 'apes-01',
    theme: 'apes',
    speciesIds: ['lemur', 'tarsier', 'capuchin', 'macaque', 'baboon'],
    ancestors: [t('Primates', '灵长目'), t('Haplorhini', '简鼻亚目'), t('Anthropoids', '类人总类'), t('Old World monkeys', '旧世界猴类')],
  },
  {
    id: 'apes-02',
    theme: 'apes',
    speciesIds: ['lemur', 'tarsier', 'capuchin', 'macaque', 'gibbon'],
    ancestors: [t('Primates', '灵长目'), t('Haplorhini', '简鼻亚目'), t('Anthropoids', '类人总类'), t('Catarrhini', '狭鼻小目')],
  },
  {
    id: 'apes-03',
    theme: 'apes',
    speciesIds: ['tarsier', 'capuchin', 'macaque', 'gibbon', 'orangutan'],
    ancestors: [t('Haplorhini', '简鼻亚目'), t('Anthropoids', '类人总类'), t('Catarrhini', '狭鼻小目'), t('Apes', '类人猿')],
  },
  {
    id: 'apes-04',
    theme: 'apes',
    speciesIds: ['capuchin', 'macaque', 'gibbon', 'orangutan', 'gorilla'],
    ancestors: [t('Anthropoids', '类人总类'), t('Catarrhini', '狭鼻小目'), t('Apes', '类人猿'), t('Great apes', '大型类人猿')],
  },
  {
    id: 'apes-05',
    theme: 'apes',
    speciesIds: ['macaque', 'gibbon', 'orangutan', 'gorilla', 'human'],
    ancestors: [t('Catarrhini', '狭鼻小目'), t('Apes', '类人猿'), t('Great apes', '大型类人猿'), t('African great apes', '非洲大型类人猿')],
  },
  {
    id: 'apes-06',
    theme: 'apes',
    speciesIds: ['gibbon', 'orangutan', 'gorilla', 'human', 'chimpanzee'],
    ancestors: [t('Apes', '类人猿'), t('Great apes', '大型类人猿'), t('African great apes', '非洲大型类人猿'), t('Human-chimp clade', '人-黑猩猩支')],
  },
  {
    id: 'apes-07',
    theme: 'apes',
    speciesIds: ['gibbon', 'orangutan', 'gorilla', 'bonobo', 'chimpanzee'],
    ancestors: [t('Apes', '类人猿'), t('Great apes', '大型类人猿'), t('African great apes', '非洲大型类人猿'), t('Pan clade', '黑猩猩属支')],
  },
  {
    id: 'apes-08',
    theme: 'apes',
    speciesIds: ['lemur', 'tarsier', 'macaque', 'human', 'chimpanzee'],
    ancestors: [t('Primates', '灵长目'), t('Haplorhini', '简鼻亚目'), t('Catarrhini', '狭鼻小目'), t('Human-chimp clade', '人-黑猩猩支')],
  },
  {
    id: 'apes-09',
    theme: 'apes',
    speciesIds: ['tarsier', 'capuchin', 'gibbon', 'human', 'chimpanzee'],
    ancestors: [t('Haplorhini', '简鼻亚目'), t('Anthropoids', '类人总类'), t('Apes', '类人猿'), t('Human-chimp clade', '人-黑猩猩支')],
  },
  {
    id: 'apes-10',
    theme: 'apes',
    speciesIds: ['capuchin', 'macaque', 'orangutan', 'human', 'chimpanzee'],
    ancestors: [t('Anthropoids', '类人总类'), t('Catarrhini', '狭鼻小目'), t('Great apes', '大型类人猿'), t('Human-chimp clade', '人-黑猩猩支')],
  },

  {
    id: 'mammals-01',
    theme: 'mammals',
    speciesIds: ['platypus', 'opossum', 'rabbit', 'horse', 'domestic-cat'],
    ancestors: [t('Mammals', '哺乳动物'), t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Laurasiatherians', '北方真兽类支')],
  },
  {
    id: 'mammals-02',
    theme: 'mammals',
    speciesIds: ['opossum', 'rabbit', 'mouse', 'horse', 'domestic-cat'],
    ancestors: [t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Boreoeutherians', '北方真兽类'), t('Laurasiatherians', '北方真兽类支')],
  },
  {
    id: 'mammals-03',
    theme: 'mammals',
    speciesIds: ['rabbit', 'mouse', 'bat', 'gray-wolf', 'domestic-cat'],
    ancestors: [t('Placental mammals', '有胎盘类'), t('Boreoeutherians', '北方真兽类'), t('Laurasiatherians', '北方真兽类支'), t('Carnivorans', '食肉目')],
  },
  {
    id: 'mammals-04',
    theme: 'mammals',
    speciesIds: ['platypus', 'opossum', 'bat', 'horse', 'dolphin'],
    ancestors: [t('Mammals', '哺乳动物'), t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Laurasiatherians', '北方真兽类支')],
  },
  {
    id: 'mammals-05',
    theme: 'mammals',
    speciesIds: ['platypus', 'opossum', 'mouse', 'human', 'chimpanzee'],
    ancestors: [t('Mammals', '哺乳动物'), t('Therians', '兽亚纲'), t('Euarchontoglires', '灵长总目'), t('Human-chimp clade', '人-黑猩猩支')],
  },
  {
    id: 'mammals-06',
    theme: 'mammals',
    speciesIds: ['platypus', 'opossum', 'rabbit', 'mouse', 'squirrel'],
    ancestors: [t('Mammals', '哺乳动物'), t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Rodents', '啮齿目')],
  },
  {
    id: 'mammals-07',
    theme: 'mammals',
    speciesIds: ['opossum', 'horse', 'pig', 'cow', 'dolphin'],
    ancestors: [t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Cetartiodactyls', '偶蹄类'), t('Whippomorpha', '鲸河马类群')],
  },
  {
    id: 'mammals-08',
    theme: 'mammals',
    speciesIds: ['rabbit', 'mouse', 'bat', 'dog', 'gray-wolf'],
    ancestors: [t('Placental mammals', '有胎盘类'), t('Boreoeutherians', '北方真兽类'), t('Laurasiatherians', '北方真兽类支'), t('Canis lineage', '犬属支')],
  },
  {
    id: 'mammals-09',
    theme: 'mammals',
    speciesIds: ['opossum', 'bat', 'domestic-cat', 'lion', 'tiger'],
    ancestors: [t('Therians', '兽亚纲'), t('Placental mammals', '有胎盘类'), t('Cat family', '猫科'), t('Panthera lineage', '豹属支')],
  },
  {
    id: 'mammals-10',
    theme: 'mammals',
    speciesIds: ['platypus', 'rabbit', 'mouse', 'human', 'chimpanzee'],
    ancestors: [t('Mammals', '哺乳动物'), t('Placental mammals', '有胎盘类'), t('Euarchontoglires', '灵长总目'), t('Human-chimp clade', '人-黑猩猩支')],
  },

  {
    id: 'vertebrates-01',
    theme: 'vertebrates',
    speciesIds: ['lamprey', 'shark', 'salmon', 'frog', 'chicken'],
    ancestors: [t('Vertebrates', '脊椎动物'), t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物')],
  },
  {
    id: 'vertebrates-02',
    theme: 'vertebrates',
    speciesIds: ['shark', 'salmon', 'frog', 'lizard', 'chicken'],
    ancestors: [t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物'), t('Amniotes', '羊膜动物')],
  },
  {
    id: 'vertebrates-03',
    theme: 'vertebrates',
    speciesIds: ['shark', 'salmon', 'turtle', 'crocodile', 'chicken'],
    ancestors: [t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Sauropsids', '蜥形类'), t('Archosaurs', '主龙类')],
  },
  {
    id: 'vertebrates-04',
    theme: 'vertebrates',
    speciesIds: ['salmon', 'frog', 'lizard', 'crocodile', 'chicken'],
    ancestors: [t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物'), t('Sauropsids', '蜥形类'), t('Archosaurs', '主龙类')],
  },
  {
    id: 'vertebrates-05',
    theme: 'vertebrates',
    speciesIds: ['lamprey', 'shark', 'salmon', 'crocodile', 'alligator'],
    ancestors: [t('Vertebrates', '脊椎动物'), t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Crocodilians', '鳄形类')],
  },
  {
    id: 'vertebrates-06',
    theme: 'vertebrates',
    speciesIds: ['shark', 'salmon', 'frog', 'crocodile', 'alligator'],
    ancestors: [t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物'), t('Crocodilians', '鳄形类')],
  },
  {
    id: 'vertebrates-07',
    theme: 'vertebrates',
    speciesIds: ['lamprey', 'carp', 'frog', 'turtle', 'chicken'],
    ancestors: [t('Vertebrates', '脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物'), t('Sauropsids', '蜥形类')],
  },
  {
    id: 'vertebrates-08',
    theme: 'vertebrates',
    speciesIds: ['lamprey', 'ray', 'salmon', 'turtle', 'chicken'],
    ancestors: [t('Vertebrates', '脊椎动物'), t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Sauropsids', '蜥形类')],
  },
  {
    id: 'vertebrates-09',
    theme: 'vertebrates',
    speciesIds: ['shark', 'trout', 'frog', 'lizard', 'duck'],
    ancestors: [t('Jawed vertebrates', '有颌脊椎动物'), t('Bony vertebrates', '硬骨脊椎动物'), t('Tetrapods', '四足动物'), t('Amniotes', '羊膜动物')],
  },
  {
    id: 'vertebrates-10',
    theme: 'vertebrates',
    speciesIds: ['lamprey', 'shark', 'frog', 'crocodile', 'duck'],
    ancestors: [t('Vertebrates', '脊椎动物'), t('Jawed vertebrates', '有颌脊椎动物'), t('Tetrapods', '四足动物'), t('Archosaurs', '主龙类')],
  },

  {
    id: 'plants-01',
    theme: 'plants',
    speciesIds: ['charophyte', 'moss', 'fern', 'pine', 'oak'],
    ancestors: [t('Green plants', '绿色植物'), t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Seed plants', '种子植物')],
  },
  {
    id: 'plants-02',
    theme: 'plants',
    speciesIds: ['moss', 'fern', 'pine', 'oak', 'sunflower'],
    ancestors: [t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Seed plants', '种子植物'), t('Flowering plants', '被子植物')],
  },
  {
    id: 'plants-03',
    theme: 'plants',
    speciesIds: ['fern', 'pine', 'oak', 'sunflower', 'daisy'],
    ancestors: [t('Vascular plants', '维管植物'), t('Seed plants', '种子植物'), t('Flowering plants', '被子植物'), t('Daisy family', '菊科')],
  },
  {
    id: 'plants-04',
    theme: 'plants',
    speciesIds: ['fern', 'pine', 'oak', 'rose', 'apple'],
    ancestors: [t('Vascular plants', '维管植物'), t('Seed plants', '种子植物'), t('Flowering plants', '被子植物'), t('Rose family', '蔷薇科')],
  },
  {
    id: 'plants-05',
    theme: 'plants',
    speciesIds: ['moss', 'fern', 'pine', 'wheat', 'rice'],
    ancestors: [t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Seed plants', '种子植物'), t('Grass family', '禾本科')],
  },
  {
    id: 'plants-06',
    theme: 'plants',
    speciesIds: ['charophyte', 'moss', 'fern', 'spruce', 'pine'],
    ancestors: [t('Green plants', '绿色植物'), t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Conifers', '针叶植物')],
  },
  {
    id: 'plants-07',
    theme: 'plants',
    speciesIds: ['charophyte', 'moss', 'horsetail', 'pine', 'oak'],
    ancestors: [t('Green plants', '绿色植物'), t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Seed plants', '种子植物')],
  },
  {
    id: 'plants-08',
    theme: 'plants',
    speciesIds: ['charophyte', 'moss', 'fern', 'wheat', 'rice'],
    ancestors: [t('Green plants', '绿色植物'), t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Grass family', '禾本科')],
  },
  {
    id: 'plants-09',
    theme: 'plants',
    speciesIds: ['moss', 'fern', 'pine', 'rose', 'sunflower'],
    ancestors: [t('Land plants', '陆生植物'), t('Vascular plants', '维管植物'), t('Seed plants', '种子植物'), t('Flowering plants', '被子植物')],
  },
  {
    id: 'plants-10',
    theme: 'plants',
    speciesIds: ['charophyte', 'moss', 'pine', 'rose', 'apple'],
    ancestors: [t('Green plants', '绿色植物'), t('Land plants', '陆生植物'), t('Seed plants', '种子植物'), t('Rose family', '蔷薇科')],
  },

  {
    id: 'fungi-01',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'morel', 'oyster-mushroom', 'shiitake'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Dikarya', '双核亚界'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-02',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'truffle', 'oyster-mushroom', 'button-mushroom'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Dikarya', '双核亚界'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-03',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'morel', 'penicillium', 'aspergillus'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Ascomycetes', '子囊菌'), t('Common molds', '常见霉菌支')],
  },
  {
    id: 'fungi-04',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'truffle', 'penicillium', 'aspergillus'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Ascomycetes', '子囊菌'), t('Common molds', '常见霉菌支')],
  },
  {
    id: 'fungi-05',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'oyster-mushroom', 'shiitake', 'button-mushroom'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Mushroom-forming fungi', '大型伞菌类'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-06',
    theme: 'fungi',
    speciesIds: ['yeast', 'morel', 'truffle', 'penicillium', 'aspergillus'],
    ancestors: [t('Fungi', '真菌'), t('Ascomycetes', '子囊菌'), t('Filamentous ascomycetes', '丝状子囊菌支'), t('Common molds', '常见霉菌支')],
  },
  {
    id: 'fungi-07',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'morel', 'oyster-mushroom', 'fly-agaric', 'shiitake'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Dikarya', '双核亚界'), t('Mushroom-forming fungi', '大型伞菌类'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-08',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'oyster-mushroom', 'fly-agaric', 'button-mushroom'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Mushroom-forming fungi', '大型伞菌类'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-09',
    theme: 'fungi',
    speciesIds: ['yeast', 'morel', 'oyster-mushroom', 'fly-agaric', 'button-mushroom'],
    ancestors: [t('Fungi', '真菌'), t('Dikarya', '双核亚界'), t('Mushroom-forming fungi', '大型伞菌类'), t('Gilled mushrooms', '褶伞菌类')],
  },
  {
    id: 'fungi-10',
    theme: 'fungi',
    speciesIds: ['slime-mold', 'yeast', 'penicillium', 'morel', 'truffle'],
    ancestors: [t('Eukaryotes', '真核生物'), t('Fungi', '真菌'), t('Ascomycetes', '子囊菌'), t('Cup fungi', '杯菌类')],
  },
];

export const quizTemplates: QuizTemplate[] = seriesCatalog.flatMap(buildSeriesQuizzes);

export const speciesMap = new Map(speciesCatalog.map((species) => [species.id, species]));

export const quizThemes: QuizTheme[] = ['apes', 'mammals', 'vertebrates', 'plants', 'fungi'];

export const templatesByDifficulty: Record<Difficulty, QuizTemplate[]> = {
  easy: quizTemplates.filter((quiz) => quiz.difficulty === 'easy'),
  medium: quizTemplates.filter((quiz) => quiz.difficulty === 'medium'),
  hard: quizTemplates.filter((quiz) => quiz.difficulty === 'hard'),
};
