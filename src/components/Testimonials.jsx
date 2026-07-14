import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO, Vanta Systems',
    text: 'NeuralAI completely transformed our data pipeline. The AI models they built reduced our processing time by 80% and the quality was unmatched.',
    rating: 5,
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CEO, Apex Digital',
    text: 'Working with this team was a revelation. They didn\'t just build what we asked — they challenged our thinking and delivered something far better.',
    rating: 5,
    avatar: 'MR',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Lead, Luminary',
    text: 'The UI they created was absolutely stunning. Our conversion rate jumped 45% after launch. Worth every penny and then some.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'James Whitfield',
    role: 'Founder, NovaTech',
    text: 'From discovery to launch in 10 weeks. The team\'s ability to move fast without sacrificing quality is genuinely rare in this industry.',
    rating: 5,
    avatar: 'JW',
  },
  {
    name: 'Ava Lindström',
    role: 'Head of Design, Bloom',
    text: 'The attention to micro-interactions and animation quality set our app apart from every competitor. Our users constantly comment on how premium it feels.',
    rating: 5,
    avatar: 'AL',
  },
  {
    name: 'Kevin Park',
    role: 'VP Engineering, DataFlow',
    text: 'Their cloud architecture expertise saved us $200K in annual infrastructure costs. Brilliant engineers who deeply understand scalability.',
    rating: 5,
    avatar: 'KP',
  },
];

// Duplicate for seamless looping
const allTestimonials = [...testimonials, ...testimonials];

function TestimonialCard({ testimonial }) {
  return (
    <div className="w-80 flex-shrink-0 glass-card rounded-2xl p-6 mx-3 border border-white/5">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-white/60 leading-relaxed mb-5">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-black">{testimonial.avatar}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-white/40">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="glow-orb absolute w-[500px] h-[500px] top-[10%] left-[20%] bg-cyan-500 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 mb-4">
            <span className="text-xs text-yellow-400 tracking-wider uppercase font-medium">Client Voices</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            What Our <span className="text-gradient-blue-purple">Clients Say</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Don't take our word for it — hear from the teams we've helped transform.
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee */}
      <div className="animate-marquee-paused overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee">
          {allTestimonials.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

