import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CTASection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CTA form submitted with email:", email);
    // TODO: Remove mock functionality - handle actual form submission
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" data-testid="section-cta">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Comienza hoy mismo</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" data-testid="text-cta-title">
            ¿Listo para transformar tu asociación?
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto" data-testid="text-cta-description">
            Únete a cientos de asociaciones que ya están creciendo con nuestra plataforma. Sin riesgos, sin compromisos.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/95 border-white/20 text-foreground placeholder:text-muted-foreground h-12"
                required
                data-testid="input-cta-email"
              />
              <Button 
                type="submit"
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold h-12 px-8"
                data-testid="button-cta-submit"
              >
                Comenzar
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
          
          <p className="text-sm text-white/70">
            Prueba gratuita por 14 días • No requiere tarjeta de crédito
          </p>
        </div>
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  );
}
