import Link from 'next/link';
import { Logo } from './logo';
import { Phone, Mail, MapPin, ShieldCheck, Linkedin } from 'lucide-react';
import type { SVGProps } from 'react';

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.7-1.6h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.9V14h2.7v8h2.9z" />
    </svg>
  );
}
function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.53 3H20.6l-6.7 7.66L22 21h-6.18l-4.84-6.34L5.4 21H2.33l7.17-8.19L2 3h6.33l4.38 5.79L17.53 3zm-1.08 16.2h1.7L7.64 4.7H5.82L16.45 19.2z" />
    </svg>
  );
}
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.7 2 12 2 12s0 3.3.4 4.8c.2.9.9 1.6 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.8.4-4.8s0-3.3-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}

const SOCIALS = [
  { href: 'https://facebook.com/custechth', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://x.com/custechth', label: 'X (Twitter)', Icon: XIcon },
  { href: 'https://instagram.com/custechth', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://linkedin.com/company/custechth', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://youtube.com/@custechth', label: 'YouTube', Icon: YoutubeIcon }
];

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
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-md"
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
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
                <span>Itakpe Road, Okene 263101, Kogi State, Nigeria</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                <a href="tel:+2347069507035" className="hover:text-primary-600">
                  +234-706-950-7035
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
          <p className="md:text-left">© {new Date().getFullYear()} CUSTECH Teaching Hospital, Okene. All rights reserved.</p>

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
