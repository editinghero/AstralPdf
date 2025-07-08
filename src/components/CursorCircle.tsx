import { useEffect, useState } from 'react';

export default function CursorCircle() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{ left: pos.x, top: pos.y }}
      className="fixed pointer-events-none w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-30 blur-2xl transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
    />
  );
} 