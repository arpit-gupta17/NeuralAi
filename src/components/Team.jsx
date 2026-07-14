import { motion } from 'framer-motion';
import { Code2, MessageCircle, Briefcase } from 'lucide-react';

const team = [
  { name: 'Alex Morgan', role: 'CEO & AI Lead', initials: 'AM', gradient: 'from-cyan-400 to-blue-500' },
  { name: 'Sophia Reeves', role: 'Design Director', initials: 'SR', gradient: 'from-purple-400 to-pink-500' },
  { name: 'Daniel Kim', role: 'Lead Engineer', initials: 'DK', gradient: 'from-emerald-400 to-cyan-500' },
  { name: 'Layla Hassan', role: 'ML Architect', initials: 'LH', gradient: 'from-orange-400 to-red-500' },
];

const socialIcons = [
  { Icon: Code2, href: '#' },
  { Icon: MessageCircle, href: '#' },
  { Icon: Briefcase, href: '#' },
];

function TeamMember({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center text-center group"
    >
      {/* Avatar with floating animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-5"
      >
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-xl text-2xl font-display font-bold text-white relative z-10`}>
          {member.initials}
        </div>
        {/* Glow ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 scale-90`} />

        {/* Social overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          {socialIcons.map(({ Icon, href }) => (
            <a
              key={href}
              href={href}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Icon size={15} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <h3 className="font-display font-semibold text-base text-white">{member.name}</h3>
      <p className="text-xs text-white/40 mt-1">{member.role}</p>
    </motion.div>
  );
}

export default function Team() {
  return (
    <section id="team" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 mb-4">
            <span className="text-xs text-pink-400 tracking-wider uppercase font-medium">The Team</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Meet Our <span className="text-gradient-blue-purple">Experts</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A handpicked team of world-class designers, engineers, and AI specialists united by a passion for excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          {team.map((member, i) => (
            <TeamMember key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

