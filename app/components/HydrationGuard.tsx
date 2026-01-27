"use client";

import { useEffect } from 'react';

export default function HydrationGuard() {
  useEffect(() => {
    // remove the preload marker and add a hydrated marker
    try {
      document.body.classList.remove('preload');
      document.body.classList.add('hydrated');
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  return null;
}
