import { headers } from 'next/headers';

// Prefer server-only keys. NEXT_PUBLIC_* is kept as a migration fallback —
// it is inlined into the client bundle, so rotate away from it once Vercel
// has GCONF_SITE_KEY / GCONF_API_KEY set.
const DEFAULT_API_KEY =
  process.env.GCONF_SITE_KEY ||
  process.env.NEXT_PUBLIC_GCONF_SITE_KEY ||
  process.env.GCONF_API_KEY ||
  process.env.NEXT_PUBLIC_GCONF_API_KEY ||
  '';

export type AuthMode = 'site' | 'tenant' | 'missing';

export function isSiteApiKey(key: string): boolean {
  return key.startsWith('sk_site_');
}

/**
 * Get the tenant/site API key for the current request.
 * Reads from x-tenant-api-key header (set by middleware) or falls back to env.
 */
export async function getTenantApiKey(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-tenant-api-key') || DEFAULT_API_KEY;
}

/** Which credential the site is actually using for ep-api calls. */
export async function getAuthMode(): Promise<AuthMode> {
  const key = await getTenantApiKey();
  if (!key) return 'missing';
  return isSiteApiKey(key) ? 'site' : 'tenant';
}

export async function getCompanyDetailsApiPath(): Promise<string> {
  const key = await getTenantApiKey();
  return isSiteApiKey(key)
    ? '/site/company-details'
    : '/settings/public/app-details';
}
