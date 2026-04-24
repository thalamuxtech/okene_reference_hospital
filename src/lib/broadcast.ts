'use client';

/**
 * Cross-tab sync helper. Each named channel gets one BroadcastChannel + a
 * fallback storage-event path (for browsers where BroadcastChannel is
 * unavailable).
 *
 * Stores import this to publish a 'changed' event whenever they mutate.
 * Subscribers (UI hooks, etc.) listen for that event and can force a
 * zustand rehydrate — which re-reads localStorage and rerenders.
 */
export type BroadcastMessage = {
  type: string;
  payload?: unknown;
  origin: string;
};

const ORIGIN_ID =
  typeof window === 'undefined'
    ? 'ssr'
    : `tab-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;

const channels = new Map<string, BroadcastChannel | null>();

function channel(name: string): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!('BroadcastChannel' in window)) return null;
  let c = channels.get(name);
  if (c === undefined) {
    c = new BroadcastChannel(name);
    channels.set(name, c);
  }
  return c;
}

export function publish(name: string, type: string, payload?: unknown) {
  const c = channel(name);
  const msg: BroadcastMessage = { type, payload, origin: ORIGIN_ID };
  if (c) {
    c.postMessage(msg);
  } else if (typeof window !== 'undefined') {
    // Fallback: bump a storage key so other tabs' storage-event listeners fire.
    try {
      window.localStorage.setItem(`${name}-bump`, String(Date.now()));
    } catch {
      /* ignore */
    }
  }
}

export function subscribe(
  name: string,
  handler: (msg: BroadcastMessage) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const c = channel(name);
  const onMessage = (e: MessageEvent<BroadcastMessage>) => {
    if (!e.data || e.data.origin === ORIGIN_ID) return;
    handler(e.data);
  };

  let storageHandler: ((e: StorageEvent) => void) | null = null;

  if (c) {
    c.addEventListener('message', onMessage);
  } else {
    storageHandler = (e: StorageEvent) => {
      if (e.key === `${name}-bump`) {
        handler({ type: 'changed', origin: 'storage-event' });
      }
    };
    window.addEventListener('storage', storageHandler);
  }

  return () => {
    if (c) c.removeEventListener('message', onMessage);
    if (storageHandler) window.removeEventListener('storage', storageHandler);
  };
}
