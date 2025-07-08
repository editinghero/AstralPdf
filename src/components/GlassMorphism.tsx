import React from 'react';
import { motion } from 'framer-motion';

interface GlassMorphismProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  initial?: any;
  animate?: any;
  exit?: any;
}

export default function GlassMorphism({
  children,
  className = '',
  as = 'div',
  initial,
  animate,
  exit,
}: GlassMorphismProps) {
  // Cast to a generic component type to simplify prop types
  const Component = (motion[as as keyof typeof motion] || motion.div) as React.ComponentType<any>;
  
  // extract className to avoid complex union type error
  const classes = `bg-black/20 backdrop-blur-xl border border-white/5 shadow-lg ${className}`;
  
  return (
    <Component 
    className={classes}
      initial={initial}
      animate={animate}
      exit={exit}
    >
      {children}
    </Component>
  );
} 