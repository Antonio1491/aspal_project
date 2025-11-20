import FeaturesGrid from '../FeaturesGrid';
import { Users, MessageCircle, Shield, Calendar, TrendingUp, Lock } from 'lucide-react';

export default function FeaturesGridExample() {
  return (
    <FeaturesGrid
      title="¿Tu asociación tiene miembros... pero no comunidad?"
      subtitle="Comunidad en Línea:"
      features={[
        {
          icon: Users,
          title: "Perfiles profesionales",
          description: "Cada miembro tiene su espacio personalizado para destacar."
        },
        {
          icon: MessageCircle,
          title: "Muro de actividad y grupos",
          description: "Fomenta la interacción y colaboración entre miembros."
        },
        {
          icon: Shield,
          title: "Mensajes privados y foros",
          description: "Comunicación segura y privada cuando se necesita."
        },
        {
          icon: Calendar,
          title: "Eventos y gamificación",
          description: "Organiza eventos y motiva la participación activa."
        },
        {
          icon: TrendingUp,
          title: "Publicidad y monetización",
          description: "Genera ingresos adicionales de forma inteligente."
        },
        {
          icon: Lock,
          title: "Privacidad garantizada",
          description: "Seguridad de datos de nivel empresarial."
        }
      ]}
      columns={3}
    />
  );
}
