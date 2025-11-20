import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Post } from "@shared/schema";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) {
        throw new Error("Post not found");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-12 bg-muted animate-pulse rounded"></div>
            <div className="h-96 bg-muted animate-pulse rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-error-title">
              Artículo no encontrado
            </h1>
            <p className="text-muted-foreground" data-testid="text-error-message">
              El artículo que buscas no existe o ha sido eliminado.
            </p>
            <Button asChild data-testid="button-back-to-blog">
              <Link href="/blog">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver al blog
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="py-16 md:py-24" data-testid="article-post">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-8" asChild data-testid="button-back">
              <Link href="/blog">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver al blog
              </Link>
            </Button>

            {/* Post header */}
            <header className="space-y-6 mb-12">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-secondary text-secondary-foreground" data-testid="badge-category">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={new Date(post.publishedAt).toISOString()} data-testid="text-date">
                    {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </time>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span data-testid="text-author">{post.author}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-title">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground" data-testid="text-excerpt">
                {post.excerpt}
              </p>
            </header>

            {/* Featured image */}
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
                data-testid="img-featured"
              />
            </div>

            {/* Post content */}
            <div className="prose prose-lg max-w-none" data-testid="content-body">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-16 pt-12 border-t border-border">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-cta-title">
                  ¿Te gustó este artículo?
                </h2>
                <p className="text-muted-foreground mb-6" data-testid="text-cta-description">
                  Explora más recursos y mantente actualizado con las últimas tendencias para asociaciones profesionales.
                </p>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild data-testid="button-cta">
                  <Link href="/blog">
                    Ver más artículos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
