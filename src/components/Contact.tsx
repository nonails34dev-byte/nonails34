import { Check, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useAnimations';
import { siteImages } from '../data/siteImages';

export function Contact() {
  useScrollReveal('.contact-reveal');
  useStaggerReveal('.contact-info-list', '.contact-info-item');
  useStaggerReveal('.contact-form-stagger', '.form-field-reveal', 0.1);

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-brand-cream to-brand-nude/35 py-24 md:py-36">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-chocolate/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          
          <div className="relative z-10">
            <div className="contact-reveal editorial-kicker mb-6">Contact & réservation</div>
            
            <h2 className="contact-reveal text-4xl md:text-5xl lg:text-6xl font-serif text-brand-chocolate mb-6 md:mb-8 leading-[1.1]">
              Votre prochaine manucure <em className="font-normal text-brand-burgundy">commence ici.</em>
            </h2>
            <p className="contact-reveal text-brand-chocolate/70 text-lg mb-10 md:mb-12 leading-relaxed max-w-md">
              Parlez-moi de vos envies, de la longueur souhaitée et de l’état actuel de vos ongles. Je vous répondrai avec la prestation et le créneau les plus adaptés.
            </p>

            <div className="contact-reveal group relative mb-10 aspect-[4/3] max-w-xl overflow-hidden rounded-[2rem] shadow-xl md:mb-12">
              <img
                src={siteImages.manicureSession}
                alt="Une prestation réalisée avec précision à L'Atelier"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-chocolate/30 to-transparent" />
            </div>
            
            <div className="contact-info-list mb-12 space-y-7">
              <div className="contact-info-item flex items-start group">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-300 mt-1">
                  <MapPin size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-brand-chocolate font-serif text-xl mb-1 group-hover:text-brand-gold transition-colors">L'Atelier</p>
                  <p className="text-brand-chocolate/60 leading-relaxed group-hover:text-brand-chocolate/80 transition-colors">123 Avenue de la Beauté<br/>75000 Paris</p>
                </div>
              </div>
              
              <div className="contact-info-item flex items-start group">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-300 mt-1">
                  <Phone size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-brand-chocolate font-serif text-xl mb-1 group-hover:text-brand-gold transition-colors">Téléphone</p>
                  <p className="text-brand-chocolate/60 leading-relaxed group-hover:text-brand-chocolate/80 transition-colors">06 12 34 56 78</p>
                </div>
              </div>
              
              <div className="contact-info-item flex items-start group">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-300 mt-1">
                  <Mail size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-brand-chocolate font-serif text-xl mb-1 group-hover:text-brand-gold transition-colors">Email</p>
                  <p className="text-brand-chocolate/60 leading-relaxed group-hover:text-brand-chocolate/80 transition-colors">contact@latelierdesongles.fr</p>
                </div>
              </div>
            </div>
            
            <div className="contact-reveal flex items-center gap-5 rounded-[1.5rem] border border-white/50 bg-white/35 p-5 backdrop-blur-sm">
              <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-nude/40 bg-white text-brand-chocolate shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Suivre l'atelier</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-chocolate/60">Nouvelles poses, inspirations et disponibilités en story.</p>
              </div>
            </div>
          </div>
          
          <div className="relative contact-reveal">
            {/* Background glow for form */}
            <div className="absolute inset-0 bg-brand-cream/50 blur-2xl rounded-[2.5rem] -z-10" />
            
            <div className="luxury-card rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl transition-shadow duration-500 md:rounded-[2.5rem] md:p-10">
              <div className="mb-8 flex items-start justify-between gap-5">
                <div>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">Votre projet</p>
                  <h3 className="font-serif text-2xl text-brand-chocolate md:text-3xl">Parlez-moi de votre envie.</h3>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blush text-brand-burgundy"><Send className="h-4 w-4" /></span>
              </div>
              
              <form className="contact-form-stagger space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="form-field-reveal space-y-2 group">
                    <label htmlFor="name" className="block text-xs font-medium tracking-widest uppercase text-brand-chocolate/50 pl-2 group-focus-within:text-brand-gold transition-colors">Nom</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      autoComplete="name"
                      required
                      className="w-full bg-brand-cream/50 border border-brand-nude/50 rounded-2xl px-5 py-4 text-brand-chocolate focus:bg-white focus:border-brand-gold/50 focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all" 
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="form-field-reveal space-y-2 group">
                    <label htmlFor="phone" className="block text-xs font-medium tracking-widest uppercase text-brand-chocolate/50 pl-2 group-focus-within:text-brand-gold transition-colors">Téléphone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      autoComplete="tel"
                      required
                      className="w-full bg-brand-cream/50 border border-brand-nude/50 rounded-2xl px-5 py-4 text-brand-chocolate focus:bg-white focus:border-brand-gold/50 focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all" 
                      placeholder="Votre numéro"
                    />
                  </div>
                </div>
                
                <div className="form-field-reveal space-y-2 group">
                  <label htmlFor="service" className="block text-xs font-medium tracking-widest uppercase text-brand-chocolate/50 pl-2 group-focus-within:text-brand-gold transition-colors">Prestation souhaitée</label>
                  <select 
                    id="service" 
                    name="service"
                    defaultValue=""
                    required
                    className="w-full bg-brand-cream/50 border border-brand-nude/50 rounded-2xl px-5 py-4 text-brand-chocolate focus:bg-white focus:border-brand-gold/50 focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Sélectionner une prestation</option>
                    <option>Pose complète</option>
                    <option>Remplissage</option>
                    <option>Gainage</option>
                    <option>Dépose</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                
                <div className="form-field-reveal space-y-2 group">
                  <label htmlFor="message" className="block text-xs font-medium tracking-widest uppercase text-brand-chocolate/50 pl-2 group-focus-within:text-brand-gold transition-colors">Message (optionnel)</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={4}
                    className="w-full bg-brand-cream/50 border border-brand-nude/50 rounded-2xl px-5 py-4 text-brand-chocolate focus:bg-white focus:border-brand-gold/50 focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all resize-none" 
                    placeholder="Un détail à préciser pour votre rendez-vous ?"
                  ></textarea>
                </div>
                
                <div className="form-field-reveal">
                  <button 
                    type="button" 
                    className="premium-button mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-burgundy px-5 py-5 font-medium text-brand-cream transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(104,38,58,0.25)] active:translate-y-0"
                  >
                    <Send size={18} />
                    Envoyer la demande
                  </button>
                </div>
              </form>
              <div className="mt-6 grid gap-3 border-t border-brand-nude/25 pt-6 text-xs text-brand-chocolate/55 sm:grid-cols-2">
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-gold" /> Réponse sous 24 à 48 h</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-gold" /> Tarif confirmé avant le rendez-vous</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
