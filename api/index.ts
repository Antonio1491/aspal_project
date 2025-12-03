import express, { type Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WordPress API configuration
const WP_API_BASE = 'https://comunidad.asociacionesprofesionales.org/wp-json/wp/v2';

interface WPPost {
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

interface TransformedPost {
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

function transformPost(post: WPPost): TransformedPost {
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

async function fetchPosts(perPage: number = 6): Promise<TransformedPost[]> {
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

async function fetchPostBySlug(slug: string): Promise<TransformedPost | null> {
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

async function fetchPodcasts(perPage: number = 6): Promise<TransformedPost[]> {
  try {
    // First, get the category ID for "podcast"
    const categoryResponse = await fetch(
      `${WP_API_BASE}/categories?slug=podcast`
    );
    
    if (!categoryResponse.ok) {
      throw new Error(`WordPress API error: ${categoryResponse.status}`);
    }
    
    const categories = await categoryResponse.json();
    
    if (categories.length === 0) {
      console.log('Category "podcast" not found');
      return [];
    }
    
    const podcastCategoryId = categories[0].id;
    
    // Now fetch posts filtered by the podcast category
    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&per_page=${perPage}&categories=${podcastCategoryId}`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }
    
    const posts: WPPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return [];
  }
}

// API Routes
app.get("/api/posts", async (req: Request, res: Response) => {
  try {
    const perPage = parseInt(req.query.per_page as string) || 6;
    const posts = await fetchPosts(perPage);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/api/posts/:slug", async (req: Request, res: Response) => {
  try {
    const post = await fetchPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.get("/api/podcasts", async (req: Request, res: Response) => {
  try {
    const perPage = parseInt(req.query.per_page as string) || 6;
    const podcasts = await fetchPodcasts(perPage);
    res.json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    res.status(500).json({ error: "Failed to fetch podcasts" });
  }
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
