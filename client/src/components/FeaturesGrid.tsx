import FeatureCard from "./FeatureCard";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title: string;
  subtitle: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export default function FeaturesGrid({ 
  title, 
  subtitle, 
  features,
  columns = 3 
}: FeaturesGridProps) {
  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4'
  }[columns];

  return (
    <section className="py-20 md:py-32 bg-muted/30" data-testid="section-features-grid">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold" data-testid="text-features-title">
            {title}
          </h2>
          <p className="text-xl text-secondary-foreground font-semibold" data-testid="text-features-subtitle">
            {subtitle}
          </p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
