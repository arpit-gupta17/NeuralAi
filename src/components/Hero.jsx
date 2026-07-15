import { useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

// ─── Word-by-word blur-to-sharp reveal ───────────────────────────────────────
function BlurWord({ word, delay, className }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, filter: 'blur(16px)', y: 28, scale: 0.94 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
      transition={{ duration: 0.86, delay, type: 'spring', stiffness: 145, damping: 16 }}
    >
      {word}
    </motion.span>
  );
}

function AnimatedTitle({ started }) {
  const line1 = ['We', 'Engineer'];
  const line2 = ['Intelligence'];
  const line3 = ['For', 'What’s'];
  const line4 = ['Next.'];

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
  return (
    <section
      id="home"
      className="hero-cinematic relative h-[100svh] flex items-center overflow-hidden bg-[#03050d]"
    >
      <div className="hero-light-field absolute inset-0 pointer-events-none z-0" aria-hidden="true"><i /><i /><i /><span /></div>
      <div className="hero-vignette absolute inset-0 pointer-events-none z-[1]" />

      {/* ── Light sweep ─────────────────────────────── */}
      <LightSweep started={started} />

      {/* ── Content ─────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24">
        <div className="flex items-center min-h-[100svh]">

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
                  Neurall builds intelligent products, high-performance software, and digital systems
                  that make ambitious companies impossible to ignore.
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
                    Start Your Project
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </MagneticButton>

                  <MagneticButton
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-display font-semibold text-sm text-white border border-white/10 hover:bg-white/5 hover:border-cyan-400/30 transition-all duration-300 backdrop-blur-md cursor-pointer"
                  >
                    <Play size={13} className="fill-cyan-400 text-cyan-400" />
                    Explore Our Work
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
                  {[['★★★★★', 'Trusted by startups'], ['100+', 'Projects built'], ['98%', 'Client satisfaction']].map(([n, l]) => (
                    <div key={l}>
                      <div className={`font-display font-bold ${n === '★★★★★' ? 'text-sm tracking-[.18em] text-cyan-300' : 'text-2xl'} text-white tracking-tight`}>{n}</div>
                      <div className="text-xs text-white/40 mt-1 font-light tracking-wide">{l}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
