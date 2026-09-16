import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor } from '../context/CursorContext';

export function CustomCursor() {
  const { cursorType, cursorText } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const isDraggingCanvasRef = useRef(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth cursor follow with spring physics
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      setIsEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updateEnabled();
    finePointer.addEventListener('change', updateEnabled);
    reducedMotion.addEventListener('change', updateEnabled);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements (links, buttons, controls)
      const target = e.target;
      const interactiveEl = target?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [tabindex="0"]'
      );
      setIsInteractive(Boolean(interactiveEl));

      // Check if hovering over 3D canvas
      const canvasEl = target?.closest('canvas');
      setIsOverCanvas(Boolean(canvasEl));
    };

    const handleMouseDown = (e) => {
      if (e.target?.closest('canvas')) {
        isDraggingCanvasRef.current = true;
        setIsDraggingCanvas(true);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingCanvasRef.current) {
        isDraggingCanvasRef.current = false;
        setIsDraggingCanvas(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsInteractive(false);
      setIsOverCanvas(false);
      setIsDraggingCanvas(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      finePointer.removeEventListener('change', updateEnabled);
      reducedMotion.removeEventListener('change', updateEnabled);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isEnabled || !isVisible) return null;

  const isView = cursorType === 'view';
  const shouldHide = isOverCanvas || isDraggingCanvas;

  let cursorSize = 12;
  if (isView) {
    cursorSize = 80;
  } else if (isInteractive) {
    cursorSize = 40;
  }

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: cursorSize,
        height: cursorSize,
        opacity: shouldHide ? 0 : 1,
        backgroundColor: '#FFFFFF',
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      {isView && !shouldHide && (
        <span className="font-mono text-[11px] font-bold text-black tracking-tight select-none">
          {cursorText || 'View ↗'}
        </span>
      )}
    </motion.div>
  );
}

export default CustomCursor;
