import { ArrowUpRight, Gem, ShieldCheck, WandSparkles } from 'lucide-react';
import { useScrollReveal, useStaggerReveal, useParallax } from '../hooks/useAnimations';
import { siteImages } from '../data/siteImages';

export function About() {
  const features = [
    { 
      icon: <Gem className="h-5 w-5 text-brand-gold" />,
      title: 'Architecture précise',
      desc: 'Une forme équilibrée, pensée pour votre main et votre quotidien.'
    },
    { 
      icon: <WandSparkles className="h-5 w-5 text-brand-gold" />,
      title: 'Création personnelle',
      desc: 'Couleurs, lignes et finitions composées avec vous, jamais copiées-collées.'
    },
    { 
      icon: <ShieldCheck className="h-5 w-5 text-brand-gold" />,
      title: 'Protocole exigeant',
      desc: 'Préparation soignée, produits professionnels et respect de l’ongle naturel.'
    }
  ];

  // Initialize animations
  useScrollReveal('.about-reveal');
  useStaggerReveal('.about-features-container', '.about-feature-item');
  useParallax('.about-parallax-img', 0.15);

  return (
    <section id="about" className="relative overflow-hidden bg-brand-blush/35 py-24 md:py-36">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-cream/50 blur-3xl -z-10 rounded-full translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="order-2 lg:order-1 relative z-10">
            <div className="about-reveal editorial-kicker mb-6">La signature de l'atelier</div>
            
            <h2 className="about-reveal text-4xl md:text-5xl lg:text-6xl font-serif text-brand-chocolate mb-8 leading-[1.1]">
              Plus qu'une manucure, <em className="font-normal text-brand-burgundy">un geste sur mesure.</em>
            </h2>
            
            <p className="about-reveal text-lg text-brand-chocolate/70 mb-6 leading-relaxed">
              Ici, rien n'est standardisé. J'observe vos mains, j'écoute vos envies et je construis une pose qui vous ressemble — jusque dans le choix de la courbe, de la teinte et de la lumière.
            </p>
            <p className="about-reveal text-lg text-brand-chocolate/70 mb-12 leading-relaxed">
              Du nude presque imperceptible au nail art graphique, chaque rendez-vous associe maîtrise technique, sens du détail et cette élégance qui se remarque sans jamais en faire trop.
            </p>
            
            <div className="about-features-container space-y-8">
              {features.map((item, index) => (
                <div key={index} className="about-feature-item flex items-start group">
                  <div className="flex-shrink-0 mt-1 p-3 rounded-full bg-white/50 border border-brand-gold/20 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="ml-5">
                    <h4 className="text-xl font-serif text-brand-chocolate mb-1">{item.title}</h4>
                    <p className="text-brand-chocolate/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#services" className="about-reveal group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-brand-burgundy">
              Découvrir mon approche
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-burgundy/20 transition-all group-hover:rotate-45 group-hover:bg-brand-burgundy group-hover:text-brand-cream">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </div>
          
          <div className="order-1 lg:order-2 relative px-4 sm:px-0 about-reveal">
            {/* Main Image Frame */}
            <div className="luxury-card aspect-[4/5] overflow-hidden rounded-[2rem] relative z-20 transform hover:-translate-y-2 transition-all duration-700">
              <div className="absolute inset-0 bg-brand-chocolate/10 mix-blend-overlay z-10 pointer-events-none" />
              <div className="w-full h-[120%] -top-[10%] relative overflow-hidden rounded-[2rem]">
                <img 
                  src={siteImages.editorialHands}
                  alt="Mains et manucure nude dans l'univers de L'Atelier"
                  className="about-parallax-img absolute inset-0 w-full h-full object-cover origin-center"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Offset Decorative Border */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-brand-gold/40 rounded-[2rem] z-10 hidden sm:block pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-3/4 h-3/4 bg-brand-nude/30 rounded-[2rem] -z-10 blur-xl" />
            <div className="absolute -bottom-5 left-8 z-30 rounded-full border border-white/60 bg-brand-cream/85 px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-chocolate shadow-lg backdrop-blur-md">
              Précision • Création • Tenue
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
