'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export function EmergencyDock() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.a
      href="tel:112"
      aria-label="Emergency hotline"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 animate-pulse-ring md:bottom-6 md:right-6"
    >
      <Phone className="h-4 w-4" />
      <span className="hidden sm:inline">Emergency</span>
      <span className="font-mono">112</span>
    </motion.a>
  );
}
