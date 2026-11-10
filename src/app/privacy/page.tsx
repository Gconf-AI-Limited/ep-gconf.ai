import { LegalPage, generateLegalMetadata } from '@/components/legal/LegalPage';
import type { LegalPageConfig } from '@/components/legal/LegalPage';

export const revalidate = 60;

const CONFIG: LegalPageConfig = {
  cmsSlug: 'privacy-statement',
  seoKey: 'privacy',
  fallbackTitle: 'Privacy Statement',
};

export function generateMetadata() {
  return generateLegalMetadata(CONFIG);
}

export default function PrivacyPage() {
  return <LegalPage {...CONFIG} />;
}
