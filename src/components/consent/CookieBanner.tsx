'use client';

import Link from 'next/link';
import { useConsent } from './ConsentProvider';

export function CookieBanner() {
  const { ready, status, settingsOpen, accept, reject } = useConsent();
  if (!ready || (status !== null && !settingsOpen)) return null;

  return (
    <section
      className="cookie-banner"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
    >
      <div className="cookie-banner-bar">
        <span className="cookie-banner-lights" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="cookie-banner-file" aria-hidden>
          consent.sh
        </span>
        {/* Closing = "continue without accepting": same as Reject, nothing extra loads. */}
        <button
          type="button"
          className="cookie-banner-close"
          onClick={reject}
          aria-label="Close and continue without accepting"
          title="Continue without accepting"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="cookie-banner-body">
        <p className="cookie-banner-prompt" aria-hidden>
          <span className="cookie-banner-sigil">$</span> gconf --privacy
          <span className="cookie-banner-caret" />
        </p>
        <p id="cookie-banner-title" className="cookie-banner-title">
          Cookies? Only if you say so.
        </p>
        <p id="cookie-banner-text" className="cookie-banner-text">
          We only use what&apos;s needed to run this site. Accept to also load embedded videos and
          posts from YouTube and X &mdash; they may set cookies and see your IP address.
        </p>

        <div className="cookie-banner-actions">
          <button type="button" className="cookie-btn" onClick={reject}>
            Reject
          </button>
          <button type="button" className="cookie-btn cookie-btn--accept" onClick={accept}>
            Accept
          </button>
        </div>

        <p className="cookie-banner-meta">
          {status ? (
            <>
              current: <strong>{status}</strong>
              <span aria-hidden> · </span>
            </>
          ) : null}
          change anytime via cookie settings
          <span aria-hidden> · </span>
          <Link href="/privacy">privacy statement →</Link>
        </p>
      </div>
    </section>
  );
}
