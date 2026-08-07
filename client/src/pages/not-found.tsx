import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

/** 404 del sitio.
 *
 *  Antes decía "404 Page Not Found" y "Did you forget to add the page to the
 *  router?" —texto de desarrollador, en inglés, en producción—, con colores
 *  bg-gray-50/text-gray-900 codificados que rompían el modo oscuro, y sin
 *  Header ni Footer: el usuario quedaba sin ninguna salida. */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <AlertCircle
            className="w-10 h-10 mx-auto text-muted-foreground"
            aria-hidden="true"
          />

          <h1
            className="mt-6 text-3xl md:text-4xl font-bold text-foreground"
            data-testid="text-404-title"
          >
            Página no encontrada
          </h1>

          <p className="mt-4 text-muted-foreground" data-testid="text-404-message">
            La página que buscas no existe o ha cambiado de dirección.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button className="min-h-[44px] px-6" asChild data-testid="button-404-home">
              <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" aria-hidden="true" />
                Ir al inicio
              </Link>
            </Button>
            <Button
              variant="outline"
              className="min-h-[44px] px-6"
              asChild
              data-testid="button-404-blog"
            >
              <Link href="/blog">Ver el blog</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
