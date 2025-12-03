import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchPosts, fetchPostBySlug, fetchPodcasts } from "./wordpress-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog routes - fetch from WordPress API
  app.get("/api/posts", async (req, res) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 6;
      const posts = await fetchPosts(perPage);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
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

  // Podcast routes - fetch from WordPress API
  app.get("/api/podcasts", async (req, res) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 6;
      const podcasts = await fetchPodcasts(perPage);
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      res.status(500).json({ error: "Failed to fetch podcasts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
