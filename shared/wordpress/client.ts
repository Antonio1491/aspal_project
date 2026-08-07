/**
 * Cliente de la WordPress REST API.
 *
 * MÓDULO SOLO-SERVIDOR: lee `process.env` y lo consumen `server/index.ts` y
 * `api/index.ts`. El cliente React no debe importarlo — para tipos usa
 * `shared/wordpress/types`, para datos los endpoints `/api/*`.
 *
 * Las funciones PROPAGAN los fallos de WordPress en vez de degradar a
 * vacío/null. `routes.ts` los traduce a 5xx para que el cliente pueda
 * distinguir "WordPress está caído" de "no hay artículos publicados": con la
 * política anterior ambos llegaban como el mismo array vacío.
 */
import { transformPost } from "./transform";
import type { TransformedPost, WPPost } from "./types";

const WP_API_BASE =
  process.env.WP_API_BASE ??
  "https://comunidad.asociacionesprofesionales.org/wp-json/wp/v2";

/** Slug de la categoría cuyos posts se sirven por `/api/podcasts` y se
 *  excluyen de `/api/posts`. */
const PODCAST_CATEGORY_SLUG = "podcast";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} en ${url}`);
  }

  return response.json();
}

/**
 * Resuelve el id de la categoría "podcast" por su slug.
 *
 * Deliberadamente NO se codifica el id a mano: sería una segunda fuente de
 * verdad y, si la categoría se recreara en WordPress con otro id, los podcasts
 * reaparecerían en la rejilla del blog en silencio.
 *
 * Devuelve `null` si la categoría no existe — que no es un error: significa
 * que no hay nada que excluir ni que servir.
 */
export async function resolvePodcastCategoryId(): Promise<number | null> {
  const categories = (await fetchJson(
    `${WP_API_BASE}/categories?slug=${PODCAST_CATEGORY_SLUG}`,
  )) as Array<{ id: number }>;

  if (categories.length === 0) {
    console.warn(`Categoría "${PODCAST_CATEGORY_SLUG}" no encontrada en WordPress`);
    return null;
  }

  return categories[0].id;
}

/** Artículos del blog. Excluye los episodios de podcast, que tienen su propia
 *  página en `/podcast`. */
export async function fetchPosts(perPage: number = 6): Promise<TransformedPost[]> {
  const podcastCategoryId = await resolvePodcastCategoryId();

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
  });

  if (podcastCategoryId !== null) {
    params.set("categories_exclude", String(podcastCategoryId));
  }

  const posts = (await fetchJson(`${WP_API_BASE}/posts?${params}`)) as WPPost[];
  return posts.map(transformPost);
}

/** Un artículo por slug. `null` significa "no existe", no "falló la carga":
 *  los fallos se propagan como excepción. */
export async function fetchPostBySlug(slug: string): Promise<TransformedPost | null> {
  const params = new URLSearchParams({ _embed: "1", slug });

  const posts = (await fetchJson(`${WP_API_BASE}/posts?${params}`)) as WPPost[];

  if (posts.length === 0) {
    return null;
  }

  return transformPost(posts[0]);
}

/** Episodios de podcast. */
export async function fetchPodcasts(perPage: number = 6): Promise<TransformedPost[]> {
  const podcastCategoryId = await resolvePodcastCategoryId();

  if (podcastCategoryId === null) {
    return [];
  }

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    categories: String(podcastCategoryId),
  });

  const posts = (await fetchJson(`${WP_API_BASE}/posts?${params}`)) as WPPost[];
  return posts.map(transformPost);
}
