import { useScrollReveal } from '../hooks/useAnimations';

export function Footer() {
  useScrollReveal('.footer-reveal');

  return (
    <footer className="relative overflow-hidden bg-brand-chocolate py-14 text-brand-cream md:py-20">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="footer-reveal mb-14 flex flex-col items-center justify-between gap-7 border-b border-brand-cream/10 pb-12 text-center md:flex-row md:text-left">
          <p className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">Une idée en tête ? Faisons-en votre <em className="font-normal text-brand-gold">prochaine signature.</em></p>
          <a href="#contact" className="premium-button shrink-0 rounded-full bg-brand-cream px-8 py-4 text-sm font-semibold text-brand-chocolate">Demander un rendez-vous</a>
        </div>

        <div className="footer-reveal grid grid-cols-1 items-center gap-10 text-center md:grid-cols-3 md:items-start md:gap-8 md:text-left">
          
          <div>
            <span className="text-2xl font-serif font-semibold tracking-wide block mb-3 md:mb-4 hover:text-brand-gold transition-colors duration-300">
              L'Atelier des Ongles
            </span>
            <p className="text-brand-cream/60 text-sm">
              Manucures précises, créations personnelles et finitions pensées pour durer.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <h4 className="mb-3 font-serif text-lg text-brand-gold">Explorer</h4>
            <a href="#services" className="text-brand-cream/60 hover:text-brand-cream hover:translate-x-1 transition-all text-sm w-max mx-auto md:mx-0 inline-block relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-cream transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#gallery" className="text-brand-cream/60 hover:text-brand-cream hover:translate-x-1 transition-all text-sm w-max mx-auto md:mx-0 inline-block relative group">
              Galerie
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-cream transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-brand-cream/60 hover:text-brand-cream hover:translate-x-1 transition-all text-sm w-max mx-auto md:mx-0 inline-block relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-cream transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          
          <div className="flex flex-col space-y-3">
            <h4 className="mb-3 font-serif text-lg text-brand-gold">Votre rendez-vous</h4>
            <span className="text-sm text-brand-cream/60">Accueil sur rendez-vous</span>
            <span className="text-sm text-brand-cream/60">Réponse sous 24 à 48 h</span>
            <a href="#contact" className="mx-auto inline-block w-max text-sm text-brand-cream/60 transition-all hover:translate-x-1 hover:text-brand-cream md:mx-0">Poser une question</a>
          </div>
          
        </div>
        
        <div className="footer-reveal mt-16 pt-8 border-t border-brand-cream/20 text-center text-brand-cream/40 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} L'Atelier des Ongles. Tous droits réservés.</p>
          <p className="text-xs opacity-60">Pensé avec soin, jusque dans les détails.</p>
        </div>
      </div>
    </footer>
  );
}
