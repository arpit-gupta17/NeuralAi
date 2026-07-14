import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';

// ─── Word-by-word blur-to-sharp reveal ───────────────────────────────────────
function BlurWord({ word, delay, className }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, filter: 'blur(16px)', y: 24 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {word}
    </motion.span>
  );
}

function AnimatedTitle({ started }) {
  const line1 = ['Building', 'AI'];
  const line2 = ['Experiences'];
  const line3 = ['That', 'Feel', 'Like'];
  const line4 = ['Magic.'];

  if (!started) return null;

  return (
    <h1 className="font-display font-black leading-[1.04] text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight">
      {/* Line 1 */}
      <span className="block">
        {line1.map((w, i) => (
          <BlurWord key={w} word={w + '\u00A0'} delay={0.1 + i * 0.12} />
        ))}
      </span>

      {/* Line 2 – gradient */}
      <span className="block">
        {line2.map((w, i) => (
          <BlurWord
            key={w}
            word={w}
            delay={0.35 + i * 0.12}
            className="text-gradient-blue-purple bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500"
          />
        ))}
      </span>

      {/* Line 3 */}
      <span className="block">
        {line3.map((w, i) => (
          <BlurWord key={w} word={w + '\u00A0'} delay={0.56 + i * 0.12} />
        ))}
      </span>

      {/* Line 4 – silver */}
      <span className="block">
        {line4.map((w, i) => (
          <BlurWord
            key={w}
            word={w}
            delay={0.84 + i * 0.12}
            className="text-gradient-silver bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-500"
          />
        ))}
      </span>
    </h1>
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({ children, onClick, className, isPrimary }) {
  const btnRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const onMove = (e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.38);
    y.set((e.clientY - r.top - r.height / 2) * 0.38);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={btnRef} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: springX, y: springY }} className="relative inline-flex">
      {isPrimary && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 blur-lg opacity-50 animate-pulse pointer-events-none" />
      )}
      <button
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    </motion.div>
  );
}

// ─── Light Sweep Overlay ───────────────────────────────────────────────────────
function LightSweep({ started }) {
  return (
    <AnimatePresence>
      {started && (
        <motion.div
          key="sweep"
          initial={{ x: '-110%', skewX: '-15deg' }}
          animate={{ x: '220%', skewX: '-15deg' }}
          transition={{ duration: 1.6, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 100%)',
            width: '60%',
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero({ started }) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very slow, heavily damped springs for background layers
  const slowSpringX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const slowSpringY = useSpring(mouseY, { stiffness: 30, damping: 25 });
  const fasterSpringX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const fasterSpringY = useSpring(mouseY, { stiffness: 55, damping: 20 });

  const orb1X = useTransform(slowSpringX, [-0.5, 0.5], [-55, 55]);
  const orb1Y = useTransform(slowSpringY, [-0.5, 0.5], [-55, 55]);
  const orb2X = useTransform(slowSpringX, [-0.5, 0.5], [40, -40]);
  const orb2Y = useTransform(slowSpringY, [-0.5, 0.5], [40, -40]);
  const canvasX = useTransform(fasterSpringX, [-0.5, 0.5], [-18, 18]);
  const canvasY = useTransform(fasterSpringY, [-0.5, 0.5], [-18, 18]);

  const onMouseMove = (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    mousePosition.current = { x: x * 2, y: y * 2 };
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      onMouseMove={onMouseMove}
    >
      {/* ── Background ──────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div style={{ x: orb1X, y: orb1Y }}
          className="glow-orb absolute w-[750px] h-[750px] -top-40 -left-40 bg-cyan-500/10" />
        <motion.div style={{ x: orb2X, y: orb2Y }}
          className="glow-orb absolute w-[650px] h-[650px] top-[20%] -right-40 bg-purple-600/10" />
        <div className="glow-orb absolute w-[500px] h-[500px] -bottom-20 left-[35%] bg-blue-600/5" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: 'linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* ── Light sweep ─────────────────────────────── */}
      <LightSweep started={started} />

      {/* ── Content ─────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left */}
          <div className="flex flex-col gap-6">

            {/* Badge */}
            <AnimatePresence>
              {started && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs text-cyan-400 font-medium tracking-widest uppercase font-mono">
                    AI-Powered Design Studio
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Word-by-word title */}
            <AnimatedTitle started={started} />

            {/* Subtitle */}
            <AnimatePresence>
              {started && (
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg text-white/50 leading-relaxed max-w-lg font-light"
                >
                  We design and develop premium AI products, responsive software applications,
                  workflow automations, and immersive digital platforms.
                </motion.p>
              )}
            </AnimatePresence>

            {/* CTAs */}
            <AnimatePresence>
              {started && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.4, type: 'spring', stiffness: 180, damping: 18 }}
                  className="flex flex-wrap gap-5 mt-2"
                >
                  <MagneticButton isPrimary
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative flex items-center gap-2.5 px-8 py-4 rounded-2xl font-display font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 z-10 btn-light-sweep cursor-pointer overflow-hidden"
                  >
                    Start Project
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </MagneticButton>

                  <MagneticButton
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-display font-semibold text-sm text-white border border-white/10 hover:bg-white/5 hover:border-cyan-400/30 transition-all duration-300 backdrop-blur-md cursor-pointer"
                  >
                    <Play size={13} className="fill-cyan-400 text-cyan-400" />
                    View Portfolio
                  </MagneticButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <AnimatePresence>
              {started && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.7 }}
                  className="flex gap-10 mt-6 pt-6 border-t border-white/5"
                >
                  {[['100+', 'Projects Built'], ['98%', 'Client Satisfaction'], ['25+', 'Experts Team']].map(([n, l]) => (
                    <div key={l}>
                      <div className="font-display font-bold text-2xl text-white tracking-tight">{n}</div>
                      <div className="text-xs text-white/40 mt-1 font-light tracking-wide">{l}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right – 3D Canvas drifts with mouse */}
          <motion.div
            style={{ x: canvasX, y: canvasY }}
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{ opacity: started ? 1 : 0, scale: started ? 1 : 0.78 }}
            transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[450px] lg:h-[600px] flex items-center justify-center"
          >
            <ThreeCanvas mousePosition={mousePosition} />
            <div className="absolute inset-[10%] rounded-full border border-cyan-400/5 animate-spin" style={{ animationDuration: '26s' }} />
            <div className="absolute inset-[22%] rounded-full border border-purple-500/5 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
