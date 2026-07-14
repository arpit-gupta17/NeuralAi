import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = black → glow
  // phase 1 = logo reveal
  // phase 2 = exit wipe

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Soft blue glow that slowly blooms */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.5 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(153,69,255,0.06) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Animated ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: phase >= 1 ? 0.3 : 0, scale: phase >= 1 ? 1 : 0.6 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-72 h-72 rounded-full border border-cyan-400/20"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: phase >= 1 ? 0.15 : 0, scale: phase >= 1 ? 1.3 : 0.7 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-72 h-72 rounded-full border border-purple-500/15"
          />

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(20px)' }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 1 ? 1 : 0.7,
              filter: phase >= 1 ? 'blur(0px)' : 'blur(20px)',
            }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
              <Zap size={28} className="text-black fill-black" />
            </div>
            <div className="text-center">
              <div className="font-display font-black text-2xl text-white tracking-tight">
                Neural<span className="text-gradient-blue-purple">AI</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: phase >= 1 ? '100%' : 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2"
              />
            </div>
          </motion.div>

          {/* Loading bar at bottom */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-48 h-px bg-white/5 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: phase >= 1 ? '100%' : '0%' }}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              />
            </div>
            <span className="text-xs font-mono text-white/20 tracking-widest uppercase">Initializing</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
