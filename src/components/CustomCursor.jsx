import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMove);

    const interactables = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [isVisible]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? 44 : 32,
            height: isHovering ? 44 : 32,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      </motion.div>

      {/* Glow ring following more slowly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: useSpring(mouseX, { stiffness: 80, damping: 20 }),
          y: useSpring(mouseY, { stiffness: 80, damping: 20 }),
        }}
      >
        <motion.div
          className="rounded-full border border-cyan-400/40"
          animate={{
            width: isHovering ? 72 : 56,
            height: isHovering ? 72 : 56,
            opacity: isVisible ? 0.6 : 0,
            x: isHovering ? -20 : -12,
            y: isHovering ? -20 : -12,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{
            boxShadow: '0 0 12px rgba(0,240,255,0.25)',
          }}
        />
      </motion.div>
    </>
  );
}
