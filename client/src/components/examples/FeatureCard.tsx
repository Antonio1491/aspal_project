import FeatureCard from '../FeatureCard';
import { Users, Lock, CreditCard, Gift } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-background">
      <FeatureCard
        icon={Users}
        title="Membresías automáticas"
        description="Renueva, segmenta y gestiona sin esfuerzo."
        index={0}
      />
      <FeatureCard
        icon={Lock}
        title="Control de acceso"
        description="Define quién ve qué, según su tipo de membresía."
        index={1}
      />
      <FeatureCard
        icon={CreditCard}
        title="Pagos integrados"
        description="Cobra en automático y olvídate de perseguir a los socios."
        index={2}
      />
      <FeatureCard
        icon={Gift}
        title="Beneficios personalizados"
        description="Ofrece valor real con descuentos y recursos exclusivos."
        index={3}
      />
    </div>
  );
}
