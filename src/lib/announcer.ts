'use client';

/**
 * Shared queue announcer.
 *
 * Format (spoken):
 *   "Ticket G-123, please proceed to counter 2."
 * Digits in the ticket number are spelled individually so the PA system
 * reads "G dash one two three" rather than "G dash one hundred twenty three".
 *
 * Voice selection priority (first match wins):
 *   1. en-NG   (Nigerian English — ideal)
 *   2. en-ZA / en-GH / en-KE  (other African English)
 *   3. en-GB   (closest Commonwealth fallback)
 *   4. any en-*
 *   5. default
 *
 * Speech voices load asynchronously in some browsers. We listen for
 * `voiceschanged` and cache the best match on first play.
 */

const AFRICAN_LANG_PRIORITY = ['en-NG', 'en-ZA', 'en-GH', 'en-KE'];

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  for (const lang of AFRICAN_LANG_PRIORITY) {
    const match = voices.find(
      (v) => v.lang?.toLowerCase() === lang.toLowerCase()
    );
    if (match) return match;
  }

  // Prefer female voice when only en-GB is available — tends to sound warmer.
  const gb = voices.find((v) => v.lang?.toLowerCase() === 'en-gb');
  if (gb) return gb;

  const anyEn = voices.find((v) => v.lang?.toLowerCase().startsWith('en'));
  return anyEn ?? voices[0] ?? null;
}

export function ensureVoicesReady(onReady?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const tryPick = () => {
    const v = pickVoice();
    if (v) {
      cachedVoice = v;
      onReady?.();
    }
  };
  tryPick();
  window.speechSynthesis.addEventListener?.('voiceschanged', tryPick);
}

export function formatTicketAnnouncement(
  ticketNumber: string,
  counterNumber?: number
): string {
  // Preserve the hyphen as a pause: "G-123" => "G, 1 2 3"
  const [prefix, digits = ''] = ticketNumber.split('-');
  const spelled = digits.split('').join(' ');
  const counterTxt = counterNumber ? `please proceed to counter ${counterNumber}` : 'please proceed to the counter';
  return `Ticket ${prefix} ${spelled}, ${counterTxt}.`;
}

/**
 * Speak the ticket announcement. Returns true if queued; false if speech
 * isn't available (headless, unsupported browser, muted).
 */
export function announceTicket(
  ticketNumber: string,
  counterNumber?: number,
  opts: { rate?: number; repeat?: number } = {}
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  if (!cachedVoice) ensureVoicesReady();

  const text = formatTicketAnnouncement(ticketNumber, counterNumber);
  const { rate = 0.92, repeat = 1 } = opts;

  // A short ding first so staff know a call is coming.
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 988; // B5
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close().catch(() => {}), 800);
    }
  } catch {
    /* ignore – chime is optional */
  }

  // Speak after the chime.
  setTimeout(() => {
    for (let i = 0; i < repeat; i++) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = cachedVoice?.lang ?? 'en-NG';
      if (cachedVoice) u.voice = cachedVoice;
      u.rate = rate;
      u.pitch = 1;
      if (i > 0) {
        // Short gap between repeats by issuing a tiny silent utterance.
        const gap = new SpeechSynthesisUtterance(' ');
        gap.rate = 1;
        window.speechSynthesis.speak(gap);
      }
      window.speechSynthesis.speak(u);
    }
  }, 520);
  return true;
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}
