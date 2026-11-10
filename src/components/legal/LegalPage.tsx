import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { BlogShell } from '@/app/blog/BlogShell';
import { decodeEntities } from '@/lib/markdown';
import { prefetchCanonicalBaseUrl, prefetchCMSPage } from '@/lib/prefetch';
import { generatePageMetadata } from '@/lib/seo-defaults';

// GFM for the tables in the legal documents; raw HTML is allowed because the
// content comes from the tenant's trusted CMS editors (same as blog posts).
const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw];

// The documents start with their own "# Title"; the page header already shows
// the title, so drop a leading H1 to avoid printing it twice.
const LEADING_H1_RE = /^\s*#\s+[^\n]*\n+/;

export interface LegalPageConfig {
  /** CMS page slug in ep-dashboard → CMS. */
  cmsSlug: string;
  /** Key into seo-defaults PAGE_TITLES / PAGE_DESCRIPTIONS / PAGE_CANONICALS. */
  seoKey: string;
  /** Shown when the CMS page has no title (or doesn't exist yet). */
  fallbackTitle: string;
}

export async function generateLegalMetadata({ cmsSlug, seoKey }: LegalPageConfig): Promise<Metadata> {
  const [page, baseUrl] = await Promise.all([prefetchCMSPage(cmsSlug), prefetchCanonicalBaseUrl()]);
  return generatePageMetadata(page?.seo ?? null, seoKey, baseUrl);
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function LegalPage({ cmsSlug, fallbackTitle }: LegalPageConfig) {
  const page = await prefetchCMSPage(cmsSlug);
  // Dashboard block types store their text in different fields: text/content
  // blocks use `content`, simple blocks use `description`.
  // DECISION: `visible` wins over `published`. The dashboard's "content" block
  // has only a visibility toggle (no publish switch), so its `published` stays
  // false forever; blocks without `visible` fall back to `published`.
  const markdown = (page?.content?.blocks ?? [])
    .filter((block) => (block.visible ?? block.published) !== false)
    .map((block) => block.content || block.description || '')
    .filter(Boolean)
    .map(decodeEntities)
    .join('\n\n')
    .replace(LEADING_H1_RE, '');
  const title = page?.page_title || fallbackTitle;
  const updated = formatDate(page?.last_updated);

  return (
    <BlogShell blogActive={false}>
      <article className="blog-article-wrap legal-page">
        <header className="blog-article-header legal-header">
          <div className="blog-eyebrow">
            <span className="blog-eyebrow-dot" aria-hidden />
            <span>/legal</span>
          </div>
          <h1 className="blog-article-title">{title}</h1>
          {updated ? <p className="legal-updated">Last updated · {updated}</p> : null}
        </header>

        <div className="blog-article-body">
          {markdown ? (
            <div className="gconf-article legal-article">
              <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
                {markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="blog-empty-inline">
              <span className="blog-empty-cursor">_</span> this document is being prepared.
              Questions? <a href="mailto:privacy@gconf.ai">privacy@gconf.ai</a>
            </div>
          )}
        </div>
      </article>
    </BlogShell>
  );
}
