'use client';

/**
 * Static-export-safe doctor profile page.
 *
 * Why this exists: `next.config.mjs` sets `output: 'export'` and
 * `firebase.json` rewrites unknown paths to `/404.html`. That means the
 * Next.js `/doctors/[id]` route only works for doctor IDs pre-rendered
 * at build time — any admin-added doctor or renamed ID (e.g. after the
 * CUSTECH rebrand) 404s on Firebase hosting.
 *
 * This route is a single static page. It reads `?id=...` from the URL
 * on the client and renders whatever doctor the patient clicked. All the
 * profile rendering logic lives in the shared client component.
 */

import { Suspense } from 'react';
import DoctorProfileClient from '../[id]/doctor-profile-client';

export default function DoctorProfileByQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="container min-h-[60vh] py-20 text-center">
          <p className="text-sm text-slate-500">Loading profile…</p>
        </div>
      }
    >
      <DoctorProfileClient />
    </Suspense>
  );
}
