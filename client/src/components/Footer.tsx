import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    // TODO: Remove mock functionality - handle actual newsletter subscription
    setEmail("");
  };

  return (
    <footer className="bg-muted/30 border-t border-border" data-testid="footer">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary" data-testid="text-footer-brand">
              Asociaciones Profesionales
            </h3>
            <p className="text-sm text-muted-foreground">
              Transformando organizaciones sin fines de lucro en comunidades digitales prósperas.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="button-social-facebook">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="button-social-twitter">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="button-social-linkedin">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="button-social-instagram">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground" data-testid="text-footer-nav-title">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-nav-home">Inicio</a></li>
              <li><a href="#servicios" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-nav-services">Servicios</a></li>
              <li><a href="#casos" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-nav-cases">Casos de éxito</a></li>
              <li><a href="#testimonios" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-nav-testimonials">Testimonios</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground" data-testid="text-footer-services-title">
              Servicios
            </h4>
            <ul className="space-y-2">
              <li><a href="#membresias" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-service-memberships">Gestión de Membresías</a></li>
              <li><a href="#comunidad" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-service-community">Comunidad en Línea</a></li>
              <li><a href="#cursos" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-service-courses">Certificaciones</a></li>
              <li><a href="#marketing" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-service-marketing">Marketing Digital</a></li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground" data-testid="text-footer-contact-title">
              Contacto
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span data-testid="text-contact-email">info@asociacionesprofesionales.org</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span data-testid="text-contact-phone">+52 55 1234 5678</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span data-testid="text-contact-address">Ciudad de México, México</span>
              </li>
            </ul>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-2">
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm h-9"
                  required
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" size="sm" data-testid="button-newsletter-submit">
                  Suscribir
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 Asociaciones Profesionales. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
              Privacidad
            </a>
            <a href="#terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
              Términos
            </a>
            <a href="#cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-cookies">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
