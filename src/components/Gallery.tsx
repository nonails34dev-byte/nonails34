import { useState, useEffect } from 'react';
import { gallery, galleryCategories } from '../data/gallery';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useScrollReveal, useStaggerReveal, useMagnetic } from '../hooks/useAnimations';
import gsap from 'gsap';

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredGallery = activeCategory === 'Tous' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  useScrollReveal('.gallery-reveal');
  useStaggerReveal('.gallery-grid', '.gallery-item');
  useMagnetic('.magnetic-btn');

  // Add subtle re-animation when category changes
  useEffect(() => {
    gsap.fromTo('.gallery-item', 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' }
    );
  }, [activeCategory]);

  useEffect(() => {
    if (selectedId === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedId]);

  const selectedIndex = filteredGallery.findIndex((item) => item.id === selectedId);
  const selectedItem = selectedIndex >= 0 ? filteredGallery[selectedIndex] : null;

  const showRelativeItem = (direction: number) => {
    if (selectedIndex < 0) return;
    const nextIndex = (selectedIndex + direction + filteredGallery.length) % filteredGallery.length;
    setSelectedId(filteredGallery[nextIndex].id);
  };

  return (
    <section id="gallery" className="relative bg-brand-blush/20 py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gallery-reveal mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="editorial-kicker mb-6">Le carnet de créations</div>
          <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-brand-chocolate md:text-6xl">Des détails qui <em className="font-normal text-brand-burgundy">changent tout.</em></h2>
          <p className="text-base leading-relaxed text-brand-chocolate/60 md:text-lg">
            French dessinée au millimètre, reflets miroir ou lignes libres : explorez les univers qui peuvent inspirer votre prochain rendez-vous.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="gallery-reveal -mx-4 mb-10 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 md:mb-16">
          {galleryCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={cn(
                "magnetic-btn shrink-0 snap-start rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300",
                activeCategory === category 
                  ? "border-brand-burgundy bg-brand-burgundy text-brand-cream shadow-md" 
                  : "border-brand-nude/35 bg-white/70 text-brand-chocolate hover:border-brand-gold/40 hover:bg-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Masonry style */}
        <div className="gallery-grid columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-8 space-y-4 sm:space-y-8">
          {filteredGallery.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              aria-label={`Agrandir : ${item.alt}`}
              className="gallery-item luxury-card group relative w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-[1.5rem] text-left transition-all duration-500 hover:-translate-y-1"
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                loading="lazy"
              />
              <div className="gallery-item-caption absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-chocolate/90 via-brand-chocolate/20 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-end">
                  <div>
                    <span className="block text-brand-gold text-xs font-medium tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.category}
                    </span>
                    <span className="block text-white font-serif text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      {item.alt}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 group-hover:bg-white/30 hover:scale-110">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-chocolate/90 p-4 backdrop-blur-xl md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.alt}
          onClick={(event) => {
            if (event.currentTarget === event.target) setSelectedId(null);
          }}
        >
          <button type="button" onClick={() => setSelectedId(null)} className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-brand-chocolate md:right-8 md:top-8" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => showRelativeItem(-1)} className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-brand-chocolate md:left-8" aria-label="Création précédente">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <figure className="flex max-h-[88svh] max-w-5xl flex-col items-center">
            <img src={selectedItem.src} alt={selectedItem.alt} className="max-h-[76svh] max-w-full rounded-[1.5rem] object-contain shadow-2xl" />
            <figcaption className="mt-5 text-center">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">{selectedItem.category}</span>
              <p className="mt-1 font-serif text-xl text-white">{selectedItem.alt}</p>
            </figcaption>
          </figure>
          <button type="button" onClick={() => showRelativeItem(1)} className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-brand-chocolate md:right-8" aria-label="Création suivante">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
