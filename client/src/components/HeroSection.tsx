import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroDashboard from "@assets/generated_images/hero_dashboard_with_yellow_background.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Crea y Gestiona{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                tu Comunidad
              </span>{" "}
              en Línea
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-base px-8 py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild data-testid="button-cta-primary">
                <a href="https://asociacionesprofesionales.org/register/membresia-basica/" target="_blank" rel="noopener noreferrer">
                  Comenzar ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild data-testid="button-cta-secondary">
                <a href="https://youtu.be/kl4Zd89F8jk" target="_blank" rel="noopener noreferrer">
                  Ver Video
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Asociaciones activas</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground">Miembros conectados</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img 
                src={heroDashboard} 
                alt="Dashboard de plataforma" 
                className="w-full h-auto"
                data-testid="img-hero-dashboard"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
