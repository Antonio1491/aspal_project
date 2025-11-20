import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Mi comunidad creció mucho más rápido de lo que esperaba, y necesitaba una forma de organizarla sin perder el toque personal. Esta herramienta me permitió ofrecer una experiencia profesional, automatizar membresías y seguir conectando de forma cercana con cada miembro.",
    author: "Vitoria Martín",
    role: "Directora",
    organization: "ANPR MÉXICO"
  },
  {
    quote: "La automatización de membresías nos ahorró innumerables horas cada mes. Ahora podemos enfocarnos en crear valor real para nuestros miembros en lugar de perseguir pagos.",
    author: "Carlos Rodríguez",
    role: "Presidente",
    organization: "Asociación de Ingenieros"
  },
  {
    quote: "Nuestros miembros están más comprometidos que nunca. La plataforma facilitó la creación de una verdadera comunidad donde todos pueden conectar y colaborar.",
    author: "Ana Sánchez",
    role: "Coordinadora",
    organization: "Colegio de Profesionales"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden" data-testid="section-testimonials">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold" data-testid="text-testimonials-title">
            Casos de Éxito
          </h2>
          <p className="text-xl text-secondary-foreground font-semibold">
            Testimonios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
