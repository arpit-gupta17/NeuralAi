import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered', color: 'from-cyan-400 to-blue-500' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', color: 'from-purple-400 to-pink-500' },
  { value: 25, suffix: '+', label: 'Expert Team', color: 'from-emerald-400 to-cyan-500' },
  { value: 10, suffix: '+', label: 'Countries Served', color: 'from-orange-400 to-red-500' },
];

function Counter({ value, suffix, color }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 20;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className={`font-display font-black text-5xl sm:text-6xl bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
      {count}{suffix}
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-7">
                  <Counter value={stat.value} suffix={stat.suffix} color={stat.color} />
                  <div className="mt-2 text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
              <span className="text-xs text-emerald-400 tracking-wider uppercase font-medium">Why Choose Us</span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">
              We Deliver <span className="text-gradient-blue-purple">Excellence</span>, Every Time
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              We combine cutting-edge technology with deep domain expertise to create digital experiences that don't just work — they set new industry benchmarks. Our team is obsessed with quality, performance, and pushing the boundaries of what's possible.
            </p>

            <div className="space-y-4">
              {['Pixel-perfect UI/UX execution', 'On-time, within-budget delivery', 'Transparent communication & agile workflow', 'Post-launch support & continuous optimisation'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

