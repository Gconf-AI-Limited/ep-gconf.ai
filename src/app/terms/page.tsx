import { LegalPage, generateLegalMetadata } from '@/components/legal/LegalPage';
import type { LegalPageConfig } from '@/components/legal/LegalPage';

export const revalidate = 60;

const CONFIG: LegalPageConfig = {
  cmsSlug: 'terms-and-conditions',
  seoKey: 'terms',
  fallbackTitle: 'Terms and Conditions',
};

export function generateMetadata() {
  return generateLegalMetadata(CONFIG);
}

export default function TermsPage() {
  return <LegalPage {...CONFIG} />;
}
