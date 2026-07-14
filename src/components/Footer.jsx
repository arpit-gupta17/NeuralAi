import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, MessageCircle, Briefcase, Camera, Zap, Send } from 'lucide-react';

const footerLinks = {
  Services: ['AI Development', 'Web Development', 'Mobile Apps', 'Automation', 'Cloud', 'UI/UX Design'],
  Company: ['About Us', 'Our Process', 'Team', 'Careers', 'Blog'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const socials = [
  { Icon: Code2, href: '#', label: 'GitHub' },
  { Icon: MessageCircle, href: '#', label: 'Twitter' },
  { Icon: Briefcase, href: '#', label: 'LinkedIn' },
  { Icon: Camera, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      {/* Glass footer bg */}
      <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm" />
      <div className="glow-orb absolute w-[400px] h-[400px] bottom-[-100px] left-[20%] bg-purple-800 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Zap size={16} className="text-black fill-black" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Neural<span className="text-gradient-blue-purple">AI</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              We build AI products, web applications, and digital experiences that push the boundaries of what's possible.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Stay Updated</p>
              {subscribed ? (
                <p className="text-sm text-cyan-400">✓ You're subscribed!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white placeholder-white/25 text-xs outline-none focus:border-cyan-400/40 transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center"
                  >
                    <Send size={13} className="text-black" />
                  </motion.button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs text-white/50 uppercase tracking-wider mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-5">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} NeuralAI Agency. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socials.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.15, color: '#00f0ff' }}
                className="text-white/30 hover:text-cyan-400 transition-colors"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
