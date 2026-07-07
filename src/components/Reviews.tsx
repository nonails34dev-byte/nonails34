import { reviews } from '../data/reviews';
import { Star, Quote } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useAnimations';

export function Reviews() {
  useScrollReveal('.reviews-reveal');
  useStaggerReveal('.reviews-grid', '.review-card');

  return (
    <section id="reviews" className="relative overflow-hidden bg-brand-chocolate py-24 text-brand-cream md:py-36">
      <div className="section-orbit absolute -right-24 -top-24 h-80 w-80 rounded-full border-brand-gold/10" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reviews-reveal text-center mb-16 md:mb-20">
          <div className="editorial-kicker editorial-kicker-light mb-6">Paroles de clientes</div>
          <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-brand-cream md:text-6xl">Elles en parlent <em className="font-normal text-brand-gold">le mieux.</em></h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-1 text-brand-gold">{[...Array(5)].map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
            <span className="h-4 w-px bg-brand-cream/20" />
            <p className="text-sm text-brand-cream/60"><strong className="text-brand-cream">5,0</strong> — une expérience aussi soignée que le résultat</p>
          </div>
        </div>

        <div className="reviews-grid grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="review-card group relative mt-6 rounded-[2rem] border border-brand-cream/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-gold/25 hover:bg-white/10 md:p-10"
            >
              <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full border-4 border-brand-chocolate bg-brand-burgundy shadow-sm transition-colors duration-500 group-hover:bg-brand-gold">
                <Quote size={20} className="text-brand-cream" />
              </div>
              
              <div className="flex space-x-1 mb-6 mt-4 text-brand-gold">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              
              <p className="relative z-10 mb-8 font-serif text-lg leading-relaxed text-brand-cream/80 md:text-xl">
                "{review.text}"
              </p>
              
              <div className="border-t border-brand-cream/10 pt-6">
                <p className="mb-1 font-serif text-lg text-brand-cream">{review.name}</p>
                <p className="text-xs text-brand-gold tracking-wider uppercase font-medium">{review.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
