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
  ChevronDown
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const d = getCurrentDoctor();
    if (!d) {
      router.replace('/doctor/login');
      return;
    }
    setDoctor(d);
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 lg:px-8">
          <Link href="/doctor" className="flex flex-shrink-0 items-center gap-3 py-3">
            <HospitalShield size={52} className="h-13 w-13" />
            <div className="hidden leading-none lg:block">
              <p className="text-sm font-bold tracking-tight text-slate-900">Okene Reference</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-600">
                Doctor Portal
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 overflow-x-auto scrollbar-hide lg:flex">
            {NAV.map((n) => (
              <TopNavLink key={n.href} {...n} active={pathname === n.href} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2 transition-colors hover:border-primary-300 hover:bg-slate-50"
              >
                <Image
                  src={doctor.photoURL}
                  alt={doctor.firstName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
                <span className="hidden text-xs font-semibold text-slate-700 sm:inline">
                  {doctor.title ?? 'Dr.'} {doctor.lastName}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="border-b border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {doctor.department}
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/doctor/profile"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Settings className="h-4 w-4" />
                        My profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/60">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2 text-xs text-slate-500 lg:px-8">
            <span>Doctor</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900">{title}</span>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed inset-x-0 top-0 z-50 max-h-[90vh] overflow-y-auto rounded-b-3xl bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <Link href="/doctor" className="flex items-center gap-2">
                  <HospitalShield size={36} className="h-9 w-9" />
                  <span className="text-sm font-bold text-slate-900">Doctor</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="grid grid-cols-2 gap-2 p-3">
                {NAV.map((n) => {
                  const active = pathname === n.href;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium',
                        active
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <n.icon className="h-4 w-4 flex-shrink-0" />
                      {n.label}
                    </Link>
                  );
                })}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
  );
}

function TopNavLink({
  href,
  icon: Icon,
  label,
  active
}: {
  href: string;
  icon: any;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active ? 'text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {active && (
        <motion.span
          layoutId="doctor-top-nav"
          className="absolute inset-0 rounded-lg bg-primary-50"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={cn('relative h-4 w-4', active ? 'text-primary-600' : 'text-slate-400')} />
      <span className="relative">{label}</span>
    </Link>
  );
}
