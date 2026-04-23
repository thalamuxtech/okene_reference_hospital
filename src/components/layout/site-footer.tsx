import Link from 'next/link';
import { Logo } from './logo';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-gradient-to-b from-white to-slate-50">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo size={88} wordmarkSize="lg" />
            <p className="mt-5 max-w-xs text-sm text-slate-600">
              A modern medical platform built for the Kogi Central community. Online, offline, and
              accessible to all.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Care</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="/doctors" className="hover:text-primary-600">Find a doctor</Link></li>
              <li><Link href="/specialties" className="hover:text-primary-600">Specialties</Link></li>
              <li><Link href="/book" className="hover:text-primary-600">Book appointment</Link></li>
              <li><Link href="/telehealth" className="hover:text-primary-600">Telehealth</Link></li>
              <li><Link href="/triage" className="hover:text-primary-600">AI triage</Link></li>
              <li><Link href="/arrival" className="hover:text-primary-600">Get queue ticket</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Patients</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="/auth/register" className="hover:text-primary-600">Register</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary-600">Sign in</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary-600">Patient dashboard</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">About us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                <span>Okene, Kogi State, Nigeria</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                <a href="tel:+2348000000000" className="hover:text-primary-600">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                <a href="mailto:care@okenehospital.ng" className="hover:text-primary-600">
                  care@okenehospital.ng
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Emergency hotline
              </p>
              <a href="tel:112" className="mt-1 block text-lg font-bold text-red-700">
                112 · 24/7
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-4 border-t border-slate-200/70 pt-8 text-xs text-slate-500 md:grid-cols-3">
          <p className="md:text-left">© {new Date().getFullYear()} Okene Reference Hospital. All rights reserved.</p>

          <div className="flex items-center justify-center gap-2">
            <Link
              href="/doctor/login"
              aria-label="Doctor portal"
              title="Doctor portal"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Doctor portal</span>
            </Link>
            <Link
              href="/admin/login"
              aria-label="Admin portal"
              title="Admin portal"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin portal</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-4 md:justify-end">
            <Link href="/privacy" className="hover:text-primary-600">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-600">Terms</Link>
            <span>NDPR compliant · HIPAA-aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
