export const easings = {
  standard: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],
  emphasized: [0.2, 0.0, 0, 1] as [number, number, number, number]
};

export const durations = {
  instant: 0.12,
  fast: 0.2,
  base: 0.28,
  slow: 0.45,
  hero: 0.7
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.decelerate } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.base, ease: easings.standard } }
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: durations.base, ease: easings.decelerate } }
};
