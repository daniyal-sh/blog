const BASE = import.meta.env.BASE_URL;

/**
 * Prefix an internal path with the configured base path.
 * Absolute URLs, protocol-relative URLs, mailto links, and hashes pass through.
 */
export function url(path: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;

  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalized}` || '/';
}

export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'https://daniyal-sh.github.io').href;
}
