import { Species, TaxonStep } from '../types';
import { lineage, t, taxon } from './helpers';
import { speciesImageUrls } from './speciesImages';

const createSpecies = (
  id: string,
  en: string,
  zhHans: string,
  scientificName: string,
  speciesLineage: TaxonStep[],
): Species => ({
  id,
  names: t(en, zhHans),
  scientificName,
  photoUrl: speciesImageUrls[id] ?? '',
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
  createSpecies('lemur', 'Ring-tailed lemur', '环尾狐猴', 'Lemur catta', primateLineage(taxon('strepsirrhini', 'clade', 'Strepsirrhini', '曲鼻亚目'))),
  createSpecies('tarsier', 'Philippine tarsier', '菲律宾眼镜猴', 'Carlito syrichta', primateLineage(haplorhini, taxon('tarsiiformes', 'family', 'Tarsiiformes', '眼镜猴形类'))),
  createSpecies('capuchin', 'Tufted capuchin', '卷尾猴', 'Sapajus apella', primateLineage(haplorhini, anthropoids, taxon('new-world-primates', 'clade', 'New World primates', '新世界灵长类'))),
  createSpecies('macaque', 'Rhesus macaque', '恒河猴', 'Macaca mulatta', primateLineage(haplorhini, anthropoids, catarrhini, taxon('old-world-monkeys', 'clade', 'Old World monkeys', '旧世界猴类'))),
  createSpecies('baboon', 'Olive baboon', '狒狒', 'Papio anubis', primateLineage(haplorhini, anthropoids, catarrhini, taxon('old-world-monkeys', 'clade', 'Old World monkeys', '旧世界猴类'))),
  createSpecies('gibbon', 'Lar gibbon', '白手长臂猿', 'Hylobates lar', primateLineage(haplorhini, anthropoids, catarrhini, apes, taxon('gibbon-family', 'family', 'Gibbon family', '长臂猿科'))),
  createSpecies('siamang', 'Siamang', '合趾猿', 'Symphalangus syndactylus', primateLineage(haplorhini, anthropoids, catarrhini, apes, taxon('gibbon-family', 'family', 'Gibbon family', '长臂猿科'))),
  createSpecies('orangutan', 'Bornean orangutan', '婆罗洲红毛猩猩', 'Pongo pygmaeus', primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, taxon('orangutan-line', 'clade', 'Orangutan line', '红毛猩猩支'))),
  createSpecies('gorilla', 'Western gorilla', '西部大猩猩', 'Gorilla gorilla', primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, taxon('gorilla-line', 'clade', 'Gorilla line', '大猩猩支'))),
  createSpecies('human', 'Human', '人类', 'Homo sapiens', primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, taxon('homo', 'genus', 'Homo', '人属'))),
  createSpecies('bonobo', 'Bonobo', '倭黑猩猩', 'Pan paniscus', primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, panClade)),
  createSpecies('chimpanzee', 'Chimpanzee', '黑猩猩', 'Pan troglodytes', primateLineage(haplorhini, anthropoids, catarrhini, apes, greatApes, africanGreatApes, humanChimpClade, panClade)),

  createSpecies('platypus', 'Platypus', '鸭嘴兽', 'Ornithorhynchus anatinus', mammalLineage(taxon('monotremes', 'clade', 'Monotremes', '单孔类'))),
  createSpecies('opossum', 'Virginia opossum', '弗吉尼亚负鼠', 'Didelphis virginiana', mammalLineage(therians, taxon('marsupials', 'clade', 'Marsupials', '有袋类'))),
  createSpecies('rabbit', 'European rabbit', '欧洲兔', 'Oryctolagus cuniculus', mammalLineage(placentals, glires, taxon('lagomorphs', 'order', 'Lagomorphs', '兔形目'))),
  createSpecies('mouse', 'House mouse', '小家鼠', 'Mus musculus', mammalLineage(placentals, boreoeutherians, euarchontoglires, glires, rodents)),
  createSpecies('squirrel', 'Red squirrel', '赤松鼠', 'Sciurus vulgaris', mammalLineage(placentals, euarchontoglires, glires, rodents)),
  createSpecies('bat', 'Little brown bat', '小棕蝠', 'Myotis lucifugus', mammalLineage(placentals, boreoeutherians, laurasiatherians, taxon('bats', 'order', 'Bats', '翼手目'))),
  createSpecies('horse', 'Horse', '家马', 'Equus ferus caballus', mammalLineage(placentals, laurasiatherians, taxon('hoofed-mammals', 'clade', 'Hoofed mammals', '有蹄哺乳类'))),
  createSpecies('pig', 'Pig', '猪', 'Sus scrofa domesticus', mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'))),
  createSpecies('cow', 'Cow', '家牛', 'Bos taurus', mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'), taxon('whippomorpha', 'clade', 'Whippomorpha', '鲸河马类群'))),
  createSpecies('dolphin', 'Bottlenose dolphin', '宽吻海豚', 'Tursiops truncatus', mammalLineage(placentals, laurasiatherians, taxon('cetartiodactyls', 'clade', 'Even-toed hoofed mammals', '偶蹄类'), taxon('whippomorpha', 'clade', 'Whippomorpha', '鲸河马类群'))),
  createSpecies('gray-wolf', 'Gray wolf', '灰狼', 'Canis lupus', mammalLineage(placentals, laurasiatherians, carnivorans, canisLineage)),
  createSpecies('dog', 'Domestic dog', '家犬', 'Canis familiaris', mammalLineage(placentals, laurasiatherians, carnivorans, canisLineage)),
  createSpecies('fox', 'Red fox', '赤狐', 'Vulpes vulpes', mammalLineage(placentals, laurasiatherians, carnivorans, taxon('fox-line', 'clade', 'Fox line', '狐支'))),
  createSpecies('domestic-cat', 'Domestic cat', '家猫', 'Felis catus', mammalLineage(placentals, laurasiatherians, carnivorans, catFamily)),
  createSpecies('lion', 'Lion', '狮子', 'Panthera leo', mammalLineage(placentals, laurasiatherians, carnivorans, catFamily, taxon('panthera', 'genus', 'Panthera', '豹属'))),
  createSpecies('tiger', 'Tiger', '老虎', 'Panthera tigris', mammalLineage(placentals, laurasiatherians, carnivorans, catFamily, taxon('panthera', 'genus', 'Panthera', '豹属'))),

  createSpecies('lamprey', 'Sea lamprey', '七鳃鳗', 'Petromyzon marinus', vertebrateLineage(vertebrates, taxon('jawless-vertebrates', 'clade', 'Jawless vertebrates', '无颌脊椎动物'))),
  createSpecies('shark', 'Great white shark', '大白鲨', 'Carcharodon carcharias', vertebrateLineage(vertebrates, jawedVertebrates, taxon('cartilaginous-fishes', 'class', 'Cartilaginous fishes', '软骨鱼类'))),
  createSpecies('ray', 'Manta ray', '蝠鲼', 'Mobula birostris', vertebrateLineage(vertebrates, jawedVertebrates, taxon('cartilaginous-fishes', 'class', 'Cartilaginous fishes', '软骨鱼类'))),
  createSpecies('salmon', 'Atlantic salmon', '大西洋鲑', 'Salmo salar', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('trout', 'Rainbow trout', '虹鳟', 'Oncorhynchus mykiss', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('carp', 'Common carp', '鲤鱼', 'Cyprinus carpio', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, rayFinnedFishes)),
  createSpecies('frog', 'Common frog', '普通蛙', 'Rana temporaria', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, taxon('amphibians', 'class', 'Amphibians', '两栖类'))),
  createSpecies('salamander', 'Fire salamander', '火蝾螈', 'Salamandra salamandra', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, taxon('amphibians', 'class', 'Amphibians', '两栖类'))),
  createSpecies('turtle', 'Pond turtle', '池龟', 'Emys orbicularis', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids)),
  createSpecies('lizard', 'Green anole', '绿变色龙蜥', 'Anolis carolinensis', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids)),
  createSpecies('crocodile', 'Nile crocodile', '尼罗鳄', 'Crocodylus niloticus', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, crocodilians)),
  createSpecies('alligator', 'American alligator', '短吻鳄', 'Alligator mississippiensis', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, crocodilians)),
  createSpecies('chicken', 'Chicken', '鸡', 'Gallus gallus', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, taxon('birds', 'class', 'Birds', '鸟类'))),
  createSpecies('duck', 'Mallard duck', '绿头鸭', 'Anas platyrhynchos', vertebrateLineage(vertebrates, jawedVertebrates, bonyVertebrates, tetrapods, amniotes, sauropsids, archosaurs, taxon('birds', 'class', 'Birds', '鸟类'))),

  createSpecies('charophyte', 'Stonewort', '轮藻', 'Chara vulgaris', plantLineage(taxon('charophytes', 'clade', 'Charophytes', '轮藻类'))),
  createSpecies('moss', 'Common haircap moss', '普通金发藓', 'Polytrichum commune', plantLineage(landPlants, taxon('mosses', 'clade', 'Mosses', '藓类'))),
  createSpecies('fern', 'Bracken fern', '欧洲蕨', 'Pteridium aquilinum', plantLineage(landPlants, vascularPlants, taxon('ferns', 'clade', 'Ferns', '蕨类'))),
  createSpecies('horsetail', 'Field horsetail', '问荆', 'Equisetum arvense', plantLineage(landPlants, vascularPlants, taxon('horsetails', 'clade', 'Horsetails', '木贼类'))),
  createSpecies('pine', 'Scots pine', '欧洲赤松', 'Pinus sylvestris', plantLineage(landPlants, vascularPlants, seedPlants, conifers)),
  createSpecies('spruce', 'Norway spruce', '云杉', 'Picea abies', plantLineage(landPlants, vascularPlants, seedPlants, conifers)),
  createSpecies('oak', 'English oak', '欧洲栎', 'Quercus robur', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants)),
  createSpecies('beech', 'European beech', '欧洲山毛榉', 'Fagus sylvatica', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants)),
  createSpecies('sunflower', 'Common sunflower', '向日葵', 'Helianthus annuus', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, daisyFamily)),
  createSpecies('daisy', 'Oxeye daisy', '滨菊', 'Leucanthemum vulgare', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, daisyFamily)),
  createSpecies('wheat', 'Bread wheat', '小麦', 'Triticum aestivum', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, grassFamily)),
  createSpecies('rice', 'Rice', '水稻', 'Oryza sativa', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, grassFamily)),
  createSpecies('rose', 'Rose', '蔷薇', 'Rosa chinensis', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, roseFamily)),
  createSpecies('apple', 'Apple tree', '苹果树', 'Malus domestica', plantLineage(landPlants, vascularPlants, seedPlants, floweringPlants, roseFamily)),

  createSpecies('slime-mold', 'Slime mold', '黏菌', 'Physarum polycephalum', fungiLineage(taxon('amoebozoa', 'clade', 'Amoebozoa', '变形虫总群'))),
  createSpecies('yeast', 'Baker’s yeast', '酿酒酵母', 'Saccharomyces cerevisiae', fungiLineage(fungi, taxon('budding-yeasts', 'clade', 'Budding yeasts', '出芽酵母类'))),
  createSpecies('penicillium', 'Penicillium', '青霉', 'Penicillium chrysogenum', fungiLineage(fungi, dikarya, ascomycetes, commonMolds)),
  createSpecies('aspergillus', 'Aspergillus', '曲霉', 'Aspergillus niger', fungiLineage(fungi, dikarya, ascomycetes, commonMolds)),
  createSpecies('morel', 'Morel', '羊肚菌', 'Morchella esculenta', fungiLineage(fungi, dikarya, ascomycetes, cupFungi)),
  createSpecies('truffle', 'Black truffle', '黑松露', 'Tuber melanosporum', fungiLineage(fungi, dikarya, ascomycetes, cupFungi)),
  createSpecies('oyster-mushroom', 'Oyster mushroom', '平菇', 'Pleurotus ostreatus', fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('shiitake', 'Shiitake', '香菇', 'Lentinula edodes', fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('button-mushroom', 'Button mushroom', '双孢蘑菇', 'Agaricus bisporus', fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
  createSpecies('fly-agaric', 'Fly agaric', '毒蝇伞', 'Amanita muscaria', fungiLineage(fungi, dikarya, mushroomFungi, gilledMushrooms)),
];

export const speciesMap = new Map(speciesCatalog.map((species) => [species.id, species]));
