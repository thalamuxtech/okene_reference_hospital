'use client';

import { motion } from 'framer-motion';
import { easings, durations } from '@/lib/motion';
import type { ReactNode } from 'react';

export function Stagger({
  children,
  className,
  stagger = 0.08
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: durations.slow, ease: easings.decelerate }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
