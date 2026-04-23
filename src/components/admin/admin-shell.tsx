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
  ChevronLeft,
  Ticket,
  PanelLeftClose,
  PanelLeftOpen
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

const COLLAPSED_KEY = 'orh-admin-sidebar-collapsed';

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAdminSignedIn()) {
      router.replace('/admin/login');
      return;
    }
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1');
    } catch {}
    setReady(true);
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

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-64';
  const mainPadding = collapsed ? 'lg:pl-[72px]' : 'lg:pl-64';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar — desktop */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-200 bg-white lg:flex'
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-slate-200', collapsed ? 'justify-center px-3' : 'px-5')}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <span className="block transition-transform group-hover:scale-105">
              <HospitalShield size={44} className="h-11 w-11" />
            </span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden leading-none"
                >
                  <span className="text-[13px] font-bold tracking-tight text-slate-900">
                    Okene Reference
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary-600">
                    Admin Portal
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <NavLink
              key={n.href}
              {...n}
              active={pathname === n.href}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3 space-y-2">
          <button
            onClick={toggleCollapsed}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100',
              collapsed && 'justify-center'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
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
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-navy-500 text-xs font-bold text-white">
                OA
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">Okene Admin</p>
                <p className="truncate text-[11px] text-slate-500">{ADMIN_EMAIL}</p>
              </div>
            </motion.div>
          )}

          <button
            onClick={logout}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700',
              collapsed && 'justify-center'
            )}
            aria-label="Sign out"
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
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <Link href="/admin" className="flex items-center gap-2">
                  <HospitalShield size={36} className="h-9 w-9" />
                  <span className="text-sm font-bold text-slate-900">Admin</span>
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

      {/* Main */}
      <div className={cn('transition-[padding] duration-300', mainPadding)}>
        {/* Topbar */}
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
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Admin</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-slate-900">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search patients, doctors, appointments…"
                className="h-10 w-72 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
          layoutId="admin-nav"
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
