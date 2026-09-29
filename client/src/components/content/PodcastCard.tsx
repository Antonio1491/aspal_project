import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TransformedPost } from "@shared/wordpress/types";

interface PodcastCardProps {
  podcast: TransformedPost;
  episodeNumber?: number;
}

export function PodcastCard({ podcast, episodeNumber }: PodcastCardProps) {
  return (
    <a
      href={podcast.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`${podcast.title} (se abre en una pestaña nueva)`}
      data-testid={`link-podcast-${podcast.id}`}
    >
      <Card
        className="flex flex-col h-full hover-elevate cursor-pointer"
        data-testid={`card-podcast-${podcast.id}`}
      >
        <CardHeader className="p-0">
          {/* Condicional: un <img src=""> o un placeholder inexistente pinta el
              icono de imagen rota. Decorativa: el título está en el aria-label. */}
          {podcast.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-t-md bg-muted/30">
              <img
                src={podcast.featuredImage}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain"
                data-testid={`img-podcast-artwork-${podcast.id}`}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-6">
          {episodeNumber && (
            <div className="flex items-center gap-2 mb-3">
              <Badge
                className="bg-secondary text-secondary-foreground"
                data-testid={`badge-episode-${podcast.id}`}
              >
                Episodio {episodeNumber}
              </Badge>
            </div>
          )}

          <h3
            className="text-xl font-semibold mb-3 line-clamp-2"
            data-testid={`text-podcast-title-${podcast.id}`}
          >
            {podcast.title}
          </h3>

          <p
            className="text-muted-foreground text-sm line-clamp-3"
            data-testid={`text-podcast-description-${podcast.id}`}
          >
            {podcast.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <time
              dateTime={new Date(podcast.publishedAt).toISOString()}
              data-testid={`text-podcast-date-${podcast.id}`}
            >
              {format(new Date(podcast.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
            </time>
          </div>

          <span className="flex items-center gap-1 text-sm text-primary font-medium">
            Ver más
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </span>
        </CardFooter>
      </Card>
    </a>
  );
}
