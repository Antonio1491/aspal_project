import { useEffect, useState } from "react";

const LOGOS = [
  "Recurso-50comunidad-ASPAL-min.png",
  "Recurso-51comunidad-ASPAL-min.png",
  "Recurso-52comunidad-ASPAL-min.png",
  "Recurso-53comunidad-ASPAL-min.png",
  "Recurso-54comunidad-ASPAL-min.png",
];

export default function LogoCarousel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 overflow-hidden" data-testid="section-logo-carousel">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-clients-title">
          Casos de éxito o clientes
        </h2>
      </div>
      
      <div className="relative">
        {/* First row - scrolling right */}
        <div className="flex gap-8 mb-8 animate-scroll-right" data-testid="carousel-row-1">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 w-40 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              data-testid={`logo-${index}`}
            >
              <div className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">Logo {(index % LOGOS.length) + 1}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row - scrolling left */}
        <div className="flex gap-8 animate-scroll-left" data-testid="carousel-row-2">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 w-40 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              data-testid={`logo-alt-${index}`}
            >
              <div className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">Logo {(index % LOGOS.length) + 1}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
      
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
