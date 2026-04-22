'use client';

// Client-side gating for the admin demo portal.
// Production must move this to Firebase Auth + custom claims + Firestore rules.

export const ADMIN_EMAIL = 'okene@referencehospital.com';
export const ADMIN_PASSWORD = 'Okene@54321';
export const ADMIN_SESSION_KEY = 'orh-admin-session';

export function signInAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ email, signedInAt: Date.now() })
      );
    }
    return true;
  }
  return false;
}

export function isAdminSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { signedInAt: number };
    return Date.now() - parsed.signedInAt < 8 * 60 * 60 * 1000; // 8 h
  } catch {
    return false;
  }
}

export function signOutAdmin() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
