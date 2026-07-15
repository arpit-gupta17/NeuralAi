import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  'Booting Neurall...',
  'Initializing Neural Engine...',
  'Connecting Quantum Matrix...',
  'Loading Intelligence...',
  'Verifying Neural Pathways...',
  'Access Granted',
];

const INTRO_DURATION = 9400;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function BootCanvas({ progress }) {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const count = compact ? 360 : 950;
    const particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002, vy: (Math.random() - 0.5) * 0.0002,
      seed: Math.random() * Math.PI * 2, index,
    }));
    let frame;
    let width = 1;
    let height = 1;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event) => { pointer.current = { x: event.clientX, y: event.clientY }; };

    const draw = (now) => {
      const seconds = now / 1000;
      const stage = progress.current;
      context.fillStyle = '#000105';
      context.fillRect(0, 0, width, height);

      // A low-cost aurora gives depth before the network becomes visible.
      if (stage > 0.25) {
        const haze = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.55);
        haze.addColorStop(0, `rgba(48, 59, 190, ${Math.min(0.16, (stage - 0.25) * 0.22)})`);
        haze.addColorStop(0.45, 'rgba(25, 14, 72, 0.05)');
        haze.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = haze;
        context.fillRect(0, 0, width, height);
      }

      const isNetwork = stage > 0.31 && stage < 0.79;
      const isFormation = stage >= 0.55;
      const cx = width / 2;
      const cy = height / 2;
      const positions = [];
      const collapse = Math.min(1, Math.max(0, (stage - 0.52) / 0.24));

      for (const particle of particles) {
        const waveX = Math.sin(seconds * 0.48 + particle.seed + particle.y * 8) * 0.00016;
        const waveY = Math.cos(seconds * 0.37 + particle.seed + particle.x * 8) * 0.00016;
        particle.vx += waveX;
        particle.vy += waveY;
        particle.vx *= 0.988;
        particle.vy *= 0.988;
        particle.x = (particle.x + particle.vx + 1) % 1;
        particle.y = (particle.y + particle.vy + 1) % 1;

        let x = particle.x * width;
        let y = particle.y * height;
        const dx = x - pointer.current.x;
        const dy = y - pointer.current.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (isNetwork && distance < 155) {
          const force = (155 - distance) / 155;
          x += (dx / distance) * force * 52;
          y += (dy / distance) * force * 52;
        }
        if (isFormation) {
          const angle = Math.atan2(y - cy, x - cx) + collapse * 5.4;
          const radius = Math.hypot(x - cx, y - cy) * (1 - collapse * 0.94);
          x = cx + Math.cos(angle) * radius;
          y = cy + Math.sin(angle) * radius * 0.72;
        }
        positions.push({ x, y, z: particle.z, seed: particle.seed });
      }

      if (isNetwork) {
        context.lineWidth = 0.45;
        for (let i = 0; i < positions.length; i += 3) {
          const a = positions[i];
          for (let j = i + 3; j < Math.min(i + 54, positions.length); j += 3) {
            const b = positions[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 74) {
              context.strokeStyle = `rgba(86, 128, 255, ${(1 - distance / 74) * 0.14})`;
              context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
            }
          }
        }
      }

      for (const particle of positions) {
        const alpha = isNetwork ? 0.26 + particle.z * 0.42 : 0.06 + particle.z * 0.12;
        const radius = 0.45 + particle.z * 1.35;
        context.fillStyle = particle.seed > 4.2 ? `rgba(194, 142, 255, ${alpha})` : `rgba(120, 224, 255, ${alpha})`;
        context.beginPath(); context.arc(particle.x, particle.y, radius, 0, Math.PI * 2); context.fill();
      }

      if (stage > 0.53 && stage < 0.84) {
        const strength = Math.min(1, (stage - 0.53) * 5);
        const core = context.createRadialGradient(cx, cy, 0, cx, cy, 190 + Math.sin(seconds * 2.1) * 8);
        core.addColorStop(0, `rgba(232, 249, 255, ${0.92 * strength})`);
        core.addColorStop(0.12, `rgba(66, 204, 255, ${0.72 * strength})`);
        core.addColorStop(0.44, `rgba(103, 62, 255, ${0.24 * strength})`);
        core.addColorStop(1, 'rgba(11, 5, 42, 0)');
        context.fillStyle = core;
        context.beginPath(); context.arc(cx, cy, 210, 0, Math.PI * 2); context.fill();
        context.strokeStyle = `rgba(156, 224, 255, ${0.4 * strength})`;
        context.lineWidth = 1;
        context.beginPath(); context.arc(cx, cy, 66 + Math.sin(seconds * 2.1) * 5, 0, Math.PI * 2); context.stroke();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, [progress]);

  return <canvas ref={canvasRef} className="boot-canvas" aria-hidden="true" />;
}

function typedLines(elapsed) {
  const startedAt = 1100;
  const characterDelay = 28;
  const linePause = 225;
  let clock = elapsed - startedAt;
  if (clock < 0) return [];
  const lines = [];
  for (const line of BOOT_LINES) {
    const available = Math.max(0, Math.min(line.length, Math.floor(clock / characterDelay)));
    lines.push(line.slice(0, available));
    if (available < line.length) break;
    clock -= line.length * characterDelay + linePause;
  }
  return lines;
}

export default function LoadingScreen({ onComplete }) {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    if (reducedMotion) { onComplete(); return undefined; }
    const started = performance.now();
    let frame;
    const tick = (now) => {
      const value = Math.min(now - started, INTRO_DURATION);
      progress.current = value / INTRO_DURATION;
      setElapsed(value);
      if (value < INTRO_DURATION) frame = requestAnimationFrame(tick);
      else { setExiting(true); window.setTimeout(onComplete, 420); }
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); };
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;
  const terminalLines = typedLines(elapsed);
  const showTerminal = elapsed >= 900 && elapsed < 4300;
  const showLogo = elapsed >= 7200;
  const flash = elapsed >= 9000;

  return (
    <div className={`boot-loader ${exiting ? 'boot-loader--exit' : ''}`} aria-label="Neurall is starting">
      <BootCanvas progress={progress} />
      <div className="boot-vignette" />
      <div className="boot-scanlines" />
      {elapsed >= 500 && elapsed < 1250 && <div className="boot-pixel" />}

      <div className={`boot-terminal ${showTerminal ? 'boot-terminal--visible' : ''}`}>
        <div className="boot-terminal__chrome"><span /><span /><span /><b>NEURALL / CORE</b></div>
        <div className="boot-terminal__body">
          {terminalLines.map((line, index) => <p key={`${line}-${index}`}><span>&gt;</span> {line}{index === terminalLines.length - 1 && <i />}</p>)}
        </div>
      </div>

      <div className={`boot-logo ${showLogo ? 'boot-logo--visible' : ''}`}>
        <span className="boot-logo__mark">N</span><span>NEURALL</span>
        <small>INTELLIGENCE, AWAKE</small>
      </div>
      <div className={`boot-flash ${flash ? 'boot-flash--active' : ''}`} />
    </div>
  );
}
