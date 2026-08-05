import type { TransformedPost, WPPost } from "./types";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

/** Normaliza un post de WordPress: la imagen destacada cae al primer `<img>`
 *  del contenido cuando no hay `wp:featuredmedia`. */
export function transformPost(post: WPPost): TransformedPost {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.[0];

  let featuredImage = featuredMedia?.source_url || '';
  if (!featuredImage) {
    featuredImage = extractFirstImage(post.content.rendered) || '';
  }

  return {
    id: post.id,
    title: stripHtml(post.title.rendered),
    slug: post.slug,
    excerpt: stripHtml(post.excerpt.rendered).substring(0, 200) + '...',
    content: post.content.rendered,
    featuredImage,
    category: categories?.[0]?.name || 'General',
    publishedAt: post.date,
    author: author?.name || 'ASPAL',
    link: post.link,
  };
}
