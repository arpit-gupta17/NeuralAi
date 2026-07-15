import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const interactiveSelector = 'a, button, [role="button"], input, select, textarea';

export default function CustomCursor() {
  const mouseX = useMotionValue(-100); const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 340, damping: 27 }); const y = useSpring(mouseY, { stiffness: 340, damping: 27 });
  const trailRefs = useRef([]); const target = useRef({ x: -100, y: -100 }); const [state, setState] = useState('idle'); const [visible, setVisible] = useState(false); const [burst, setBurst] = useState(null);
  useEffect(() => {
    const trail = Array.from({ length: 5 }, () => ({ x: -100, y: -100 })); let frame;
    const animate = () => { trail.forEach((point, index) => { const speed = .28 - index * .037; point.x += (target.current.x - point.x) * speed; point.y += (target.current.y - point.y) * speed; const node = trailRefs.current[index]; if (node) node.style.transform = `translate3d(${point.x - 4}px, ${point.y - 4}px, 0) scale(${1 - index * .13})`; }); frame = requestAnimationFrame(animate); };
    const move = (event) => { target.current = { x: event.clientX, y: event.clientY }; mouseX.set(event.clientX - 10); mouseY.set(event.clientY - 10); setVisible(true); const element = event.target.closest?.(interactiveSelector); if (!element) setState('idle'); else if (element.matches('input, textarea, select')) setState('typing'); else if (element.matches('button, [role="button"]')) setState('button'); else setState('link'); };
    const down = (event) => { setBurst({ x: event.clientX, y: event.clientY, id: Date.now() }); setState('pressed'); window.setTimeout(() => setState('idle'), 180); };
    const focus = (event) => { if (event.target.matches?.('input, textarea, select')) setState('typing'); };
    const blur = () => setState('idle');
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerdown', down, { passive: true }); window.addEventListener('focusin', focus); window.addEventListener('focusout', blur); frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down); window.removeEventListener('focusin', focus); window.removeEventListener('focusout', blur); };
  }, [mouseX, mouseY]);
  return <div className={`ai-cursor ai-cursor--${state} ${visible ? 'ai-cursor--visible' : ''}`} aria-hidden="true">{[0, 1, 2, 3, 4].map((index) => <i key={index} ref={(node) => { trailRefs.current[index] = node; }} className="ai-cursor__trail" />)}<motion.div className="ai-cursor__orb" style={{ x, y }}><i /><i /><b /></motion.div>{burst && <span key={burst.id} className="ai-cursor__burst" style={{ left: burst.x, top: burst.y }} />}</div>;
}
