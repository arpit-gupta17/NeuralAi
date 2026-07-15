import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import NeuralField from './components/NeuralField';

const Hero = lazy(() => import('./components/Hero'));
const Expertise = lazy(() => import('./components/Expertise'));
const Projects = lazy(() => import('./components/Projects'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const Process = lazy(() => import('./components/Process'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Team = lazy(() => import('./components/Team'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ScrollStoryEngine = lazy(() => import('./components/ScrollStoryEngine'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [siteReady, setSiteReady] = useState(false);
  // Flips ~300ms after the loader is fully gone — this is the "pause"
  // beat from the brief, then NeuralField's own IntroDriver takes over
  // (pulse forms → camera pulls back → settles into the ambient loop).
  const [neuralPlay, setNeuralPlay] = useState(false);

  const handleLoadComplete = useCallback(() => setSiteReady(true), []);

  useEffect(() => {
    if (!siteReady) return;

    const pulseTimer = window.setTimeout(() => setNeuralPlay(true), 300);

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

    // Lazy sections mount just after the shell. A form field in a later
    // section can request focus during that phase and pull the viewport down.
    // Reassert the landing position after all deferred content has settled.
    const settleAtHero = window.setTimeout(() => lenis.scrollTo(0, { immediate: true }), 900);

    return () => {
      window.clearTimeout(pulseTimer);
      window.clearTimeout(settleAtHero);
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, [siteReady]);

  return (
    <>
      {/* Cinematic Loading intro */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* Mounted from the very start — not gated by siteReady — so its
          WebGL context and shaders are already warm by the time the loader
          fades out. It sits fully hidden behind the loader (z-index 10000)
          until `neuralPlay` flips true, at which point its own IntroDriver
          runs the pulse → pull-back cinematic. This is what removes the
          "cold start" pop that made the old fade-in feel disconnected. */}
      <NeuralField className="absolute top-0 left-0 right-0 h-[calc(100svh+45vh)] z-0" play={neuralPlay} />

      {/* Main site — fades in after loading screen exits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: siteReady ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="custom-cursor-hide min-h-screen overflow-x-hidden relative"
      >
        {siteReady && <Suspense fallback={<div className="site-shell" aria-busy="true" />}>
          {/* Persistent mesh gradient background */}
          <div className="mesh-gradient-bg fixed inset-0 opacity-[0.35] pointer-events-none z-0" />

          <ScrollStoryEngine />
          <CustomCursor />
          <Navbar />
          <main className="relative z-10">
            <Hero started />
            <Expertise /><div className="divider-wipe" />
            <Projects /><div className="divider-wipe" />
            <WhyChooseUs /><div className="divider-wipe" />
            <Process /><div className="divider-wipe" />
            <Testimonials /><div className="divider-wipe" />
            <Team /><div className="divider-wipe" />
            <Contact />
          </main>
          <Footer />
        </Suspense>}
      </motion.div>
    </>
  );
}