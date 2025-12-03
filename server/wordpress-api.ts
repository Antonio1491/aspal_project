const WP_API_BASE = 'https://comunidadmuestra.asociacionesprofesionales.org/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls?: { [key: string]: string };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface TransformedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
  author: string;
  link: string;
}

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

export async function fetchPosts(perPage: number = 6): Promise<TransformedPost[]> {
  try {
    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }
    
    const posts: WPPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts from WordPress:', error);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<TransformedPost | null> {
  try {
    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&slug=${encodeURIComponent(slug)}`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }
    
    const posts: WPPost[] = await response.json();
    if (posts.length === 0) {
      return null;
    }
    
    return transformPost(posts[0]);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function fetchPodcasts(perPage: number = 8): Promise<TransformedPost[]> {
  try {
    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&per_page=${perPage}&categories=podcast`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const posts: WPPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return [];
  }
}
