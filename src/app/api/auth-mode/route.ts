import { NextResponse } from 'next/server';
import { getAuthMode, getTenantApiKey, isSiteApiKey } from '@/lib/tenant';

/**
 * Machine-readable auth-mode check for production verification.
 * Does not expose the key — only which kind is in use.
 */
export async function GET() {
  const mode = await getAuthMode();
  const key = await getTenantApiKey();
  return NextResponse.json({
    mode,
    isSiteKey: isSiteApiKey(key),
    keyPrefix: key ? key.slice(0, 8) : null,
  });
}
