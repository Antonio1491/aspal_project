/**
 * Cliente de la WordPress REST API.
 *
 * MÓDULO SOLO-SERVIDOR: lee `process.env` y lo consumen `server/routes.ts` y
 * `api/index.ts`. El cliente React no debe importarlo — para tipos usa
 * `shared/wordpress/types`, para datos los endpoints `/api/*`.
 *
 * Todas las funciones degradan a vacío/null ante un fallo de WordPress en vez
 * de lanzar: la landing debe renderizar aunque el blog esté caído.
 */
import { transformPost } from "./transform";
import type { TransformedPost, WPPost } from "./types";

const WP_API_BASE =
  process.env.WP_API_BASE ??
  "https://comunidad.asociacionesprofesionales.org/wp-json/wp/v2";

export async function fetchPosts(perPage: number = 6): Promise<TransformedPost[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts?_embed&per_page=${perPage}`);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts: WPPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error("Error fetching posts from WordPress:", error);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<TransformedPost | null> {
  try {
    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&slug=${encodeURIComponent(slug)}`,
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
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function fetchPodcasts(perPage: number = 6): Promise<TransformedPost[]> {
  try {
    // Los podcasts son posts de la categoría "podcast": hay que resolver su id
    // por slug antes de poder filtrar.
    const categoryResponse = await fetch(`${WP_API_BASE}/categories?slug=podcast`);

    if (!categoryResponse.ok) {
      throw new Error(`WordPress API error: ${categoryResponse.status}`);
    }

    const categories = await categoryResponse.json();

    if (categories.length === 0) {
      console.log('Category "podcast" not found');
      return [];
    }

    const podcastCategoryId = categories[0].id;

    const response = await fetch(
      `${WP_API_BASE}/posts?_embed&per_page=${perPage}&categories=${podcastCategoryId}`,
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts: WPPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
}
