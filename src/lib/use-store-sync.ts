'use client';

import { useEffect } from 'react';
import { subscribe } from './broadcast';

/**
 * Subscribe the caller to cross-tab updates for the given channel name.
 * When any other tab publishes on `name`, the supplied `rehydrate` fn
 * runs (typically store.persist.rehydrate()) so we re-read localStorage
 * and trigger a React rerender.
 */
export function useStoreSync(name: string, rehydrate: () => void) {
  useEffect(() => {
    const unsub = subscribe(name, () => {
      try {
        rehydrate();
      } catch {
        /* ignore */
      }
    });
    return unsub;
  }, [name, rehydrate]);
}
