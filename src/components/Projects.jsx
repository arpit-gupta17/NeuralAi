import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const projects = [
  { title: 'Nexus AI Platform', category: 'AI · SAAS', accent: '#00e5ff', year: '2024', description: 'Enterprise AI operations for orchestrating inference, workflows, and model intelligence.', tech: ['React', 'Python', 'LangChain', 'AWS'], metrics: [['99', 'Performance'], ['100', 'Access'], ['98', 'SEO']] },
  { title: 'Aether Commerce', category: 'WEB · COMMERCE', accent: '#a970ff', year: '2024', description: 'A highly personalised commerce engine built around real-time product intelligence.', tech: ['Next.js', 'Three.js', 'Stripe', 'PostgreSQL'], metrics: [['98', 'Performance'], ['100', 'Access'], ['100', 'SEO']] },
  { title: 'Pulse Health App', category: 'MOBILE · HEALTH', accent: '#47e1a2', year: '2023', description: 'A living health companion translating biometrics into actionable daily guidance.', tech: ['React Native', 'TensorFlow', 'Firebase', 'HealthKit'], metrics: [['100', 'Performance'], ['98', 'Access'], ['96', 'SEO']] },
  { title: 'FlowMind Automation', category: 'AUTOMATION · OS', accent: '#ff9c55', year: '2023', description: 'A visual automation studio that turns complex business operations into lucid flows.', tech: ['Vue', 'Node.js', 'Kafka', 'Kubernetes'], metrics: [['97', 'Performance'], ['100', 'Access'], ['99', 'SEO']] },
];

function Monolith({ project, index, selected, onSelect }) {
  return <motion.button type="button" onClick={() => onSelect(index)} aria-pressed={selected} style={{ '--project-accent': project.accent }} className={`project-monolith ${selected ? 'project-monolith--selected' : ''}`} initial={{ opacity: 0, y: 70, rotateY: -18 }} whileInView={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ delay: index * .12, type: 'spring', stiffness: 80, damping: 15 }} whileHover={{ y: -14, scale: 1.04 }}>
    <span className="project-monolith__beam" /><span className="project-monolith__glass" /><span className="project-monolith__code">{project.category}</span><strong>{project.title.split(' ')[0]}</strong><small>{project.year}</small><i />
  </motion.button>;
}

function ProductPreview({ project }) {
  const [tab, setTab] = useState('OVERVIEW');
  return <motion.div key={project.title} initial={{ opacity: 0, scale: .88, rotateX: 12 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} className="product-launch" style={{ '--project-accent': project.accent }}>
    <div className="product-laptop"><div className="product-screen"><div className="product-nav"><b>{project.title.split(' ')[0]}</b>{['OVERVIEW', 'ANALYTICS', 'SYSTEM'].map((item) => <button type="button" onClick={() => setTab(item)} className={tab === item ? 'active' : ''} key={item}>{item}</button>)}</div><div className="product-ui"><div className="product-ui__hero"><span>{tab}</span><h3>Intelligence, <em>in motion.</em></h3><p>{project.description}</p></div><div className="product-ui__chart">{[36, 59, 42, 76, 58, 91, 72, 100].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><div className="product-ui__signals"><b>LIVE SYSTEM</b><span /><span /><span /></div></div></div><div className="product-laptop__base" /></div>
    <div className="launch-features">{project.tech.map((tech, index) => <motion.span whileHover={{ y: -4, scale: 1.05 }} key={tech} style={{ animationDelay: `${index * .2}s` }}>{tech}</motion.span>)}</div>
  </motion.div>;
}

export default function Projects() {
  const [active, setActive] = useState(0); const project = projects[active];
  return <section id="projects" className="projects-launchbay relative overflow-hidden bg-black">
    <div className="relative min-h-screen overflow-hidden py-24">
      <div className="launchbay-stars" /><div className="launchbay-fog" style={{ '--project-accent': project.accent }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"><header className="launchbay-heading"><span>NEURALL / PRODUCT LAUNCHES</span><h2>Ideas become <em>living systems.</em></h2></header>
        <div className="launchbay-layout"><div className="monolith-field">{projects.map((item, index) => <Monolith key={item.title} project={item} index={index} selected={index === active} onSelect={setActive} />)}</div><div className="launchbay-stage"><AnimatePresence mode="wait"><ProductPreview project={project} /></AnimatePresence></div></div>
        <div className="launchbay-data"><div><span>CASE STUDY</span><strong>{project.title}</strong></div><p>{project.description}</p><div className="launch-metrics">{project.metrics.map(([number, label]) => <div key={label}><b>{number}</b><span>{label}</span></div>)}</div></div>
        <div className="launch-timeline">{['Research', 'Design', 'Development', 'Testing', 'Launch'].map((step, index) => <span key={step}><i>{index + 1}</i>{step}</span>)}</div>
      </div>
    </div>
  </section>;
}
