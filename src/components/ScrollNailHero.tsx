import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NailScene } from './NailScene';
import { nailDesigns } from '../data/nailDesigns';

gsap.registerPlugin(ScrollTrigger);

type ScrollNailWindow = Window & {
  __updateNail?: (progress: number) => void;
};

export function ScrollNailHero() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const desktopPanelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobilePanelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !bgRef.current) return;

    const context = gsap.context(() => {
      const updatePanels = (
        panels: Array<HTMLDivElement | null>,
        journey: number,
        travel: number,
      ) => {
        panels.forEach((panel, index) => {
          if (!panel) return;
          const distance = Math.abs(journey - index);
          const opacity = gsap.utils.clamp(0, 1, 1 - distance * 2.15);
          gsap.set(panel, {
            opacity,
            y: (index - journey) * travel,
            visibility: opacity > 0.015 ? 'visible' : 'hidden',
          });
        });
      };

      const updateScene = (
        progress: number,
        panels: Array<HTMLDivElement | null>,
        travel: number,
      ) => {
        const journey = progress * (nailDesigns.length - 1);
        const activeIndex = Math.min(
          nailDesigns.length - 1,
          Math.max(0, Math.round(journey)),
        );

        (window as ScrollNailWindow).__updateNail?.(progress);
        updatePanels(panels, journey, travel);

        if (activeIndex !== activeIndexRef.current) {
          activeIndexRef.current = activeIndex;
          if (bgRef.current) {
            bgRef.current.style.background = nailDesigns[activeIndex].bgTint;
          }

          dotRefs.current.forEach((dot, index) => {
            dot?.classList.toggle('is-active', index === activeIndex);
          });
        }
      };

      const media = gsap.matchMedia();

      media.add('(min-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${(nailDesigns.length - 1) * 100}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => updateScene(progress, desktopPanelRefs.current, 34),
        });
      });

      media.add('(max-width: 767px)', () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${(nailDesigns.length - 1) * 100}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.38,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => updateScene(progress, mobilePanelRefs.current, 48),
        });
      });

      return () => media.revert();
    }, containerRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} id="home" className="nail-hero relative h-[100svh] w-full md:h-screen">
      <div className="nail-hero-stage relative h-[100svh] w-full overflow-hidden md:h-full">
        <div
          ref={bgRef}
          className="absolute inset-0 transition-[background] duration-700 ease-out"
          style={{ background: nailDesigns[0].bgTint }}
        />

        <div className="nail-hero-aura absolute z-[1] rounded-[50%]" />

        <div
          className="nail-canvas-shell absolute inset-0 z-10 md:inset-y-0 md:left-auto md:right-0 md:w-[60%]"
          data-testid="nail-hero-canvas"
        >
          <Canvas
            camera={{ position: [0, 0, 5.35], fov: 32 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            shadows
          >
            <Suspense fallback={null}>
              <NailScene />
            </Suspense>
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 md:hidden">
          {nailDesigns.map((design, index) => (
            <div
              key={design.id}
              ref={(node) => { mobilePanelRefs.current[index] = node; }}
              className="mobile-nail-panel absolute inset-0 px-5"
              style={{
                opacity: index === 0 ? 1 : 0,
                visibility: index === 0 ? 'visible' : 'hidden',
              }}
            >
              <div className="mobile-nail-copy">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-9 bg-brand-gold/90" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                    {index === 0
                      ? 'Créations sur mesure'
                      : `${String(index + 1).padStart(2, '0')} — ${String(nailDesigns.length).padStart(2, '0')}`}
                  </span>
                </div>

                {index === 0 ? (
                  <h1 className="max-w-[9.5ch] text-[clamp(2.55rem,11.2vw,3.65rem)] leading-[0.94] tracking-[-0.035em] text-brand-chocolate">
                    L'élégance au bout des doigts.
                  </h1>
                ) : (
                  <>
                    <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-chocolate/45">
                      Design signature
                    </p>
                    <h2 className="max-w-[10ch] text-[clamp(2.45rem,10.5vw,3.45rem)] leading-[0.96] tracking-[-0.03em] text-brand-chocolate">
                      {design.title}
                    </h2>
                  </>
                )}
              </div>

              <div className="mobile-nail-footer">
                <p className="max-w-[31rem] text-sm leading-relaxed text-brand-chocolate/65">
                  {index === 0
                    ? 'Une manucure pensée comme un bijou : précise, personnelle et faite pour durer.'
                    : design.subtitle}
                </p>

                {index === 0 && (
                  <div className="pointer-events-auto mt-4 flex items-center gap-4">
                    <a
                      href="#contact"
                      className="premium-button flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand-burgundy px-5 text-sm font-medium text-brand-cream shadow-[0_12px_30px_rgba(104,38,58,0.2)] transition active:scale-[0.98]"
                    >
                      Réserver
                    </a>
                    <a
                      href="#gallery"
                      className="flex min-h-12 items-center justify-center px-1 text-sm font-medium text-brand-chocolate underline decoration-brand-gold/60 underline-offset-4"
                    >
                      Voir la galerie
                    </a>
                  </div>
                )}

                {index === nailDesigns.length - 1 && (
                  <a
                    href="#contact"
                    className="premium-button pointer-events-auto mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-brand-burgundy px-6 text-sm font-medium text-brand-cream shadow-[0_12px_30px_rgba(104,38,58,0.2)] transition active:scale-[0.98]"
                  >
                    Réserver mon moment beauté
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 hidden items-center md:flex">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            {nailDesigns.map((design, index) => (
              <div
                key={design.id}
                ref={(node) => { desktopPanelRefs.current[index] = node; }}
                className="nail-copy-panel absolute left-5 top-1/2 max-w-lg -translate-y-1/2 sm:left-8 lg:left-10"
                style={{ opacity: index === 0 ? 1 : 0, visibility: index === 0 ? 'visible' : 'hidden' }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-11 bg-brand-gold/80" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                    {index === 0 ? 'Créations sur mesure' : `${String(index + 1).padStart(2, '0')} / ${String(nailDesigns.length).padStart(2, '0')}`}
                  </span>
                </div>

                {index === 0 ? (
                  <>
                    <h1 className="mb-6 text-5xl leading-[1.04] text-brand-chocolate md:text-7xl">
                      L'élégance au<br />bout des doigts.
                    </h1>
                    <p className="mb-9 max-w-md text-lg leading-relaxed text-brand-chocolate/65 md:text-xl">
                      Une manucure pensée comme un bijou : précise, personnelle et faite pour durer.
                    </p>
                    <div className="pointer-events-auto flex flex-wrap gap-3">
                      <a href="#contact" className="premium-button rounded-full bg-brand-burgundy px-8 py-4 font-medium text-brand-cream shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                        Réserver un rendez-vous
                      </a>
                      <a href="#gallery" className="rounded-full border border-brand-chocolate/15 bg-white/65 px-8 py-4 font-medium text-brand-chocolate backdrop-blur-md transition hover:bg-white">
                        Voir les réalisations
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-chocolate/45">
                      Design signature
                    </p>
                    <h2 className="mb-5 text-5xl leading-[1.04] text-brand-chocolate md:text-6xl">
                      {design.title}
                    </h2>
                    <p className="max-w-md text-lg leading-relaxed text-brand-chocolate/65 md:text-xl">
                      {design.subtitle}
                    </p>
                    {index === nailDesigns.length - 1 && (
                      <a href="#contact" className="premium-button pointer-events-auto mt-8 inline-block rounded-full bg-brand-burgundy px-9 py-4 font-medium text-brand-cream shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                        Réserver mon moment beauté
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="nail-scroll-cue absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 text-center md:block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-chocolate/45">Scrollez pour tourner</span>
          <div className="mx-auto flex h-9 w-6 justify-center rounded-full border border-brand-chocolate/25 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-chocolate/45" />
          </div>
        </div>

        <div className="nail-progress-rail absolute right-3.5 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 sm:right-8" aria-hidden="true">
          {nailDesigns.map((design, index) => (
            <div
              key={design.id}
              ref={(node) => { dotRefs.current[index] = node; }}
              className={`nail-progress-dot${index === 0 ? ' is-active' : ''}`}
            />
          ))}
        </div>

        <div className="mobile-scroll-hint pointer-events-none absolute bottom-[8.6rem] right-3.5 z-30 flex items-center gap-2 md:hidden" aria-hidden="true">
          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-brand-chocolate/40 [writing-mode:vertical-rl]">Défiler</span>
          <span className="h-8 w-px bg-brand-chocolate/20" />
        </div>
      </div>
    </section>
  );
}
