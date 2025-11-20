import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BookOpen } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-border" data-testid="section-blog-hero">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
              <BookOpen className="w-5 h-5 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Blog ASPAL</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-blog-title">
              Recursos para{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Asociaciones Profesionales
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-blog-description">
              Explora nuestro blog para encontrar artículos informativos, guías prácticas, estudios de caso y recursos descargables diseñados para empoderar a profesionales de Asociaciones en América Latina.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24" data-testid="section-posts-grid">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-2xl"
                  data-testid={`skeleton-post-${i}`}
                ></div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg" data-testid="text-no-posts">
                No hay artículos disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
