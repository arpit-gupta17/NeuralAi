import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  ['home', '#112953', '#6b38c8'], ['services', '#4c1d95', '#1d4ed8'], ['projects', '#0b4b70', '#2563eb'],
  ['about', '#d9f4ff', '#6d28d9'], ['process', '#4b2090', '#1d4ed8'], ['testimonials', '#2c145f', '#2563eb'],
  ['team', '#174e68', '#4f46e5'], ['contact', '#00c8e6', '#6d28d9'],
];

export default function ScrollStoryEngine() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const sections = SCENES.map(([id]) => document.getElementById(id)).filter(Boolean);
    sections.forEach((section, index) => { section.classList.add('story-scene'); section.dataset.storyScene = String(index); });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top', end: 'bottom bottom', scrub: 0.85,
        onUpdate: () => {
          const center = window.scrollY + window.innerHeight * .5;
          let active = 0;
          sections.forEach((section, index) => { if (section.offsetTop <= center) active = index; });
          sceneRef.current = active;
          const [, cyan, violet] = SCENES[active];
          root.style.setProperty('--story-cyan', cyan);
          root.style.setProperty('--story-violet', violet);
        },
      },
    });
    // The master timeline is intentionally continuous; scene changes are sampled from its scrubbed position.
    timeline.to(root, { '--story-intensity': 1, duration: 1, ease: 'none' });
    const onMove = (event) => { pointer.current = { x: event.clientX / window.innerWidth - .5, y: event.clientY / window.innerHeight - .5 }; };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { timeline.scrollTrigger?.kill(); timeline.kill(); window.removeEventListener('pointermove', onMove); sections.forEach((section) => section.classList.remove('story-scene')); };
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const particles = Array.from({ length: compact ? 260 : 720 }, (_, index) => ({ x: Math.random(), y: Math.random(), z: Math.random(), seed: Math.random() * 9 + index }));
    let width = 1, height = 1, dpr = 1, frame;
    const resize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); width = window.innerWidth; height = window.innerHeight; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (now) => {
      const time = now * .001; const scene = sceneRef.current; const tunnel = scene === 0 || scene === 1; const contact = scene === SCENES.length - 1;
      ctx.clearRect(0, 0, width, height); ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        const drift = Math.sin(time * .45 + p.seed) * .00018;
        p.y = (p.y + drift + .00025 * (scene + 1)) % 1;
        let x = p.x * width + pointer.current.x * p.z * 42; let y = p.y * height + pointer.current.y * p.z * 30;
        if (tunnel) { const angle = p.seed + time * .34; const radius = ((p.y + time * .07) % 1) * Math.min(width, height) * .72; x = width / 2 + Math.cos(angle) * radius; y = height / 2 + Math.sin(angle) * radius * .6; }
        if (contact) { x += (width / 2 - x) * .015; y += (height / 2 - y) * .015; }
        const alpha = .025 + p.z * .12; const size = .3 + p.z * 1.5;
        ctx.fillStyle = p.seed % 2 > 1 ? `rgba(124, 92, 255, ${alpha})` : `rgba(71, 213, 255, ${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over'; frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return <><canvas ref={canvasRef} className="story-particle-world" aria-hidden="true" /><div className="story-atmosphere" aria-hidden="true" /></>;
}
