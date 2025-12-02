import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import heroDashboard from "@assets/generated_images/hero_dashboard_with_yellow_background.png";

function AnimatedCounter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const { count, ref } = useAnimatedCounter(end, { duration: 2500, delay: 500 });
  
  return (
    <div ref={ref}>
      <div className="text-3xl font-bold text-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

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
            {/* Title - enters from right */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Crea y Gestiona{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                tu Comunidad
              </span>{" "}
              en Línea
            </motion.h1>
            
            {/* Buttons - staggered entrance */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button size="lg" className="text-base px-8 py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild data-testid="button-cta-primary">
                  <a href="https://asociacionesprofesionales.org/register/membresia-basica/" target="_blank" rel="noopener noreferrer">
                    Comenzar ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                <Button size="lg" variant="outline" className="text-base px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild data-testid="button-cta-secondary">
                  <a href="https://youtu.be/kl4Zd89F8jk" target="_blank" rel="noopener noreferrer">
                    Ver Video
                  </a>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Stats - animated counters */}
            <motion.div 
              className="flex items-center gap-8 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <AnimatedCounter end={500} suffix="+" label="Asociaciones activas" />
              <div className="h-12 w-px bg-border"></div>
              <AnimatedCounter end={50000} suffix="+" label="Miembros conectados" />
            </motion.div>
          </div>
          
          {/* Right side - Illustration - enters from below */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={heroDashboard} 
                alt="Dashboard de plataforma" 
                className="w-full h-auto"
                data-testid="img-hero-dashboard"
              />
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
