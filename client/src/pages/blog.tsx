import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/content/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { formatPublishedDate } from "@/lib/date";
import type { TransformedPost } from "@shared/wordpress/types";

/** Número de artículos que se piden. Ojo: hoy coincide con los que existen,
 *  así que el octavo desaparecería en silencio. Umbral de paginación por
 *  decidir — ver la lista de revisión. */
const POSTS_PER_PAGE = 7;

/** Esqueleto con la silueta real de la tarjeta. Antes eran bloques `h-96`
 *  grises y el salto al cargar era brusco (ley de Doherty). */
function BlogCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className="h-full flex flex-col overflow-hidden bg-card border-border/50"
      data-testid={`skeleton-post-${index}`}
    >
      <div className="h-52 bg-muted animate-pulse" />
      <div className="flex-1 flex flex-col p-6">
        <div className="h-6 w-11/12 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-6 w-3/5 rounded bg-muted animate-pulse" />
        <div className="mt-4 space-y-2 flex-1">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

export default function Blog() {
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<TransformedPost[]>({
    queryKey: ["/api/posts", { per_page: POSTS_PER_PAGE }],
    queryFn: async () => {
      const response = await fetch(`/api/posts?per_page=${POSTS_PER_PAGE}`);
      if (!response.ok)
        throw new Error(`Error al cargar los artículos: ${response.status}`);
      return response.json();
    },
    // Un solo fetch fallido no puede significar "no hay artículos": con
    // `retry: false` global, el fallo quedaba cacheado toda la sesión.
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  // El destacado solo tiene sentido si queda algo debajo. Con un único
  // artículo, se lo comía el destacado y la rejilla decía "no hay artículos":
  // la página se contradecía a sí misma.
  const hasFeatured = (posts?.length ?? 0) >= 2;
  const featuredPost = hasFeatured ? posts?.[0] : undefined;
  const gridPosts = hasFeatured ? (posts?.slice(1) ?? []) : (posts ?? []);

  const featuredDate = formatPublishedDate(featuredPost?.publishedAt);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative bg-primary overflow-hidden"
        data-testid="section-blog-hero"
      >
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
          {/* El h1 vive fuera del panel condicional: antes, con 0 artículos,
              la página se quedaba literalmente sin encabezado de nivel 1. */}
          <div className={hasFeatured ? "mb-8 lg:mb-10" : "py-8"}>
            <h1
              className="text-3xl md:text-5xl font-bold text-white leading-tight"
              data-testid="text-blog-title"
            >
              Artículos de <span className="text-secondary">Conocimiento</span>
            </h1>
            <p className="mt-3 text-white/80 text-base md:text-lg max-w-2xl">
              Recursos, guías y mejores prácticas para asociaciones profesionales
            </p>
          </div>

          {featuredPost && (
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              {featuredPost.featuredImage && (
                <motion.div
                  className="relative rounded-3xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                    aria-label={featuredPost.title}
                    tabIndex={-1}
                  >
                    <img
                      src={featuredPost.featuredImage}
                      alt=""
                      className="w-full h-full object-cover min-h-[300px] lg:min-h-full cursor-pointer hover:scale-105 transition-transform duration-500"
                      data-testid="img-featured-article"
                    />
                  </Link>
                </motion.div>
              )}

              <motion.div
                className="relative flex flex-col bg-card rounded-3xl overflow-hidden shadow-xl p-6 md:p-8"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Badge
                  className="self-start mb-4 bg-secondary text-secondary-foreground font-semibold px-3 py-1"
                  data-testid="badge-featured"
                >
                  Artículo Destacado
                </Badge>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer leading-tight"
                    data-testid="text-featured-title"
                  >
                    {featuredPost.title}
                  </h2>
                </Link>

                {featuredPost.excerpt && (
                  <p
                    className="mt-4 text-muted-foreground line-clamp-4 text-base md:text-lg flex-1"
                    data-testid="text-featured-excerpt"
                  >
                    {featuredPost.excerpt}
                  </p>
                )}

                {/* La insignia de categoría se retira: con una sola categoría
                    real decía "Blog" en el 100% de los casos. */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {featuredDate && (
                    <time dateTime={featuredPost.publishedAt}>{featuredDate}</time>
                  )}
                  {featuredPost.readingMinutes > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {featuredPost.readingMinutes} min lectura
                    </span>
                  )}
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="mt-6 inline-flex items-center gap-2 min-h-[44px] text-primary font-semibold text-lg rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-testid="link-read-featured"
                >
                  Leer artículo
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 37 768 43 864 45C960 47 1056 45 1152 41.7C1248 38 1344 33 1392 30.8L1440 28.5V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* La rejilla aporta ahora su propio padding superior: antes se lo daba
          la sección "Temas de Interés", que se ha eliminado con el filtro. */}
      <section className="pt-12 md:pt-16 pb-16 md:pb-24" data-testid="section-posts-grid">
        <div className="container mx-auto px-4 md:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            data-testid="text-grid-title"
          >
            Últimos artículos
          </h2>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              aria-busy="true"
              aria-label="Cargando artículos"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : isError ? (
            /* Tercer estado, distinto del vacío: antes un WordPress caído
               mostraba "No hay artículos en esta categoría". */
            <div className="text-center py-12" data-testid="state-posts-error">
              <p className="text-lg font-semibold text-foreground">
                No hemos podido cargar los artículos
              </p>
              <p className="mt-2 text-muted-foreground">
                Puede ser un problema temporal de conexión.
              </p>
              <Button
                className="mt-6 min-h-[44px] px-6"
                onClick={() => refetch()}
                disabled={isFetching}
                data-testid="button-retry-posts"
              >
                {isFetching ? "Reintentando…" : "Reintentar"}
              </Button>
            </div>
          ) : gridPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {gridPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12" data-testid="state-posts-empty">
              <p className="text-muted-foreground text-lg" data-testid="text-no-posts">
                Todavía no hay artículos publicados. Vuelve pronto.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
