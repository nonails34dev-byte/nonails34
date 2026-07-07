import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMagnetic } from '../hooks/useAnimations';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const links = [
    { name: 'Accueil', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Galerie', href: '#gallery' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Avis', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  useMagnetic('.magnetic-link');

  // Handle header scroll animations
  useEffect(() => {
    if (!headerRef.current) return;
    
    // Initial entrance animation
    gsap.fromTo(headerRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );

    let lastScrollY = window.scrollY;
    
    const onScroll = () => {
      // Don't hide header if mobile menu is open
      if (isMobileMenuOpen) return;
      
      const currentScrollY = window.scrollY;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, currentScrollY / scrollable)})`;
      }
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          gsap.to(headerRef.current, { y: '-100%', duration: 0.5, ease: 'power3.out' });
        } else {
          // Scrolling up
          gsap.to(headerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out', background: 'rgba(250, 248, 245, 0.85)', backdropFilter: 'blur(12px)' });
        }
      } else {
        // Top of page
        gsap.to(headerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out', background: 'transparent', backdropFilter: 'blur(0px)' });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobileMenuOpen]);

  // Handle mobile menu animations
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(150% at calc(100% - 2rem) 2rem)',
        duration: 0.8,
        ease: 'power3.inOut'
      });
      
      gsap.fromTo('.mobile-link',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(0% at calc(100% - 2rem) 2rem)',
        duration: 0.6,
        ease: 'power3.inOut'
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[100] border-b border-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex-shrink-0 flex items-center relative z-50">
            <a href="#home" className="group flex flex-col text-brand-chocolate transition-opacity hover:opacity-70">
              <span className="font-serif text-xl font-semibold tracking-wide md:text-2xl">L'Atelier des Ongles</span>
              <span className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-brand-gold">Studio de manucure</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center relative z-50">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-brand-chocolate hover:text-brand-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a
              href="#contact"
              className="magnetic-link premium-button inline-block rounded-full bg-brand-burgundy px-8 py-3 text-sm font-medium text-brand-cream shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Réserver
            </a>
          </nav>
          
          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-menu-toggle relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`w-6 h-0.5 bg-brand-chocolate transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-brand-chocolate transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-brand-chocolate transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-brand-cream/95 backdrop-blur-xl md:hidden"
        style={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
      >
        <div className="section-orbit absolute -right-24 top-[18%] h-72 w-72 rounded-full" aria-hidden="true" />
        <div className="section-orbit absolute -left-20 bottom-[12%] h-48 w-48 rounded-full" aria-hidden="true" />
        <nav className="relative z-10 flex flex-col items-center space-y-7">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-link font-serif text-3xl text-brand-chocolate transition-colors hover:text-brand-burgundy"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-link premium-button mt-7 rounded-full bg-brand-burgundy px-10 py-4 font-medium text-brand-cream shadow-lg transition-all"
          >
            Réserver un rendez-vous
          </a>
        </nav>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-brand-chocolate/5" aria-hidden="true">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-brand-gold" />
      </div>
    </header>
  );
}
