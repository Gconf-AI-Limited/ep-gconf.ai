// The ep-dashboard rich-text editor stores HTML-entity-encoded content (it
// persists `<sup>` as `&lt;sup&gt;` in the block's `content` field). Decode
// the common entities back to raw characters so rehype-raw can parse the
// resulting tags. Idempotent for already-raw content.
const HTML_ENTITY_RE = /&(lt|gt|amp|quot|#39|apos|nbsp);/g;
const HTML_ENTITY_MAP: Record<string, string> = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  '#39': "'",
  apos: "'",
  nbsp: ' ',
};

export function decodeEntities(input: string): string {
  return input.replace(HTML_ENTITY_RE, (_, key: string) => HTML_ENTITY_MAP[key] ?? _);
}
