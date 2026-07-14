import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Projects from './components/Projects';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [siteReady, setSiteReady] = useState(false);

  useEffect(() => {
    if (!siteReady) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => ScrollTrigger.update());

    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, [siteReady]);

  return (
    <>
      {/* Cinematic Loading intro */}
      <LoadingScreen onComplete={() => setSiteReady(true)} />

      {/* Main site — fades in after loading screen exits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: siteReady ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="custom-cursor-hide bg-[#050505] min-h-screen overflow-x-hidden relative"
      >
        {/* Persistent mesh gradient background */}
        <div className="mesh-gradient-bg fixed inset-0 opacity-[0.35] pointer-events-none z-0" />

        <CustomCursor />
        <Navbar />

        <main className="relative z-10">
          {/* Pass siteReady as "started" so Hero's own animations sequence correctly */}
          <Hero started={siteReady} />

          <div className="divider-wipe" />
          <Expertise />

          <div className="divider-wipe" />
          <Projects />

          <div className="divider-wipe" />
          <WhyChooseUs />

          <div className="divider-wipe" />
          <Process />

          <div className="divider-wipe" />
          <Testimonials />

          <div className="divider-wipe" />
          <Team />

          <div className="divider-wipe" />
          <Contact />
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
