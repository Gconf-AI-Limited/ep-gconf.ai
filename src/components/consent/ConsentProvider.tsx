'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ConsentStatus = 'accepted' | 'rejected';

// DECISION: a first-party cookie (not localStorage) so the choice is a plain,
// inspectable "strictly necessary" cookie, as described in the Privacy
// Statement §10. 180 days, after which we ask again.
const CONSENT_COOKIE = 'gconf_consent';
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

interface ConsentContextValue {
  /** null until the visitor has chosen (or before the cookie has been read). */
  status: ConsentStatus | null;
  /** True once the cookie has been read on the client. */
  ready: boolean;
  settingsOpen: boolean;
  accept: () => void;
  reject: () => void;
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readConsentCookie(): ConsentStatus | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(accepted|rejected)`));
  return (match?.[1] as ConsentStatus | undefined) ?? null;
}

function writeConsentCookie(status: ConsentStatus) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${status}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setStatus(readConsentCookie());
    setReady(true);
  }, []);

  const choose = useCallback(
    (next: ConsentStatus) => {
      writeConsentCookie(next);
      setSettingsOpen(false);
      // Withdrawing consent: third-party scripts (e.g. X widgets.js) that are
      // already running can't be unloaded in place, so reload into a clean page.
      if (status === 'accepted' && next === 'rejected') {
        window.location.reload();
        return;
      }
      setStatus(next);
    },
    [status],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      ready,
      settingsOpen,
      accept: () => choose('accepted'),
      reject: () => choose('rejected'),
      openSettings: () => setSettingsOpen(true),
    }),
    [status, ready, settingsOpen, choose],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
}
