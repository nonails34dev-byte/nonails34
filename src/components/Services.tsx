import { ArrowRight, Sparkles, HeartHandshake, Scissors, Palette, Droplet, Star } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useAnimations';
import { siteImages } from '../data/siteImages';

// Move data here to add JSX icons, or keep it in data file and map icons. Let's just define the enhanced data here for ease.
const services = [
  {
    id: 'pose-complete',
    title: 'Pose complète',
    description: 'Une construction complète, équilibrée selon votre main, avec la forme et la couleur de votre choix.',
    price: 'Dès 65 €',
    icon: <Sparkles className="w-6 h-6 text-brand-gold" />
  },
  {
    id: 'remplissage',
    title: 'Remplissage',
    description: 'L’entretien essentiel pour rééquilibrer la structure et retrouver une finition impeccable.',
    price: 'Dès 45 €',
    icon: <HeartHandshake className="w-6 h-6 text-brand-gold" />
  },
  {
    id: 'gainage',
    title: 'Gainage',
    description: 'Un renfort fin sur ongles naturels pour gagner en solidité sans perdre en élégance.',
    price: 'Dès 40 €',
    icon: <Star className="w-6 h-6 text-brand-gold" />
  },
  {
    id: 'nail-art',
    title: 'Nail art',
    description: 'Une composition à votre image : lignes fines, chrome, matière, détails peints ou bijoux.',
    price: 'Sur devis',
    icon: <Palette className="w-6 h-6 text-brand-gold" />
  },
  {
    id: 'french-babyboomer',
    title: 'French / Baby boomer',
    description: 'Deux signatures lumineuses, tracées avec précision et adaptées à votre carnation.',
    price: '+ 10 €',
    icon: <Droplet className="w-6 h-6 text-brand-gold" />
  },
  {
    id: 'depose',
    title: 'Dépose',
    description: 'Un retrait maîtrisé, suivi d’une remise en forme et d’un soin de l’ongle naturel.',
    price: '25 €',
    icon: <Scissors className="w-6 h-6 text-brand-gold" />
  }
];

export function Services() {
  useScrollReveal('.service-reveal');
  useStaggerReveal('.services-grid', '.service-card');

  return (
    <section id="services" className="relative bg-brand-cream py-24 md:py-36">
      {/* Decorative background elements */}
      <div className="absolute top-40 left-0 w-64 h-64 bg-brand-blush/40 blur-3xl rounded-full -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-brand-nude/30 blur-3xl rounded-full translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="service-reveal mb-16 grid items-end gap-7 md:mb-20 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
          <div>
            <div className="editorial-kicker mb-6">La carte des prestations</div>
            <h2 className="max-w-[14ch] font-serif text-4xl leading-[1.06] text-brand-chocolate md:text-6xl">
              Le bon protocole, pour vos ongles <em className="font-normal text-brand-burgundy">et votre rythme.</em>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-brand-chocolate/65 md:text-lg">
            Chaque rendez-vous commence par un échange. Ensemble, nous choisissons la technique juste selon vos ongles, votre style et le temps que vous souhaitez leur consacrer.
          </p>
        </div>

        <div className="service-reveal group relative mb-10 overflow-hidden rounded-[2rem] md:mb-14 md:rounded-[2.5rem]">
          <img
            src={siteImages.studioTools}
            alt="Produits et outils professionnels de l'atelier"
            className="h-56 w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035] md:h-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-chocolate/70 via-brand-chocolate/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-brand-cream md:max-w-xl md:p-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">Le geste & la matière</p>
            <h3 className="max-w-xl text-2xl leading-tight md:text-4xl">Une belle pose commence bien avant la couleur.</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-cream/70 md:text-base">Préparation, architecture, équilibre et finition : chaque étape a sa raison d’être.</p>
          </div>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card luxury-card group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-nude/25 bg-white/70 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-brand-gold/35 md:p-9"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blush/0 to-brand-blush/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <span className="absolute right-7 top-6 font-serif text-4xl text-brand-nude/35 transition-colors group-hover:text-brand-gold/35">{String(index + 1).padStart(2, '0')}</span>
              <div className="relative z-10 mb-6">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-cream shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-gold/10 md:mb-8 md:h-14 md:w-14">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-serif text-brand-chocolate mb-4 group-hover:text-brand-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-brand-chocolate/60 leading-relaxed min-h-[4rem] group-hover:text-brand-chocolate/80 transition-colors">
                  {service.description}
                </p>
              </div>
              
              <div className="relative z-10 mt-auto pt-6 border-t border-brand-nude/30 flex items-center justify-between">
                <span className="text-sm text-brand-chocolate/40 uppercase tracking-widest font-medium group-hover:text-brand-gold/60 transition-colors">Tarif</span>
                <span className="text-brand-chocolate font-medium tracking-wide text-lg">{service.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="service-reveal mt-12 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-brand-burgundy px-7 py-7 text-brand-cream sm:flex-row sm:items-center md:px-10">
          <div>
            <p className="font-serif text-xl md:text-2xl">Vous hésitez entre deux prestations ?</p>
            <p className="mt-1 text-sm text-brand-cream/65">Décrivez-moi vos ongles et votre envie, je vous guiderai vers le bon choix.</p>
          </div>
          <a href="#contact" className="premium-button inline-flex shrink-0 items-center gap-3 rounded-full bg-brand-cream px-6 py-3 text-sm font-semibold text-brand-burgundy">
            Être conseillée <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
