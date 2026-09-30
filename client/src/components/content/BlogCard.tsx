import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, ArrowUpRight } from "lucide-react";
import { formatPublishedDate } from "@/lib/date";
import type { TransformedPost } from "@shared/wordpress/types";

interface BlogCardProps {
  post: TransformedPost;
  /** Etiqueta de tipo sobre el título («Blog», «Podcast»). La usa la home para
   *  mezclar artículos y episodios con la misma tarjeta. */
  etiqueta?: string;
}

export default function BlogCard({ post, etiqueta }: BlogCardProps) {
  const publishedLabel = formatPublishedDate(post.publishedAt);

  // NOTA: el plan pedía que la tarjeta navegara a `/blog/${post.slug}`. Está
  // aplazado a propósito: WordPress no sirve el cuerpo de ningún artículo a
  // una petición anónima (muro de MemberPress), así que la lectura interna
  // mostraría un formulario de login incrustado. Ver
  // docs/plans/2026-08-05-001-REVISION-PENDIENTE.md, punto 1.
  // Mientras siga enlazando fuera, el icono correcto es ArrowUpRight.
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      // Sin esto el nombre accesible del enlace es la concatenación de imagen,
      // tiempo, título, extracto y fecha: seis tarjetas producen seis párrafos
      // en la lista de enlaces de un lector de pantalla.
      // La etiqueta visible («Blog», «Podcast») va también en el nombre accesible.
      aria-label={`${etiqueta ? `${etiqueta}: ` : ""}${post.title} (se abre en una pestaña nueva)`}
      data-testid={`link-post-${post.id}`}
    >
      <motion.div
        className="h-full cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <Card
          className="h-full flex flex-col overflow-hidden bg-card border-border/50 hover:border-primary/30 group-focus-within:border-primary/30 hover:shadow-xl group-focus-within:shadow-xl transition-all duration-300"
          data-testid={`card-post-${post.id}`}
        >
          {/* Imagen. Condicional: featuredImage puede venir vacío, y un
              <img src=""> solicita la propia página y pinta el icono de rota. */}
          {post.featuredImage && (
            <div className="relative h-52 overflow-hidden bg-muted/30">
              <motion.img
                src={post.featuredImage}
                // Decorativa: el título ya está en el aria-label del enlace.
                alt=""
                loading="lazy"
                className="w-full h-full object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                data-testid={`img-post-featured-${post.id}`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                <div className="p-2 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm">
                  <ArrowUpRight className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col p-6">
            {etiqueta && (
              <span
                className="mb-3 inline-flex self-start rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary"
                data-testid={`etiqueta-post-${post.id}`}
              >
                {etiqueta}
              </span>
            )}
            <h3
              className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary group-focus-within:text-primary transition-colors line-clamp-2 mb-3"
              data-testid={`text-post-title-${post.id}`}
            >
              {post.title}
            </h3>

            {post.excerpt && (
              <p
                className="text-sm text-muted-foreground line-clamp-3 flex-1"
                data-testid={`text-post-excerpt-${post.id}`}
              >
                {post.excerpt}
              </p>
            )}

            {/* Metadatos agrupados (ley de proximidad): ocupan el hueco que
                deja la insignia de categoría retirada. El tiempo de lectura se
                omite si no hay dato fiable — ver readingMinutes en types.ts. */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-4 text-sm text-muted-foreground">
              {publishedLabel && (
                <time
                  dateTime={post.publishedAt}
                  data-testid={`text-post-date-${post.id}`}
                >
                  {publishedLabel}
                </time>
              )}

              {post.readingMinutes > 0 && (
                <span
                  className="flex items-center gap-1"
                  data-testid={`text-post-readtime-${post.id}`}
                >
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {post.readingMinutes} min lectura
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </a>
  );
}
