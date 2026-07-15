import { motion } from 'framer-motion';

const panels = [
  { id: 'success', label: 'Project Success', value: '98%', detail: 'Delivered beyond target', type: 'ring', accent: '#00e5ff' },
  { id: 'world', label: 'Countries Served', value: '10+', detail: 'Connected operating zones', type: 'map', accent: '#a970ff' },
  { id: 'neural', label: 'AI Performance', value: '99.8', detail: 'Inference reliability', type: 'neural', accent: '#50dfa9' },
  { id: 'cloud', label: 'Infrastructure', value: '24/7', detail: 'Global system uptime', type: 'cloud', accent: '#5a9dff' },
  { id: 'security', label: 'Security', value: '0', detail: 'Critical threats passed', type: 'security', accent: '#69e69e' },
  { id: 'innovation', label: 'Innovation', value: '100+', detail: 'Systems launched', type: 'roadmap', accent: '#ff94c6' },
];

function Visualization({ type }) {
  if (type === 'ring') return <div className="cc-ring"><i /><b>98</b></div>;
  if (type === 'map') return <svg className="cc-map" viewBox="0 0 160 70" aria-hidden="true"><path d="M8 30 29 15l18 4 12-9 18 13 25-3 14 13 25 1 11 14-20 10-23-6-18 7-28-5-20 6-13-14-22-2Z" /><circle cx="38" cy="27" r="2" /><circle cx="84" cy="31" r="2" /><circle cx="123" cy="42" r="2" /><path className="cc-route" d="M38 27Q70 6 84 31T123 42" /></svg>;
  if (type === 'neural') return <div className="cc-neural">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--x': `${(i % 4) * 31 + 5}px`, '--y': `${Math.floor(i / 4) * 22 + 7}px` }} />)}<svg viewBox="0 0 130 60"><path d="M10 15 43 34 75 12 111 39M10 39 43 34 75 46 111 20" /></svg></div>;
  if (type === 'cloud') return <div className="cc-cloud"><span>◉</span><i /><i /><i /><b>LOAD · 18%</b></div>;
  if (type === 'security') return <div className="cc-security"><span>⌁</span><i>SECURE</i><b>ENCRYPTED / ACTIVE</b></div>;
  return <div className="cc-roadmap"><i /><i /><i /><i /><b>RESEARCH → LAUNCH</b></div>;
}

function Panel({ panel, index }) {
  return <motion.article tabIndex="0" initial={{ opacity: 0, scale: .7, y: index < 3 ? -28 : 28 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08, type: 'spring', stiffness: 100, damping: 16 }} className={`command-panel command-panel--${panel.id}`} style={{ '--panel-accent': panel.accent }}>
    <div className="command-panel__top"><span>NODE // {String(index + 1).padStart(2, '0')}</span><i /></div><Visualization type={panel.type} /><div className="command-panel__copy"><span>{panel.label}</span><strong>{panel.value}</strong><small>{panel.detail}</small></div>
  </motion.article>;
}

export default function WhyChooseUs() {
  return <section id="about" className="command-center relative min-h-[1300px] overflow-hidden bg-black py-24">
    <div className="command-center__grid" /><div className="command-center__fog" />
    <header className="command-center__header relative z-10 max-w-7xl mx-auto px-6 lg:px-8"><span>NEURALL / COMMAND CENTER</span><h2>Intelligence, <em>without guesswork.</em></h2><p>Every system is connected. Every decision is visible. Every result is engineered.</p></header>
    <div className="command-room relative mx-auto mt-8 max-w-7xl px-4 lg:px-8" aria-label="Neurall intelligence command center">
      <svg className="command-links" viewBox="0 0 1000 730" preserveAspectRatio="none" aria-hidden="true">{[[500,365,180,155],[500,365,500,110],[500,365,820,155],[500,365,180,565],[500,365,500,620],[500,365,820,565]].map(([x1,y1,x2,y2], i) => <path key={i} d={`M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2-50} ${x2} ${y2}`} />)}</svg>
      <div className="command-core"><span className="command-core__orbit" /><span className="command-core__orbit command-core__orbit--two" /><b>AI</b><i>NEURALL<br />CORE</i></div>
      {panels.map((panel, index) => <Panel key={panel.id} panel={panel} index={index} />)}
    </div>
    <div className="command-center__footer"><span>LIVE INTELLIGENCE STREAM</span><i /><span>ALL SYSTEMS NOMINAL</span></div>
  </section>;
}
