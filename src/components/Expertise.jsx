import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const items = [
  {
    num: '01',
    title: 'AI Development',
    description:
      'We design and deploy custom neural networks, NLP pipelines, predictive models, and computer vision systems. Unlock complex automated reasoning tailored to your specific workloads.',
    features: ['Custom neural networks', 'NLP & computer vision', 'Predictive modeling'],
    accent: '#00f0ff',
  },
  {
    num: '02',
    title: 'Web Development',
    description:
      'Engineering highly scalable, responsive web architectures. Leveraging modern JS frameworks to deliver lightning-fast load times, solid security, and immersive visual frontends.',
    features: ['Modern JS frameworks', 'Performance & security', 'Immersive frontends'],
    accent: '#9945ff',
  },
  {
    num: '03',
    title: 'Mobile Apps',
    description:
      'Crafting fluid native and hybrid mobile solutions. Combining smooth transitions, offline-first structures, and deep hardware integration to keep users hooked.',
    features: ['Native & hybrid builds', 'Offline-first structure', 'Hardware integration'],
    accent: '#10b981',
  },
  {
    num: '04',
    title: 'Automation Solutions',
    description:
      'Streamlining enterprise operations with custom workflow automation pipelines. Connect legacy databases to intelligent API triggers to completely remove human overhead.',
    features: ['Workflow pipelines', 'Legacy DB connectors', 'Zero manual overhead'],
    accent: '#f97316',
  },
  {
    num: '05',
    title: 'Cloud Infrastructure',
    description:
      'Architecting robust, secure multi-region cloud infrastructures. Integrate automated CI/CD deployment pipelines, serverless models, and cost optimization layers.',
    features: ['Multi-region architecture', 'Automated CI/CD', 'Cost optimization'],
    accent: '#3b82f6',
  },
  {
    num: '06',
    title: 'UI/UX Design',
    description:
      'Defining established design languages and high-end design systems. Combining user testing, micro-interactions, and premium layouts to build high-converting interfaces.',
    features: ['Design systems', 'Micro-interactions', 'Conversion-focused UI'],
    accent: '#ec4899',
  },
];

// ── Interactive SVG / motion visuals ─────────────────────────────────────

function AIVisual() {
  return (
    <svg className="w-full h-full max-w-[400px] max-h-[400px]" viewBox="0 0 200 200">
      <line x1="30" y1="100" x2="80" y2="50" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="30" y1="100" x2="80" y2="150" stroke="#00f0ff" strokeWidth="1" />
      <line x1="80" y1="50" x2="140" y2="50" stroke="#00f0ff" strokeWidth="1" />
      <line x1="80" y1="150" x2="140" y2="150" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="80" y1="50" x2="140" y2="100" stroke="#9945ff" strokeWidth="1" />
      <line x1="80" y1="150" x2="140" y2="100" stroke="#9945ff" strokeWidth="1" />
      <line x1="140" y1="50" x2="180" y2="100" stroke="#00f0ff" strokeWidth="1" />
      <line x1="140" y1="100" x2="180" y2="100" stroke="#00f0ff" strokeWidth="1.5" />
      <line x1="140" y1="150" x2="180" y2="100" stroke="#00f0ff" strokeWidth="1" />

      <circle cx="30" cy="100" r="8" fill="#00f0ff" className="animate-pulse" />
      <circle cx="80" cy="50" r="6" fill="#9945ff" />
      <circle cx="80" cy="150" r="6" fill="#00f0ff" />
      <circle cx="140" cy="50" r="6" fill="#00f0ff" />
      <circle cx="140" cy="100" r="8" fill="#9945ff" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="140" cy="100" r="8" fill="#9945ff" />
      <circle cx="140" cy="150" r="6" fill="#00f0ff" />
      <circle cx="180" cy="100" r="10" fill="#00f0ff" />

      <circle cx="30" cy="100" r="3" fill="#ffffff">
        <animateMotion dur="3s" repeatCount="indefinite" path="M 0 0 L 50 -50 L 110 -50 L 150 0" />
      </circle>
      <circle cx="30" cy="100" r="3" fill="#ffffff">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 0 0 L 50 50 L 110 0 L 150 0" />
      </circle>
    </svg>
  );
}

function WebVisual() {
  return (
    <div className="w-full h-full max-w-[400px] max-h-[300px] glass-card rounded-xl p-5 border border-white/10 relative overflow-hidden flex flex-col gap-3">
      <div className="flex gap-1.5 items-center pb-3 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="ml-4 w-32 h-3.5 rounded bg-white/5" />
      </div>

      <div className="flex gap-4 flex-1">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/4 rounded bg-gradient-to-b from-purple-500/10 to-transparent p-2 space-y-2"
        >
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-[80%] rounded bg-white/5" />
          <div className="h-2 w-[90%] rounded bg-white/5" />
        </motion.div>

        <div className="flex-1 flex flex-col gap-3 justify-between">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-16 rounded border border-white/5 bg-white/5 flex items-center justify-center"
            >
              <div className="w-[60%] h-2 rounded bg-cyan-400/20" />
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-16 rounded border border-white/5 bg-white/5 flex items-center justify-center"
            >
              <div className="w-[65%] h-2 rounded bg-purple-500/20" />
            </motion.div>
          </div>

          <div className="h-16 rounded bg-black/40 border border-white/5 p-3 flex flex-col gap-1.5 justify-center">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
              className="h-1.5 rounded bg-cyan-400/40"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatType: 'reverse' }}
              className="h-1.5 rounded bg-purple-500/40"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.0, delay: 0.4, repeat: Infinity, repeatType: 'reverse' }}
              className="h-1.5 rounded bg-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileVisual() {
  return (
    <div className="relative w-full h-full max-w-[320px] max-h-[400px] flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -10, 0], rotateY: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ perspective: 1000 }}
        className="w-52 h-[340px] rounded-[32px] bg-zinc-900 border-[6px] border-zinc-800 relative shadow-2xl overflow-hidden"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-black flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-8 h-1 rounded-full bg-white/20" />
        </div>

        <div className="p-4 pt-10 space-y-4">
          <div className="w-16 h-4 rounded bg-cyan-400/20" />
          <div className="space-y-2">
            {[1, 2, 3].map((val) => (
              <div key={val} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="w-16 h-2 rounded bg-white/20" />
                <div className="w-6 h-2 rounded bg-purple-500/40" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-[-20px] w-24 h-16 rounded-xl glass-card border border-white/10 p-3 flex flex-col justify-between shadow-xl"
      >
        <div className="w-8 h-1.5 rounded bg-emerald-400" />
        <div className="w-12 h-1 rounded bg-white/20" />
        <div className="w-14 h-1 rounded bg-white/20" />
      </motion.div>

      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 left-[-20px] w-24 h-16 rounded-xl glass-card border border-white/10 p-3 flex flex-col justify-between shadow-xl"
      >
        <div className="w-8 h-1.5 rounded bg-purple-500" />
        <div className="w-14 h-1 rounded bg-white/20" />
        <div className="w-10 h-1 rounded bg-white/20" />
      </motion.div>
    </div>
  );
}

function AutomationVisual() {
  return (
    <svg className="w-full h-full max-w-[400px] max-h-[400px]" viewBox="0 0 200 200">
      <rect x="20" y="30" width="40" height="30" rx="6" fill="none" stroke="#f97316" strokeWidth="1" />
      <rect x="140" y="30" width="40" height="30" rx="6" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
      <rect x="80" y="100" width="40" height="30" rx="6" fill="none" stroke="#f97316" strokeWidth="1" />
      <rect x="80" y="155" width="40" height="30" rx="6" fill="none" stroke="#f97316" strokeWidth="1" />

      <path d="M 60 45 L 140 45" fill="none" stroke="#f97316" strokeWidth="1" />
      <path d="M 100 45 L 100 100" fill="none" stroke="#f97316" strokeWidth="1" />
      <path d="M 100 130 L 100 155" fill="none" stroke="#f97316" strokeWidth="1.5" />

      <circle cx="40" cy="45" r="3" fill="#f97316" />
      <circle cx="160" cy="45" r="3" fill="#ffffff" />
      <circle cx="100" cy="115" r="3" fill="#f97316" />

      <circle cx="0" cy="0" r="2.5" fill="#ffffff">
        <animateMotion dur="2.8s" repeatCount="indefinite" path="M 60 45 L 100 45 L 100 100 L 100 155" />
      </circle>

      <g transform="translate(100, 115) scale(0.6)">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
          <circle cx="0" cy="0" r="14" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="#f97316" strokeWidth="2" />
        </motion.g>
      </g>
    </svg>
  );
}

function CloudVisual() {
  return (
    <svg className="w-full h-full max-w-[400px] max-h-[400px]" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="24" fill="#3b82f6" fillOpacity="0.12" stroke="#3b82f6" strokeWidth="1.5" />
      <path
        d="M 90 105 A 10 10 0 0 1 95 90 A 15 15 0 0 1 115 95 A 10 10 0 0 1 110 105 Z"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />

      <g transform="translate(40, 50)">
        <circle cx="0" cy="0" r="12" fill="#050505" stroke="#ffffff" strokeWidth="0.8" />
        <rect x="-6" y="-3" width="12" height="6" fill="none" stroke="#ffffff" strokeWidth="0.5" />
      </g>
      <g transform="translate(160, 50)">
        <circle cx="0" cy="0" r="12" fill="#050505" stroke="#3b82f6" strokeWidth="1" />
        <rect x="-6" y="-3" width="12" height="6" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
      </g>
      <g transform="translate(40, 150)">
        <circle cx="0" cy="0" r="12" fill="#050505" stroke="#3b82f6" strokeWidth="1" />
        <rect x="-6" y="-3" width="12" height="6" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
      </g>
      <g transform="translate(160, 150)">
        <circle cx="0" cy="0" r="12" fill="#050505" stroke="#ffffff" strokeWidth="0.8" />
        <rect x="-6" y="-3" width="12" height="6" fill="none" stroke="#ffffff" strokeWidth="0.5" />
      </g>

      <line x1="100" y1="100" x2="40" y2="50" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="100" y1="100" x2="160" y2="50" stroke="#3b82f6" strokeWidth="1" />
      <line x1="100" y1="100" x2="40" y2="150" stroke="#3b82f6" strokeWidth="1" />
      <line x1="100" y1="100" x2="160" y2="150" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />

      <circle cx="100" cy="100" r="2.5" fill="#ffffff">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M 0 0 L 60 50" />
      </circle>
      <circle cx="100" cy="100" r="2.5" fill="#ffffff">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0 0 L -60 -50" />
      </circle>
    </svg>
  );
}

function DesignVisual() {
  return (
    <div className="w-full h-full max-w-[400px] max-h-[300px] flex flex-col gap-4">
      <div className="flex-1 rounded-2xl border border-white/10 glass-card p-5 relative overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{ borderRadius: ['4px', '24px', '4px'], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-48 h-28 border border-pink-500/40 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_49%,rgba(236,72,153,0.1)_50%,transparent_51%),linear-gradient(to_top_right,transparent_49%,rgba(236,72,153,0.1)_50%,transparent_51%)]" />

          <motion.div
            animate={{ opacity: [0.1, 0.95, 0.1], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-[inherit] border border-pink-400 flex flex-col justify-between p-3"
          >
            <div className="w-16 h-3 rounded bg-white/30" />
            <div className="w-28 h-2 rounded bg-white/20" />
            <div className="flex justify-between items-center">
              <div className="w-8 h-2 rounded bg-white/20" />
              <div className="w-8 h-4 rounded bg-cyan-400" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex gap-3 justify-center">
        {['#ec4899', '#9945ff', '#00f0ff', '#10b981'].map((color, idx) => (
          <motion.div
            key={color}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, delay: idx * 0.3, repeat: Infinity }}
            className="w-5 h-5 rounded-full border border-white/10 shadow-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

const visualComponents = [AIVisual, WebVisual, MobileVisual, AutomationVisual, CloudVisual, DesignVisual];

// ── Main section ──────────────────────────────────────────────────────────

export default function Expertise() {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Lenis smooths/batches scroll, so a native `window.scroll` listener can
  // stay silent for long stretches (or fire with a stale rect) and the
  // index never advances past card 01. useScroll instead samples the
  // container's scroll progress every animation frame via requestAnimationFrame,
  // independent of whether Lenis, the browser, or anything else is the one
  // actually moving the page — so it can't get stuck.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextIndex = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    setActiveIdx((prev) => (prev === nextIndex ? prev : nextIndex));
  });

  const activeItem = items[activeIdx];
  const ActiveVisual = visualComponents[activeIdx];

  const scrollToIdx = (idx) => {
    if (!containerRef.current) return;
    const target = containerRef.current.offsetTop + idx * window.innerHeight;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <>
      {/* ══════════════ DESKTOP / TABLET — sticky storytelling ══════════════ */}
      <section
        ref={containerRef}
        id="services"
        className="relative hidden md:block h-[600vh] bg-black"
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden z-20">
          {/* Accent ambient background */}
          <div
            className="absolute inset-0 opacity-[0.07] transition-all duration-1000 blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle at 60% 50%, ${activeItem.accent} 0%, transparent 55%)` }}
          />

          <div className="h-full flex flex-col pt-24 pb-10 max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section pill */}
            <div className="mb-6 flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5">
                <span className="text-xs text-purple-400 tracking-widest uppercase font-semibold">Our Expertise</span>
              </div>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-10 items-center min-h-0">
              {/* ── Left column ── */}
              <div className="flex flex-col justify-center gap-8 h-full">
                {/* Progress bar row */}
                <div className="flex items-center gap-4">
                  <span className="font-display font-black text-5xl text-white/10 tabular-nums leading-none">
                    {activeItem.num}
                  </span>
                  <div className="h-[2px] flex-1 bg-white/10 relative overflow-hidden rounded-full">
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 rounded-full"
                      style={{ background: `linear-gradient(to right, #00f0ff, ${activeItem.accent})` }}
                      animate={{ width: `${((activeIdx + 1) / items.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="text-xs font-mono text-white/30">0{items.length}</span>
                </div>

                {/* Title / description / features */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    <h3 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight">
                      {activeItem.title}
                    </h3>
                    <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-md">
                      {activeItem.description}
                    </p>
                    <ul className="space-y-2.5 pt-1">
                      {activeItem.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-white/70 text-sm">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: activeItem.accent }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation dots */}
                <div className="flex items-center gap-3 pt-2">
                  {items.map((item, idx) => (
                    <button
                      key={item.num}
                      onClick={() => scrollToIdx(idx)}
                      aria-label={`Go to ${item.title}`}
                      className={`rounded-full transition-all duration-400 cursor-pointer focus:outline-none ${
                        activeIdx === idx
                          ? 'w-6 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                          : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/35'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ── Right column ── */}
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                  <div
                    className="absolute inset-[8%] rounded-full blur-3xl opacity-20 transition-colors duration-700 pointer-events-none"
                    style={{ backgroundColor: activeItem.accent }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <ActiveVisual />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ MOBILE — stacked premium cards ══════════════ */}
      <section className="md:hidden relative bg-black py-16 px-5">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5">
            <span className="text-xs text-purple-400 tracking-widest uppercase font-semibold">Our Expertise</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {items.map((item, idx) => {
            const Visual = visualComponents[idx];
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-white/10 glass-card overflow-hidden p-6"
              >
                <div
                  className="absolute inset-0 opacity-[0.08] blur-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${item.accent} 0%, transparent 60%)` }}
                />

                <div className="relative flex items-center justify-center py-6 mb-4">
                  <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
                    <div
                      className="absolute inset-[10%] rounded-full blur-2xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: item.accent }}
                    />
                    <Visual />
                  </div>
                </div>

                <div className="relative space-y-3">
                  <span className="font-display font-black text-2xl text-white/15 tabular-nums leading-none">
                    {item.num}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white leading-tight">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  <ul className="space-y-2 pt-1">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-white/70 text-sm">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.accent }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}