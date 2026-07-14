import { useCallback, useEffect, useState } from 'react';
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

  const handleLoadComplete = useCallback(() => setSiteReady(true), []);

  useEffect(() => {
    if (!siteReady) return;

    // Stop the browser from restoring a previous scroll position (this is
    // what was causing the page to land a little below the top / "auto
    // scroll down" right after the loader finished).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => ScrollTrigger.update());

    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // The loader is `position: fixed`, so while it's on screen the sections
    // behind it (video, fonts, the 600vh Expertise track, etc.) are still
    // settling their final layout. Lenis + ScrollTrigger can end up caching
    // those in-progress measurements. Forcing a hard scroll-to-0 and a
    // ScrollTrigger.refresh() on the next frame makes sure both start from
    // the final, fully-rendered page height instead of a stale one.
    requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, [siteReady]);

  return (
    <>
      {/* Cinematic Loading intro */}
      <LoadingScreen onComplete={handleLoadComplete} />

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