import { LocalizedText, QuizTheme } from '../types';
import { t } from './helpers';

export type LadderSeries = {
  id: string;
  theme: QuizTheme;
  speciesIds: [string, string, string, string, string];
  ancestors: [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
};

export const seriesCatalog: LadderSeries[] = [
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
