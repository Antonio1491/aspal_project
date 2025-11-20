import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import membershipIllustration from "@assets/generated_images/membership_automation_illustration.png";

interface ProblemSectionProps {
  question: string;
  solution: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function ProblemSection({ 
  question, 
  solution, 
  description, 
  benefits, 
  image, 
  imageAlt,
  reverse = false 
}: ProblemSectionProps) {
  return (
    <section className="py-20 md:py-32" data-testid="section-problem">
      <div className="container mx-auto px-4 md:px-8">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
          {/* Content side */}
          <div className={`space-y-6 ${reverse ? 'md:order-2' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight" data-testid="text-question">
              {question}
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold text-primary" data-testid="text-solution">
                {solution}
              </h3>
              <p className="text-lg text-muted-foreground" data-testid="text-description">
                {description}
              </p>
            </div>
            
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Image side */}
          <div className={reverse ? 'md:order-1' : ''}>
            <div className="relative">
              <Card className="p-8 backdrop-blur-sm bg-card/80 border-card-border">
                <img 
                  src={image} 
                  alt={imageAlt} 
                  className="w-full h-auto rounded-xl"
                  data-testid="img-problem-illustration"
                />
              </Card>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-6 -right-6 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export a default variant for easy use
export function MembershipProblemSection() {
  return (
    <ProblemSection
      question="¿Aún gestionas tus membresías de forma manual?"
      solution="Nuestra solución:"
      description="Automatiza y genera más ingresos con una plataforma profesional."
      benefits={[
        "Renueva y gestiona membresías sin esfuerzo",
        "Control de acceso personalizado por tipo de membresía",
        "Pagos integrados y automatizados",
        "Beneficios exclusivos para cada nivel"
      ]}
      image={membershipIllustration}
      imageAlt="Automatización de membresías"
    />
  );
}
