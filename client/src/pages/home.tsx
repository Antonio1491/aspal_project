import HeroSection from "@/components/HeroSection";
import { MembershipProblemSection } from "@/components/ProblemSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import communityIllustration from "@assets/generated_images/community_networking_illustration.png";
import membershipIllustration from "@assets/generated_images/membership_automation_illustration.png";
import ProblemSection from "@/components/ProblemSection";
import { 
  Users, MessageCircle, Shield, Calendar, TrendingUp, Lock,
  BookOpen, Podcast, Video, FileText,
  GraduationCap, Award, UserCheck, DollarSign, Settings,
  Mail, Target, BarChart, Globe, Tag, Heart,
  Briefcase, FileCheck, Filter, Send, Wallet
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Memberships Section */}
      <MembershipProblemSection />
      
      <FeaturesGrid
        title="Gestión de Membresías"
        subtitle="Automatiza y simplifica"
        features={[
          {
            icon: Users,
            title: "Membresías automáticas",
            description: "Renueva, segmenta y gestiona sin esfuerzo."
          },
          {
            icon: Lock,
            title: "Control de acceso",
            description: "Define quién ve qué, según su tipo de membresía."
          },
          {
            icon: Wallet,
            title: "Pagos integrados",
            description: "Cobra en automático y olvídate de perseguir a los socios."
          },
          {
            icon: Tag,
            title: "Beneficios personalizados",
            description: "Ofrece valor real con descuentos y recursos exclusivos."
          },
          {
            icon: Target,
            title: "Promoción inteligente",
            description: "Atrae nuevos miembros con campañas efectivas."
          },
          {
            icon: Settings,
            title: "Configuración flexible",
            description: "Adapta la plataforma a tus necesidades específicas."
          }
        ]}
        columns={3}
      />
      
      {/* Community Section */}
      <ProblemSection
        question="¿Tu asociación tiene miembros... pero no comunidad?"
        solution="Comunidad en Línea:"
        description="Diseñamos y construimos tu espacio digital para que tus miembros conecten, colaboren y crezcan juntos."
        benefits={[
          "Perfiles profesionales personalizados",
          "Muro de actividad y grupos temáticos",
          "Mensajes privados y foros de discusión",
          "Eventos, gamificación y etiquetas",
          "Privacidad y seguridad garantizada"
        ]}
        image={communityIllustration}
        imageAlt="Comunidad en línea"
        reverse={true}
      />
      
      <FeaturesGrid
        title="Características de Comunidad"
        subtitle="Conecta y colabora"
        features={[
          {
            icon: Users,
            title: "Perfiles profesionales",
            description: "Cada miembro tiene su espacio personalizado."
          },
          {
            icon: MessageCircle,
            title: "Muro de actividad",
            description: "Fomenta la interacción continua."
          },
          {
            icon: Shield,
            title: "Mensajes privados",
            description: "Comunicación segura y privada."
          },
          {
            icon: Calendar,
            title: "Eventos y gamificación",
            description: "Motiva la participación activa."
          },
          {
            icon: TrendingUp,
            title: "Monetización",
            description: "Genera ingresos adicionales."
          },
          {
            icon: Lock,
            title: "Seguridad garantizada",
            description: "Protección de datos empresarial."
          }
        ]}
        columns={3}
      />
      
      {/* Content Section */}
      <ProblemSection
        question="¿Tus miembros reciben información... o realmente valor?"
        solution="Blog con artículos especializados:"
        description="Creamos plataformas donde centralizar y distribuir todo tu contenido."
        benefits={[
          "Podcast para conectar en otro nivel",
          "Webinars en vivo o bajo demanda",
          "Revista digital con identidad propia",
          "Biblioteca digital organizada"
        ]}
        image={membershipIllustration}
        imageAlt="Contenido y recursos"
      />
      
      <FeaturesGrid
        title="Contenido de Valor"
        subtitle="Información que transforma"
        features={[
          {
            icon: Podcast,
            title: "Podcast",
            description: "Conecta en otro nivel con audio."
          },
          {
            icon: Video,
            title: "Webinars",
            description: "En vivo o bajo demanda."
          },
          {
            icon: BookOpen,
            title: "Revista digital",
            description: "Con identidad propia."
          },
          {
            icon: FileText,
            title: "Biblioteca digital",
            description: "Organizada y fácil de consultar."
          }
        ]}
        columns={4}
      />
      
      {/* Certifications Section */}
      <ProblemSection
        question="¿Qué tan fácil es para tus miembros aprender y certificarse contigo hoy?"
        solution="Certificaciones y Cursos en Línea:"
        description="Impulsa el desarrollo profesional de tu comunidad con una plataforma moderna de aprendizaje digital."
        benefits={[
          "Gestión integral de cursos",
          "Certificaciones digitales automáticas",
          "Control de acceso por nivel o rol",
          "Experiencia personalizada para cada usuario"
        ]}
        image={communityIllustration}
        imageAlt="Certificaciones y cursos"
        reverse={true}
      />
      
      <FeaturesGrid
        title="Aprendizaje Digital"
        subtitle="Certifica y educa"
        features={[
          {
            icon: GraduationCap,
            title: "Gestión de cursos",
            description: "Administra todo tu contenido educativo."
          },
          {
            icon: Award,
            title: "Certificaciones automáticas",
            description: "Emisión digital instantánea."
          },
          {
            icon: UserCheck,
            title: "Control de acceso",
            description: "Por nivel, rol o membresía."
          },
          {
            icon: DollarSign,
            title: "Monetización",
            description: "Pagos integrados para cursos."
          },
          {
            icon: Settings,
            title: "Personalización",
            description: "Experiencia única para cada usuario."
          }
        ]}
        columns={3}
      />
      
      {/* Marketing Section */}
      <ProblemSection
        question="¿Ya tienes una estrategia digital para atraer y retener a tus miembros?"
        solution="Marketing y Comunicación:"
        description="Optimiza la conexión con tus miembros y amplía tu alcance con estrategias digitales pensadas para asociaciones."
        benefits={[
          "Automatización de marketing multicanal",
          "Segmentación inteligente de audiencias",
          "Campañas por Email, WhatsApp y SMS",
          "Formularios y landing pages personalizadas"
        ]}
        image={membershipIllustration}
        imageAlt="Marketing y comunicación"
      />
      
      <FeaturesGrid
        title="Marketing Digital"
        subtitle="Crece y comunica"
        features={[
          {
            icon: Mail,
            title: "Automatización",
            description: "Marketing automático efectivo."
          },
          {
            icon: Target,
            title: "Segmentación",
            description: "Audiencias inteligentes."
          },
          {
            icon: Send,
            title: "Multicanal",
            description: "Email, WhatsApp, SMS."
          },
          {
            icon: Globe,
            title: "Redes sociales",
            description: "Programación automática."
          },
          {
            icon: FileCheck,
            title: "Landing pages",
            description: "Páginas personalizadas."
          },
          {
            icon: Heart,
            title: "Fidelización",
            description: "Campañas que funcionan."
          }
        ]}
        columns={3}
      />
      
      {/* Job Board Section */}
      <ProblemSection
        question="¿Tu asociación ya conecta a sus miembros con ofertas laborales?"
        solution="Bolsa de Trabajo en Línea:"
        description="Conecta a tus miembros con empleadores y oportunidades reales a través de una bolsa de trabajo hecha a la medida."
        benefits={[
          "Publicación de vacantes simplificada",
          "Perfiles y currículums de candidatos",
          "Filtros avanzados de búsqueda",
          "Opción de monetización para tu organización"
        ]}
        image={communityIllustration}
        imageAlt="Bolsa de trabajo"
        reverse={true}
      />
      
      <FeaturesGrid
        title="Bolsa de Trabajo"
        subtitle="Conecta talento"
        features={[
          {
            icon: Briefcase,
            title: "Publicación de vacantes",
            description: "Fácil y rápida para empleadores."
          },
          {
            icon: Users,
            title: "Perfiles de candidatos",
            description: "Currículums profesionales."
          },
          {
            icon: Filter,
            title: "Filtros avanzados",
            description: "Búsqueda precisa y efectiva."
          },
          {
            icon: Send,
            title: "Postulaciones automáticas",
            description: "Sistema integrado de aplicaciones."
          },
          {
            icon: DollarSign,
            title: "Monetización",
            description: "Genera ingresos adicionales."
          }
        ]}
        columns={3}
      />
      
      {/* Logo carousel */}
      <LogoCarousel />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
