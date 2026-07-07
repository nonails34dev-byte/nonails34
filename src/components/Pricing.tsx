import { prices } from '../data/prices';
import { useScrollReveal, useStaggerReveal } from '../hooks/useAnimations';
import { Check } from 'lucide-react';

export function Pricing() {
  useScrollReveal('.pricing-reveal');
  useStaggerReveal('.pricing-grid', '.pricing-card');

  return (
    <section id="pricing" className="relative overflow-hidden bg-brand-cream py-24 md:py-36">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blush/30 blur-[100px] -z-10 rounded-full translate-x-1/3" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pricing-reveal text-center mb-16 md:mb-20">
          <div className="editorial-kicker mb-6">La carte</div>
          <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-brand-chocolate md:text-6xl">Une carte claire. <em className="font-normal text-brand-burgundy">Une exigence constante.</em></h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-chocolate/60 md:text-lg">
            Le tarif final dépend de la longueur, de la technique et du niveau de détail. Il est toujours confirmé avec vous avant de commencer.
          </p>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 md:gap-y-12">
          {prices.map((section, idx) => (
            <div 
              key={idx} 
              className={`pricing-card luxury-card
                relative overflow-hidden bg-white/65 backdrop-blur-sm rounded-[2rem] p-7 md:p-10 border border-brand-nude/30
                transition-all duration-500 hover:-translate-y-2 hover:bg-white/90
                ${idx === prices.length - 1 ? 'md:col-span-2 md:w-2/3 md:mx-auto' : ''}
              `}
            >
              <span className="absolute right-7 top-5 font-serif text-5xl text-brand-nude/25">0{idx + 1}</span>
              <h3 className="mb-8 pr-12 font-serif text-2xl text-brand-chocolate md:text-3xl">{section.category}</h3>
              <ul className="space-y-6">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="group cursor-default">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-base font-medium text-brand-chocolate transition-colors duration-300 group-hover:text-brand-burgundy md:text-lg">
                        {item.name}
                      </span>
                      <div className="flex-grow border-b border-dashed border-brand-nude/60 mx-4 opacity-50 relative top-[-6px] group-hover:border-brand-gold/40 transition-colors" />
                      <span className="origin-right whitespace-nowrap text-base font-semibold text-brand-burgundy transition-transform group-hover:scale-105 md:text-lg">
                        {item.price}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pricing-reveal mt-12 grid gap-3 rounded-[1.5rem] border border-brand-gold/20 bg-brand-blush/30 p-6 text-sm text-brand-chocolate/65 sm:grid-cols-3 md:p-7">
          {['Diagnostic et conseil inclus', 'Préparation soignée de l’ongle', 'Tarif validé avant la prestation'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"><Check className="h-3.5 w-3.5" /></span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
