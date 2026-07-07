import nudeShimmer from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_38 (1).png?url';
import frenchElegant from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_38 (2).png?url';
import marbleGold from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_38 (3).png?url';
import mirrorChrome from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_39 (4).png?url';
import blackRibbons from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_39 (5).png?url';
import pinkRibbons from '../../images for 3d nails/ChatGPT Image 6 juil. 2026, 13_48_39 (6).png?url';

export interface NailDesign {
  id: string;
  name: string;
  image: string;
  title: string;
  subtitle: string;
  bgTint: string; // subtle background tint matching the design
  textureCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
}

export const nailDesigns: NailDesign[] = [
  {
    id: 'nude-shimmer',
    name: 'Nude Shimmer',
    image: nudeShimmer,
    title: 'Nude Scintillant',
    subtitle: 'Un nude rosé lumineux, enrichi de micro-paillettes délicates.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(245,230,218,0.6) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.183, y: 0.043, width: 0.63, height: 0.908 },
  },
  {
    id: 'french-elegant',
    name: 'French Élégante',
    image: frenchElegant,
    title: 'French Élégante',
    subtitle: 'Un nude doux prolongé par une pointe blanche nette et intemporelle.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(245,225,218,0.52) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.207, y: 0.08, width: 0.581, height: 0.837 },
  },
  {
    id: 'marble-gold',
    name: 'Marbre Doré',
    image: marbleGold,
    title: 'Marbre Doré',
    subtitle: 'Des veines minérales et des éclats d\'or sur une base blanche lumineuse.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(228,218,198,0.5) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.226, y: 0.054, width: 0.554, height: 0.887 },
  },
  {
    id: 'mirror-chrome',
    name: 'Chrome Miroir',
    image: mirrorChrome,
    title: 'Chrome Miroir',
    subtitle: 'Une finition métallique spectaculaire aux reflets parfaitement polis.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(205,210,215,0.48) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.16, y: 0.056, width: 0.68, height: 0.888 },
  },
  {
    id: 'black-ribbons',
    name: 'Rubans Noirs',
    image: blackRibbons,
    title: 'Rubans Noirs',
    subtitle: 'Des courbes graphiques noires et chrome sur un nude délicatement rosé.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(220,210,205,0.45) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.124, y: 0.021, width: 0.757, height: 0.942 },
  },
  {
    id: 'pink-ribbons',
    name: 'Rubans Roses',
    image: pinkRibbons,
    title: 'Rubans Roses',
    subtitle: 'Des arabesques roses et blanches dessinées comme un ruban de lumière.',
    bgTint: 'radial-gradient(ellipse at 65% 45%, rgba(248,190,210,0.4) 0%, rgba(253,251,247,1) 70%)',
    textureCrop: { x: 0.161, y: 0.08, width: 0.681, height: 0.818 },
  },
];
