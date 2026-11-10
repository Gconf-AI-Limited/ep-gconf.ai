'use client';

import type { ReactNode } from 'react';
import { useConsent } from './ConsentProvider';

interface Props {
  /** Third party that serves the content, e.g. "YouTube" or "X". */
  provider: string;
  /** Optional direct link so the content can be viewed without consenting. */
  href?: string;
  children: ReactNode;
}

/**
 * Renders third-party embedded content only after cookie consent. Until then
 * (including during SSR and before the consent cookie is read) a placeholder
 * is shown, so no request reaches the third party.
 */
export function ConsentGate({ provider, href, children }: Props) {
  const { status, accept } = useConsent();
  if (status === 'accepted') return <>{children}</>;

  return (
    <div className="consent-gate">
      <p className="consent-gate-text">
        This content is hosted by <strong>{provider}</strong>. Loading it lets {provider} set
        cookies and receive your IP address.
      </p>
      <div className="consent-gate-actions">
        <button type="button" className="cookie-btn cookie-btn--accept" onClick={accept}>
          Accept cookies &amp; load
        </button>
        {href ? (
          <a className="consent-gate-link" href={href} target="_blank" rel="noopener noreferrer">
            Open on {provider} ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
