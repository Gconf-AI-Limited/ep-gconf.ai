import { getAuthMode, type AuthMode } from '@/lib/tenant';

const LABELS: Record<AuthMode, string> = {
  site: 'auth: site key',
  tenant: 'auth: tenant key',
  missing: 'auth: missing',
};

const COLORS: Record<AuthMode, { bg: string; fg: string; border: string }> = {
  site: { bg: 'rgba(0, 176, 194, 0.15)', fg: '#00B0C2', border: 'rgba(0, 176, 194, 0.45)' },
  tenant: { bg: 'rgba(245, 158, 11, 0.15)', fg: '#F59E0B', border: 'rgba(245, 158, 11, 0.45)' },
  missing: { bg: 'rgba(239, 68, 68, 0.15)', fg: '#EF4444', border: 'rgba(239, 68, 68, 0.45)' },
};

/**
 * Fixed corner badge showing whether production is authenticating with
 * GCONF_SITE_KEY (sk_site_…) or the tenant API key. Temporary verification aid.
 */
export async function AuthModeBadge() {
  const mode = await getAuthMode();
  const colors = COLORS[mode];

  return (
    <div
      data-auth-mode={mode}
      title="Which ep-api credential this deploy is using"
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 9999,
        padding: '6px 10px',
        borderRadius: 6,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        color: colors.fg,
        fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.04em',
        lineHeight: 1,
        pointerEvents: 'none',
        backdropFilter: 'blur(6px)',
      }}
    >
      {LABELS[mode]}
    </div>
  );
}
