'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { easings, durations } from '@/lib/motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section' | 'article';
  className?: string;
  once?: boolean;
};

export function Reveal({ children, delay = 0, y = 16, className, once = true }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: durations.slow, ease: easings.decelerate, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
