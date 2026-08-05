/**
 * Tipos compartidos entre el cliente, el servidor Express y la función
 * serverless de Vercel. Esta es la única definición de la forma de un post:
 * no la redeclares en componentes ni en handlers.
 */

/** Respuesta cruda de la WordPress REST API (`/wp/v2/posts?_embed`). */
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

/** Forma normalizada que sirven los endpoints `/api/*` y consume el cliente. */
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
