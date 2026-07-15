import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const stages = [
  { id: 'discover', number: '01', title: 'Discovery', label: 'Signals become direction', detail: 'Research, users, goals, and opportunity maps become one shared intelligence model.', accent: '#00e5ff', glyph: '◎' },
  { id: 'strategy', number: '02', title: 'Strategy', label: 'Direction becomes a system', detail: 'A decision engine turns insight into roadmaps, operating models, and measurable next moves.', accent: '#a970ff', glyph: '⌘' },
  { id: 'design', number: '03', title: 'Design', label: 'Systems become experiences', detail: 'Interfaces assemble from a living design language, testing clarity at every interaction.', accent: '#ff82bf', glyph: '◇' },
  { id: 'develop', number: '04', title: 'Development', label: 'Experience becomes software', detail: 'Product architecture, APIs, and interfaces compile into a resilient connected platform.', accent: '#55a5ff', glyph: '</>' },
  { id: 'test', number: '05', title: 'Testing', label: 'Software becomes trusted', detail: 'Automated quality, accessibility, performance, and security checks resolve before launch.', accent: '#62e39c', glyph: '✓' },
  { id: 'launch', number: '06', title: 'Deployment', label: 'Trusted becomes global', detail: 'Cloud infrastructure wakes up, traffic flows, and continuous observation begins.', accent: '#ffc25d', glyph: '↗' },
];

function FactoryVisual({ stage }) {
  return <div className={`factory-visual factory-visual--${stage.id}`} style={{ '--factory-accent': stage.accent }}>
    <div className="factory-tunnel"><i /><i /><i /><i /><i /></div><div className="factory-packets">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--packet': index }} />)}</div>
    <div className="factory-workbench"><div className="factory-workbench__top"><span>NEURALL // {stage.id.toUpperCase()}_SYSTEM</span><i /></div><div className="factory-workbench__content"><b>{stage.glyph}</b><div className="factory-blueprint"><i /><i /><i /><i /><i /><i /></div><div className="factory-terminal"><span>BUILD STATUS</span><strong>{stage.id === 'test' ? 'VERIFIED' : stage.id === 'launch' ? 'GLOBAL' : 'ACTIVE'}</strong><i /><i /><i /></div></div></div>
  </div>;
}

export default function Process() {
  const ref = useRef(null); const [active, setActive] = useState(0); const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => { const next = Math.min(stages.length - 1, Math.floor(value * stages.length)); setActive((current) => current === next ? current : next); });
  const stage = stages[active]; const go = (index) => { setActive(index); };
  return <section ref={ref} id="process" className="factory-section relative overflow-hidden bg-black"><div className="relative min-h-screen overflow-hidden"><div className="factory-fog" style={{ '--factory-accent': stage.accent }} /><div className="factory-shell max-w-7xl mx-auto min-h-screen px-6 lg:px-8"><header className="factory-heading"><span>NEURALL / INTELLIGENCE FACTORY</span><h2>Watch an idea become <em>alive.</em></h2></header><div className="factory-layout"><div className="factory-stages">{stages.map((item, index) => <button type="button" onClick={() => go(index)} className={index === active ? 'active' : ''} style={{ '--factory-accent': item.accent }} key={item.id}><i>{item.number}</i><span>{item.title}</span><b>{item.glyph}</b></button>)}</div><motion.article key={stage.id} initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: .38 }} className="factory-copy" style={{ '--factory-accent': stage.accent }}><span>STAGE_{stage.number}</span><h3>{stage.title}</h3><strong>{stage.label}</strong><p>{stage.detail}</p><div className="factory-status"><i /> SYSTEMS CONNECTED <b>01.000</b></div></motion.article><FactoryVisual stage={stage} /></div><div className="factory-progress"><span>{stage.number} / 06</span><i><b style={{ width: `${((active + 1) / stages.length) * 100}%`, background: stage.accent }} /></i><span>SELECT A STAGE</span></div></div></div></section>;
}
