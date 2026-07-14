import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

const projects = [
  {
    title: 'Nexus AI Platform',
    category: 'AI · SaaS',
    description: 'An enterprise-grade AI operations platform enabling teams to orchestrate LLM workflows, monitor model performance, and deploy inference pipelines at scale.',
    tech: ['React', 'Python', 'LangChain', 'AWS'],
    gradient: 'from-[#052e3c] to-[#011627]',
    accent: '#00f0ff',
    year: '2024',
  },
  {
    title: 'Aether Commerce',
    category: 'Web · E-Commerce',
    description: 'A hyper-personalised e-commerce experience with real-time AI recommendations, immersive 3D product previews, and a frictionless checkout system.',
    tech: ['Next.js', 'Three.js', 'Stripe', 'PostgreSQL'],
    gradient: 'from-[#2e0854] to-[#120024]',
    accent: '#9945ff',
    year: '2024',
  },
  {
    title: 'Pulse Health App',
    category: 'Mobile · HealthTech',
    description: 'A cross-platform wellness companion with ML-powered biometric analysis, personalized fitness coaching, and seamless wearable integration.',
    tech: ['React Native', 'TensorFlow Lite', 'Firebase', 'HealthKit'],
    gradient: 'from-[#022c22] to-[#021008]',
    accent: '#10b981',
    year: '2023',
  },
  {
    title: 'FlowMind Automation',
    category: 'Automation · Enterprise',
    description: 'A visual workflow automation studio for enterprises — drag-and-drop process building, intelligent error recovery, and real-time execution monitoring.',
    tech: ['Vue.js', 'Node.js', 'Kafka', 'Kubernetes'],
    gradient: 'from-[#3c1e08] to-[#1c0c02]',
    accent: '#f97316',
    year: '2023',
  },
];

// Animation variants for split converging effect
const leftPartVariants = {
  hidden: { opacity: 0, x: -120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

const rightPartVariants = {
  hidden: { opacity: 0, x: 120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

function WideProjectCard({ project, index, onOpen }) {
  const containerRef = useRef(null);

  // Track scroll for vertical parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const rotateParallax = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  // Spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      380px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.04),
      transparent 80%
    )
  `;

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="group relative w-full mb-16 lg:mb-24 last:mb-0 cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a]/30 backdrop-blur-md hover:border-white/10 transition-colors duration-500"
    >
      {/* Background Spotlight */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{ background }}
      />

      <div onClick={() => onOpen(project)} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch min-h-[420px]`}>
        {/* Project Thumbnail (Left or Right entrance) */}
        <motion.div
          variants={isEven ? leftPartVariants : rightPartVariants}
          className="lg:w-1/2 relative overflow-hidden bg-[#050505] flex items-center justify-center min-h-[300px]"
        >
          {/* Base gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 group-hover:scale-105`} />
          
          {/* Parallax elements */}
          <motion.div
            style={{ y: yParallax, rotate: rotateParallax }}
            className="absolute w-[60%] h-[60%] border-2 rounded-2xl flex items-center justify-center opacity-30 pointer-events-none"
          >
            <div className="absolute w-[80%] h-[80%] border rounded-full" style={{ borderColor: project.accent }} />
            <div className="absolute w-[50%] h-[50%] border-2 rounded-lg rotate-45" style={{ borderColor: project.accent }} />
          </motion.div>

          {/* Accent glow orb */}
          <div 
            className="absolute w-44 h-44 rounded-full blur-3xl opacity-40 group-hover:opacity-65 transition-opacity duration-500" 
            style={{ 
              backgroundColor: project.accent,
              transform: 'scale(1.2)'
            }} 
          />

          <span className="absolute bottom-4 left-6 text-xs font-mono uppercase tracking-widest text-white/40">
            Case Study {project.year}
          </span>
        </motion.div>

        {/* Project Content details (Opposite entrance) */}
        <motion.div
          variants={isEven ? rightPartVariants : leftPartVariants}
          className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between relative z-10"
        >
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: project.accent }}>
              {project.category}
            </span>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white group-hover:text-gradient-blue-purple transition-all duration-300">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/50 font-light"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
              <span>View Case Details</span>
              <ExternalLink size={14} className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-card border border-white/10"
          >
            <div className={`h-64 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}>
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 60%, ${project.accent}30 0%, transparent 65%)` }} />
              
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-24 h-24 rounded-full border opacity-20 animate-pulse" style={{ borderColor: project.accent }} />
            </div>

            <div className="p-8 sm:p-10">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: project.accent }}>
                {project.category}
              </span>
              <h2 className="font-display font-bold text-3xl text-white mt-2 mb-4">
                {project.title}
              </h2>
              <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base mb-8">
                {project.description}
              </p>

              <div className="space-y-4">
                <span className="text-xs text-white/30 tracking-widest uppercase block">Technologies Used</span>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span 
                      key={t} 
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="relative py-20 overflow-hidden bg-black">
      <div className="glow-orb absolute w-[600px] h-[600px] top-[40%] left-[-200px] bg-cyan-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <span className="text-xs text-cyan-400 tracking-widest uppercase font-semibold">Our Portfolio</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-5 tracking-tight">
            Featured <span className="text-gradient-blue-purple">Innovations</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto font-light leading-relaxed">
            Discover how we apply high-end interactive systems and predictive modeling to solve enterprise challenges.
          </p>
        </motion.div>

        <div className="relative">
          {projects.map((p, i) => (
            <WideProjectCard key={p.title} project={p} index={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
