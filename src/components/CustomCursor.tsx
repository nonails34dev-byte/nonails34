import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (!cursorRef.current || ('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    // Center the dot by adjusting x/y based on its size (8px / 2 = 4px)
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const addHover = () => {
      gsap.to(cursorRef.current, {
        scale: 6,
        backgroundColor: 'rgba(208, 167, 81, 0.15)', // Updated brand gold with opacity
        border: '0.5px solid rgba(208, 167, 81, 0.4)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const removeHover = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        backgroundColor: '#D0A751', // Updated brand gold
        border: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Attach hover effects to all links and buttons dynamically
    const attachHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .magnetic-btn, .magnetic-link');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };

    // Run once on mount
    attachHoverEvents();

    // Use a mutation observer to attach to newly added elements (if any)
    const observer = new MutationObserver(() => {
      attachHoverEvents();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .magnetic-btn, .magnetic-link');
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-2 h-2 bg-brand-gold rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
      }}
    />
  );
}
