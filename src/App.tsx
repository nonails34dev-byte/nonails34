import { Header } from './components/Header';
import { ScrollNailHero } from './components/ScrollNailHero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Pricing } from './components/Pricing';
import { Reviews } from './components/Reviews';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';

function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <div className="min-h-screen bg-brand-cream relative">
        <Header />
        
        <main>
          <ScrollNailHero />
          <About />
          <Services />
          <Gallery />
          <Pricing />
          <Reviews />
          <Contact />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
