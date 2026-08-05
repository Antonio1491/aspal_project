/**
 * Registro único de los endpoints `/api/*`.
 *
 * Lo montan tanto el servidor Express de desarrollo/self-hosted
 * (`server/index.ts`) como la función serverless de Vercel (`api/index.ts`).
 * Añadir un endpoint aquí lo publica en ambos entornos a la vez — que es
 * justo lo que antes había que recordar hacer por duplicado.
 */
import type { Express, Request, Response } from "express";
import { fetchPodcasts, fetchPostBySlug, fetchPosts } from "./client";

export function registerApiRoutes(app: Express): void {
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

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });
}
