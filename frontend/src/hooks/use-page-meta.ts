import { useEffect } from 'react';

const SITE_NAME = 'One Stop EShop';
const SITE_URL = 'https://one-stop-eshop.vercel.app';
const DEFAULT_TITLE = `${SITE_NAME} — Everything you love, in one place`;
const DEFAULT_DESCRIPTION =
  'Shop hand-picked electronics, fashion and jewelry from brands you trust. Free shipping over $100 and secure PayPal checkout.';
const DEFAULT_IMAGE = '/og-image.jpg';

interface PageMeta {
  description?: string;
  /** Absolute URL or site-relative path. */
  image?: string;
  /** Keep private pages (account, checkout, admin) out of search results. */
  noindex?: boolean;
  /** Structured data (schema.org) for rich results. */
  jsonLd?: object;
}

/** Search engines show ~160 characters; cut on a word boundary. */
const summarize = (text: string) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).replace(/\s+\S*$/, '')}…`;
};

const absolute = (url: string) => (url.startsWith('http') ? url : `${SITE_URL}${url}`);

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.append(element);
  }
  element.href = href;
};

/** Title, description, canonical URL, social cards and structured data for the current page. */
export function usePageMeta(title?: string, { description, image, noindex, jsonLd }: PageMeta = {}) {
  const structuredData = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
    const text = summarize(description || DEFAULT_DESCRIPTION);
    const url = `${SITE_URL}${window.location.pathname}${window.location.search}`;

    document.title = fullTitle;
    setMeta('name', 'description', text);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', text);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', absolute(image || DEFAULT_IMAGE));
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', text);
    setMeta('name', 'twitter:image', absolute(image || DEFAULT_IMAGE));
    setLink('canonical', url);

    const script = document.getElementById('page-jsonld');
    if (structuredData) {
      const element =
        script ?? Object.assign(document.createElement('script'), { id: 'page-jsonld', type: 'application/ld+json' });
      element.textContent = structuredData;
      if (!script) document.head.append(element);
    } else {
      script?.remove();
    }
  }, [title, description, image, noindex, structuredData]);
}
