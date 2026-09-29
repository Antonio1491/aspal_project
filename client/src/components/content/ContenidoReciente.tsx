import BlogCard from "@/components/content/BlogCard";
import { PodcastCard } from "@/components/content/PodcastCard";
import { Banda } from "@/components/layout/Banda";
import { vistaReciente, type EstadoConsulta } from "@/lib/contenido-reciente";
import type { TransformedPost } from "@shared/wordpress/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

async function cargar(url: string): Promise<TransformedPost[]> {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`Error al cargar ${url}: ${respuesta.status}`);
  return respuesta.json();
}

function estado(consulta: UseQueryResult<TransformedPost[]>): EstadoConsulta {
  return {
    pendiente: consulta.isPending,
    error: consulta.isError,
    cantidad: consulta.data?.length ?? 0,
  };
}

const REINTENTO = {
  retry: 2,
  retryDelay: (intento: number) => Math.min(1000 * 2 ** intento, 8000),
};

/**
 * Contenido reciente de la home (RF-13): 3 artículos y el último episodio.
 * Si la API falla, el bloque desaparece y el resto de la home sigue igual. En
 * el HTML prerenderizado sale el esqueleto: las consultas no corren en el
 * servidor.
 */
export function ContenidoReciente() {
  const articulos = useQuery<TransformedPost[]>({
    queryKey: ["/api/posts", { per_page: 3 }],
    queryFn: () => cargar("/api/posts?per_page=3"),
    ...REINTENTO,
  });
  const episodios = useQuery<TransformedPost[]>({
    queryKey: ["/api/podcasts", { per_page: 1 }],
    queryFn: () => cargar("/api/podcasts?per_page=1"),
    ...REINTENTO,
  });

  const vista = vistaReciente(estado(articulos), estado(episodios));
  if (vista === "oculta") return null;

  const episodio = episodios.data?.[0];

  return (
    <Banda tono="suave" id="contenido-reciente">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Contenido reciente
        </h2>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-4"
          data-testid="link-home-blog"
        >
          Ver todo el blog
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {vista === "cargando" ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <p className="sr-only" role="status">
            Cargando contenido reciente…
          </p>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              className="h-80 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {articulos.data?.map((post) => (
            <li key={post.id}>
              <BlogCard post={post} />
            </li>
          ))}
          {episodio && (
            <li>
              <PodcastCard podcast={episodio} />
            </li>
          )}
        </ul>
      )}
    </Banda>
  );
}
