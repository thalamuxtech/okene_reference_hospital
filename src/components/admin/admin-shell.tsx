'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Users,
  ListOrdered,
  Siren,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Ticket,
  ChevronDown
} from 'lucide-react';
import { HospitalShield } from '@/components/layout/logo';
import { isAdminSignedIn, signOutAdmin, ADMIN_EMAIL } from '@/lib/admin-auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/admin/appointments', icon: CalendarDays, label: 'Appointments' },
  { href: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { href: '/admin/patients', icon: Users, label: 'Patients' },
  { href: '/admin/queue', icon: ListOrdered, label: 'Queue' },
  { href: '/admin/emergencies', icon: Siren, label: 'Emergencies' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' }
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (!isAdminSignedIn()) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  function logout() {
    signOutAdmin();
    router.replace('/admin/login');
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top menu bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 lg:px-8">
          {/* Brand */}
          <Link href="/admin" className="flex flex-shrink-0 items-center gap-3 py-3">
            <HospitalShield size={52} className="h-13 w-13" />
            <div className="hidden leading-none lg:block">
              <p className="text-sm font-bold tracking-tight text-slate-900">
                Okene Reference
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-600">
                Admin Portal
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-1 overflow-x-auto scrollbar-hide lg:flex">
            {NAV.map((n) => (
              <TopNavLink key={n.href} {...n} active={pathname === n.href} />
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search…"
                className="h-10 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none xl:w-64"
              />
            </div>

            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Account menu */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2 transition-colors hover:border-primary-300 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-[11px] font-bold text-white">
                  OA
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
                    className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="border-b border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Signed in as
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {ADMIN_EMAIL}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Breadcrumb strip */}
        <div className="border-t border-slate-100 bg-slate-50/60">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2 text-xs text-slate-500 lg:px-8">
            <span>Admin</span>
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
                <Link href="/admin" className="flex items-center gap-2">
                  <HospitalShield size={36} className="h-9 w-9" />
                  <span className="text-sm font-bold text-slate-900">Admin</span>
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
          {children}
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
          layoutId="admin-top-nav"
          className="absolute inset-0 rounded-lg bg-primary-50"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={cn('relative h-4 w-4', active ? 'text-primary-600' : 'text-slate-400')} />
      <span className="relative">{label}</span>
    </Link>
  );
}
