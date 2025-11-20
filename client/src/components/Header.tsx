import logoLight from "@assets/ASPAL-para fondo claro_1763675327795.png";
import logoDark from "@assets/ASPAL-para fondo oscuro_1763675345456.png";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center" data-testid="link-logo">
              <img 
                src={logoLight} 
                alt="Aspal" 
                className="h-8 w-auto dark:hidden"
                data-testid="img-logo-light"
              />
              <img 
                src={logoDark} 
                alt="Aspal" 
                className="h-8 w-auto hidden dark:block"
                data-testid="img-logo-dark"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#servicios" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-nav-services"
            >
              Servicios
            </a>
            <a 
              href="#casos" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-nav-cases"
            >
              Casos de éxito
            </a>
            <a 
              href="#testimonios" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-nav-testimonials"
            >
              Testimonios
            </a>
            <a 
              href="#contacto" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-nav-contact"
            >
              Contacto
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" data-testid="button-login">
              Iniciar sesión
            </Button>
            <Button data-testid="button-demo">
              Ver demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <nav className="flex flex-col gap-4">
              <a 
                href="#servicios" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="link-mobile-services"
              >
                Servicios
              </a>
              <a 
                href="#casos" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="link-mobile-cases"
              >
                Casos de éxito
              </a>
              <a 
                href="#testimonios" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="link-mobile-testimonials"
              >
                Testimonios
              </a>
              <a 
                href="#contacto" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="link-mobile-contact"
              >
                Contacto
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" className="w-full" data-testid="button-mobile-login">
                  Iniciar sesión
                </Button>
                <Button className="w-full" data-testid="button-mobile-demo">
                  Ver demo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
