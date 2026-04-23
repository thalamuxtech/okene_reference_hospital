'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Phone } from 'lucide-react';
import { HospitalShield } from './logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/specialties', label: 'Specialties' },
  { href: '/telehealth', label: 'Telehealth' },
  { href: '/triage', label: 'AI Triage' },
  { href: '/about', label: 'About' }
];

// Routes that start on a dark hero — header renders light-on-dark until scrolled.
const DARK_HERO_ROUTES = [
  '/',
  '/telehealth',
  '/emergency',
  '/admin/login',
  '/doctor/login',
  '/arrival',
  '/triage'
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const onDarkHero = DARK_HERO_ROUTES.includes(pathname);
  const light = onDarkHero && !scrolled;

  // Oversized at rest, smoothly shrinks on scroll.
  // Mobile gets a slightly smaller hang so it still fits 360 px screens.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  const logoSize = scrolled ? (isDesktop ? 64 : 48) : isDesktop ? 124 : 84;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm'
          : light
          ? 'bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-transparent backdrop-blur-[2px]'
          : 'border-b border-slate-200/60 bg-white/70 backdrop-blur-md'
      )}
    >
      <div
        className={cn(
          'container relative flex items-center justify-between transition-all duration-500',
          scrolled ? 'h-[88px]' : 'h-28 lg:h-32'
        )}
      >
        {/* Logo slot — oversized logo hangs ~60% below the bar when at rest. */}
        <Link href="/" aria-label="Okene Reference Hospital — home" className="relative flex items-center gap-3 group">
          <motion.span
            initial={false}
            animate={{
              y: scrolled ? 0 : '30%',
              width: logoSize,
              height: logoSize
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="relative block overflow-visible"
          >
            <HospitalShield
              size={logoSize}
              className={cn(
                'h-full w-full transition-shadow duration-500',
                !scrolled && 'drop-shadow-[0_14px_30px_rgba(12,38,107,0.45)]'
              )}
            />
          </motion.span>
          <motion.span
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0.95 }}
            className="flex flex-col leading-none"
          >
            <span
              className={cn(
                'font-bold tracking-tight transition-all duration-500',
                scrolled ? 'text-[15px]' : 'text-[17px] lg:text-[19px]',
                light ? 'text-white' : 'text-slate-900'
              )}
            >
              Okene Reference
            </span>
            <span
              className={cn(
                'mt-1 font-semibold uppercase tracking-[0.22em] transition-all duration-500',
                scrolled ? 'text-[11px]' : 'text-[12px]',
                light ? 'text-primary-200' : 'text-primary-600'
              )}
            >
              Hospital
            </span>
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? light ? 'text-white' : 'text-primary-600'
                    : light ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-primary-600'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      'absolute inset-0 rounded-lg',
                      light ? 'bg-white/10' : 'bg-primary-50'
                    )}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              light ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
            )}
          >
            Sign in
          </Link>
          <Link
            href="/book"
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]',
              light
                ? 'bg-white text-slate-900 shadow-lg hover:shadow-xl'
                : 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md'
            )}
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Link>
        </div>

        <button
          aria-label="Open menu"
          className={cn(
            'rounded-lg p-2 lg:hidden',
            light ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
          )}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-200/70 bg-white lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/auth/login" className="btn-outline">
                  Sign in
                </Link>
                <Link href="/book" className="btn-primary">
                  <Calendar className="h-4 w-4" /> Book
                </Link>
              </div>
              <a
                href="tel:112"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                <Phone className="h-4 w-4" />
                Emergency · 112
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
