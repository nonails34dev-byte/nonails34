import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useScrollReveal(selector: string, delay: number = 0) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));

    if (reduceMotion()) {
      gsap.set(elements, { y: 0, opacity: 1 });
      return;
    }

    const tweens = elements.map((element) => gsap.fromTo(
      element,
      { y: 42, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      },
    ));

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [selector, delay]);
}

export function useStaggerReveal(
  containerSelector: string,
  itemSelector: string,
  staggerTime: number = 0.12,
) {
  useEffect(() => {
    const containers = Array.from(document.querySelectorAll(containerSelector));

    if (reduceMotion()) {
      containers.forEach((container) => gsap.set(container.querySelectorAll(itemSelector), { y: 0, opacity: 1 }));
      return;
    }

    const tweens = containers.map((container) => gsap.fromTo(
      container.querySelectorAll(itemSelector),
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: staggerTime,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      },
    ));

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [containerSelector, itemSelector, staggerTime]);
}

export function useMagnetic(selector: string) {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduceMotion()) return;

    const cleanups = Array.from(document.querySelectorAll(selector)).map((node) => {
      const element = node as HTMLElement;
      const onMouseMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        gsap.to(element, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.22,
          y: (event.clientY - rect.top - rect.height / 2) * 0.22,
          duration: 0.5,
          ease: 'power3.out',
        });
      };
      const onMouseLeave = () => gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.35)',
      });

      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('mouseleave', onMouseLeave);
      return () => {
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseleave', onMouseLeave);
        gsap.killTweensOf(element);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [selector]);
}

export function useParallax(selector: string, speed: number = 0.5) {
  useEffect(() => {
    const images = Array.from(document.querySelectorAll(selector));
    if (reduceMotion()) return;

    const tweens = images.map((image) => gsap.to(image, {
      yPercent: speed * 50,
      ease: 'none',
      scrollTrigger: {
        trigger: image.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }));

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [selector, speed]);
}
