import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="glow-orb absolute w-[600px] h-[600px] top-[5%] right-[-200px] bg-purple-600 pointer-events-none" />
      <div className="glow-orb absolute w-[400px] h-[400px] bottom-[10%] left-[-100px] bg-cyan-500 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <span className="text-xs text-cyan-400 tracking-wider uppercase font-medium">Get In Touch</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Start Your <span className="text-gradient-blue-purple">Project</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Ready to build something extraordinary? Tell us about your vision and we'll turn it into reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-3xl p-8 sm:p-10 border border-white/8"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="py-16 flex flex-col items-center text-center gap-5"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                  <CheckCircle size={36} className="text-black" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Message Sent!</h3>
                <p className="text-white/50 max-w-xs">
                  Thank you for reaching out. We'll review your project and get back to you within 24 hours.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', project: '', message: '' }); }}
                  className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-display text-white border border-white/10 hover:bg-white/5 transition-all"
                >
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40 uppercase tracking-wider">Your Name</label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 text-sm outline-none focus:border-cyan-400/50 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.08)] transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40 uppercase tracking-wider">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 text-sm outline-none focus:border-cyan-400/50 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.08)] transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider">Project Type</label>
                  <select
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-cyan-400/50 transition-all duration-300 appearance-none"
                  >
                    <option value="" style={{ background: '#0a0a0a' }}>Select a service...</option>
                    {['AI Development', 'Web Development', 'Mobile App', 'Automation', 'Cloud', 'UI/UX Design'].map(o => (
                      <option key={o} value={o} style={{ background: '#0a0a0a' }}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider">Project Details</label>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 text-sm outline-none focus:border-cyan-400/50 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.08)] transition-all duration-300 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,240,255,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl font-display font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

