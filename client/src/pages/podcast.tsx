import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PodcastCard } from "@/components/PodcastCard";
import { Headphones } from "lucide-react";

interface WPPodcast {
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

export default function PodcastPage() {
  const { data: podcasts, isLoading } = useQuery<WPPodcast[]>({
    queryKey: ["/api/podcasts", { per_page: 6 }],
    queryFn: async () => {
      const response = await fetch("/api/podcasts?per_page=6");
      if (!response.ok) throw new Error("Failed to fetch podcasts");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-secondary/20 rounded-full">
                <Headphones className="w-12 h-12 text-secondary" data-testid="icon-podcast-hero" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-hero-title">
              Conexión Profesional
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8" data-testid="text-hero-subtitle">
              El podcast que explora y fortalece las redes en asociaciones profesionales. Descubre en cada episodio estrategias innovadoras e historias que inspiran éxito y sostenibilidad en el mundo profesional.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://podcasts.apple.com/mx/podcast/conexi%C3%B3n-profesional/id1739853485"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground rounded-md hover-elevate active-elevate-2"
                data-testid="button-apple-podcasts"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zm0 3.273a3.273 3.273 0 100 6.545 3.273 3.273 0 000-6.545zm0 8.727c-1.636 0-3 1.09-3 2.455v.727h6v-.727c0-1.364-1.364-2.455-3-2.455z"/>
                </svg>
                Apple Podcasts
              </a>
              <a
                href="https://open.spotify.com/show/38oaCe96wmhex6FPGwluxu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground rounded-md hover-elevate active-elevate-2"
                data-testid="button-spotify"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Episodes Grid */}
      <section className="py-16" data-testid="section-podcast-grid">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8" data-testid="text-episodes-title">
            Todos los Episodios
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-2xl"
                  data-testid={`skeleton-podcast-${i}`}
                ></div>
              ))}
            </div>
          ) : podcasts && podcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast, index) => (
                <PodcastCard 
                  key={podcast.id} 
                  podcast={podcast} 
                  episodeNumber={podcasts.length - index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg" data-testid="text-no-podcasts">
                No hay episodios disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
