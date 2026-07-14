import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  { number: '01', title: 'Discover', description: 'We dive deep into your goals, challenges, and market. Through structured workshops and user research, we define a clear north star.' },
  { number: '02', title: 'Design', description: 'Our designers craft pixel-perfect wireframes, interactive prototypes, and a cohesive design system that balances beauty with usability.' },
  { number: '03', title: 'Develop', description: 'World-class engineers build your product with modern tech stacks, rigorous testing, and a focus on performance and scalability.' },
  { number: '04', title: 'Launch', description: 'We manage the full deployment pipeline — from CI/CD setup to production monitoring — ensuring a smooth, zero-downtime launch.' },
  { number: '05', title: 'Scale', description: 'Post-launch, we continuously optimise, add features, and scale your infrastructure to handle growth and evolving user needs.' },
];

function ProcessStep({ step, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.3, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 0.4], [index % 2 === 0 ? -30 : 30, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className={`flex gap-6 sm:gap-10 items-start ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse sm:text-right'}`}
    >
      {/* Number badge */}
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl glass-card border border-white/10 flex items-center justify-center">
          <span className="font-display font-bold text-sm text-gradient-blue-purple">{step.number}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <h3 className="font-display font-bold text-xl text-white mb-2">{step.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed max-w-sm">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.9', 'end 0.2'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="process" className="relative py-24 overflow-hidden">
      <div className="glow-orb absolute w-[400px] h-[400px] top-[30%] right-[-100px] bg-purple-600 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-4">
            <span className="text-xs text-purple-400 tracking-wider uppercase font-medium">How We Work</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Our <span className="text-gradient-blue-purple">Process</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A battle-tested methodology that consistently delivers extraordinary results.
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto" ref={containerRef}>
          {/* Glowing vertical timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="relative">
            {steps.map((step, i) => (
              <ProcessStep key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

