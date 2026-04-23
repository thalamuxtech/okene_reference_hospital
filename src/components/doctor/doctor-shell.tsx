'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ClipboardList,
  Bell,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { HospitalShield } from '@/components/layout/logo';
import { getCurrentDoctor, signOutDoctor } from '@/lib/doctor-auth';
import type { Doctor } from '@/lib/seed-data';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/doctor/queue', icon: ClipboardList, label: 'My Queue' },
  { href: '/doctor/records', icon: FileText, label: 'Medical Records' },
  { href: '/doctor/patients', icon: Users, label: 'Patients' },
  { href: '/doctor/profile', icon: Settings, label: 'Profile' }
];

const COLLAPSED_KEY = 'orh-doctor-sidebar-collapsed';

export function DoctorShell({
  children,
  title
}: {
  children: (doctor: Doctor) => ReactNode;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const d = getCurrentDoctor();
    if (!d) {
      router.replace('/doctor/login');
      return;
    }
    setDoctor(d);
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1');
    } catch {}
  }, [router]);

  useEffect(() => {
    setMobile(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  }

  function logout() {
    signOutDoctor();
    router.replace('/doctor/login');
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
      </div>
    );
  }

  const mainPadding = collapsed ? 'lg:pl-[76px]' : 'lg:pl-72';

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 288 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-200 bg-white lg:flex"
      >
        <div
          className={cn(
            'flex h-20 items-center border-b border-slate-200',
            collapsed ? 'justify-center px-3' : 'px-5'
          )}
        >
          <Link href="/doctor" className="group flex items-center gap-3">
            <HospitalShield size={52} className="h-13 w-13 transition-transform group-hover:scale-105" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden leading-none"
                >
                  <span className="text-sm font-bold tracking-tight text-slate-900">
                    Okene Reference
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-600">
                    Doctor Portal
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} collapsed={collapsed} />
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-200 p-3">
          <button
            onClick={toggleCollapsed}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100',
              collapsed && 'justify-center'
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
            >
              <Image
                src={doctor.photoURL}
                alt={doctor.firstName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                unoptimized
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {doctor.title ?? 'Dr.'} {doctor.lastName}
                </p>
                <p className="truncate text-[11px] text-slate-500">{doctor.department}</p>
              </div>
            </motion.div>
          )}

          <button
            onClick={logout}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="h-4 w-4" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobile(false)}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white lg:hidden"
            >
              <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
                <Link href="/doctor" className="flex items-center gap-2">
                  <HospitalShield size={44} className="h-11 w-11" />
                  <span className="text-sm font-bold text-slate-900">Doctor</span>
                </Link>
                <button
                  onClick={() => setMobile(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {NAV.map((n) => (
                  <NavLink key={n.href} {...n} active={pathname === n.href} collapsed={false} />
                ))}
              </nav>
              <div className="border-t border-slate-200 p-3">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn('transition-[padding] duration-300', mainPadding)}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setMobile(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={toggleCollapsed}
            className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Doctor</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-slate-900">{title}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
              <Image
                src={doctor.photoURL}
                alt={doctor.firstName}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
                unoptimized
              />
              <span className="hidden text-xs font-semibold text-slate-700 sm:inline">
                {doctor.title ?? 'Dr.'} {doctor.lastName}
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {children(doctor)}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed
}: {
  href: string;
  icon: any;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
        collapsed && 'justify-center px-2',
        active
          ? 'bg-gradient-to-r from-primary-50 to-transparent text-primary-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      )}
    >
      {active && (
        <motion.span
          layoutId="doctor-nav"
          className="absolute inset-y-1 left-0 w-1 rounded-full bg-primary-500"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          'h-4 w-4 flex-shrink-0',
          active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
        )}
      />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
