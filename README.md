# Okene Reference Hospital — Medical Management System

A premium, mobile-first Medical Management System for Okene Reference Hospital, serving the Kogi Central community with appointment booking, telehealth, AI triage, emergency response, and offline SMS/USSD access.

**Live:** https://okenereferencehospital.web.app
**Repo:** https://github.com/thalamuxtech/okene_reference_hospital

---

## Stack

- **Framework:** Next.js 14 (App Router) · React 18 · TypeScript
- **Styling:** Tailwind CSS, shadcn-style primitives, CSS variables
- **Animation:** Framer Motion 11 — parallax hero, staggered reveals, layout transitions, SVG path-draw success states, press-and-hold SOS, animated stat counters
- **Forms:** React Hook Form + Zod
- **Backend:** Firebase (Auth · Firestore · Storage · Hosting · Messaging · Analytics)
- **SMS / USSD / Voice:** Africa's Talking (webhooks via Cloud Functions)
- **Telehealth:** Agora RTC (token minted from Cloud Function)

## Features Implemented

### Landing & marketing
- Premium hero with parallax, animated orbs, SVG underline, floating feature badges
- Stat counter animation (springs) on scroll
- Features grid, specialties grid, how-it-works, testimonials, CTA banner
- Scroll progress bar, sticky blurred header with active-link shared-layout pill
- 24/7 emergency dock button with pulse-ring

### Clinical journeys
- Doctors directory with filters (specialty, telehealth, search)
- Doctor profile with sticky booking card, tabbed About/Availability/Reviews (`layoutId` sliding indicator)
- 5-step booking wizard with animated stepper, date/time picker, real-time slot availability, animated success screen (SVG path-draw + spring)
- Patient dashboard with upcoming appointments, health trends, quick actions, recent activity
- Telehealth landing + live-session simulation (PIP, controls, chat drawer, encryption badge)
- AI Triage chat with urgency classification cards (EMERGENCY / URGENT / ROUTINE) and typing-dots animation
- Emergency page with press-and-hold SOS button (progress ring), radial gradient background, ambient orbs

### Auth
- Phone + OTP login with 6-input code UI
- 3-step registration wizard (identity → contact → health) with animated stepper and success card with generated patient ID

### Supporting
- Specialties, About, Privacy, Terms, 404, loading states, PWA manifest, icon

## Motion & UX Language

- All animations respect `prefers-reduced-motion: reduce`
- Easing tokens: `[0.4, 0, 0.2, 1]` standard, `[0, 0, 0.2, 1]` decelerate, `[0.4, 0, 1, 1]` accelerate
- Durations: instant 120 ms · fast 200 ms · base 280 ms · slow 450 ms · hero 700 ms
- Patterns: fade-up, stagger container, scale-in, shared layout, parallax, counter springs, path-draw success, press-and-hold progress ring
- Mobile-first: sheet patterns, thumb-zone CTAs, bottom emergency dock, 44×44 touch targets

## Getting Started

### Prerequisites
- Node.js 20+
- `pnpm`, `npm`, or `yarn`
- Firebase CLI (`npm i -g firebase-tools`)

### Install & run

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
npm run start
```

### Deploy to Firebase Hosting

```bash
firebase login
firebase use okenereferencehospital
firebase deploy --only hosting
```

(Functions, Firestore rules, and Storage rules are in the repo root — deploy with `firebase deploy`.)

## Project Structure

```
app/
├── firebase.json            # Firebase config
├── firestore.rules          # Role-based access control
├── firestore.indexes.json   # Composite indexes
├── storage.rules
├── .firebaserc              # Default project: okenereferencehospital
├── tailwind.config.ts
├── src/
│   ├── app/                 # Next.js routes
│   │   ├── page.tsx         # Landing
│   │   ├── doctors/         # Directory + profile
│   │   ├── book/            # 5-step wizard
│   │   ├── auth/            # Login + register
│   │   ├── dashboard/       # Patient dashboard
│   │   ├── triage/          # AI triage chat
│   │   ├── telehealth/      # Landing + demo session
│   │   ├── emergency/       # SOS
│   │   ├── specialties/
│   │   ├── about/
│   │   └── ...
│   ├── components/
│   │   ├── layout/          # Header, footer, logo, dock
│   │   ├── motion/          # Reveal, Stagger, ScrollProgress
│   │   ├── ui/              # Button, Card, Input, Badge, Section
│   │   ├── home/            # Hero, Features, Doctors, etc.
│   │   ├── doctor-card.tsx
│   │   ├── specialty-card.tsx
│   │   └── stat-counter.tsx
│   └── lib/
│       ├── firebase.ts
│       ├── motion.ts
│       ├── seed-data.ts     # Demo doctors, specialties, slots
│       └── utils.ts
└── public/
    ├── icon.svg
    └── robots.txt
```

## Integrations (pending backend wiring)

The UI is ready; plug the following into `src/lib/firebase.ts` + server functions:

- Firebase Auth — phone OTP (`signInWithPhoneNumber`)
- Firestore — `appointments`, `doctors`, `patients`, `queueEntries`, `triageAssessments`
- Africa's Talking — SMS send, USSD webhook, Voice (see `/plan/02_Clinical_Systems_and_Infrastructure.md`)
- Agora — token minting in a Cloud Function; see telehealth spec
- OpenAI GPT-4o — `/api/triage` route for AI assessment

## License

Proprietary — © Okene Reference Hospital 2026.
