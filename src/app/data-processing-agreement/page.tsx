import { LegalPage, generateLegalMetadata } from '@/components/legal/LegalPage';
import type { LegalPageConfig } from '@/components/legal/LegalPage';

export const revalidate = 60;

const CONFIG: LegalPageConfig = {
  cmsSlug: 'data-processing-agreement',
  seoKey: 'dpa',
  fallbackTitle: 'Data Processing Agreement',
};

export function generateMetadata() {
  return generateLegalMetadata(CONFIG);
}

export default function DataProcessingAgreementPage() {
  return <LegalPage {...CONFIG} />;
}
