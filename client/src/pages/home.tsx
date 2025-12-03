import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { MembershipProblemSection } from "@/components/ProblemSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import membershipImage from "@assets/recurso-13-membresias.png";
import communityImage from "@assets/recurso-8-comunidad.png";
import blogImage from "@assets/recurso-3-blog.png";
import certificationsImage from "@assets/recurso-40-certificaciones.png";
import marketingImage from "@assets/recurso-27-marketing.png";
import jobBoardImage from "@assets/recurso-26-bolsa-trabajo.png";
import ProblemSection from "@/components/ProblemSection";

interface WPPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
  author: string;
  link: string;
}
import { 
  NetworkNodes, 
  FloatingDots, 
  HexagonNetwork, 
  PeopleCircle, 
  GrowthChart,
  DecorativeBlob,
  ConnectionLines
} from "@/components/CommunityGraphics";
import { 
  Users, MessageCircle, Shield, Calendar, TrendingUp, Lock,
  BookOpen, Podcast, Video, FileText,
  GraduationCap, Award, UserCheck, DollarSign, Settings,
  Mail, Target, BarChart, Globe, Tag, Heart,
  Briefcase, FileCheck, Filter, Send, Wallet
} from "lucide-react";

export default function Home() {
  const { data: posts, isLoading: postsLoading } = useQuery<WPPost[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top right network */}
        <div className="absolute -top-20 -right-20 w-80 h-80 opacity-30">
          <NetworkNodes />
        </div>
        
        {/* Left side floating dots */}
        <div className="absolute top-[30%] -left-10 w-48 h-48 opacity-40">
          <FloatingDots />
        </div>
        
        {/* Right side hexagon */}
        <div className="absolute top-[50%] -right-16 w-64 h-64 opacity-20">
          <HexagonNetwork />
        </div>
        
        {/* Bottom left blob */}
        <div className="absolute bottom-[20%] -left-20 w-96 h-96">
          <DecorativeBlob variant="secondary" />
        </div>
        
        {/* Bottom right people circle */}
        <div className="absolute bottom-[40%] -right-24 w-72 h-72 opacity-25">
          <PeopleCircle />
        </div>
      </div>
      
      <Header />
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
      
      {/* Community Section with decorative graphic */}
      <div className="relative">
        {/* Inline decorative element */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-32 h-32 opacity-20 hidden md:block">
          <PeopleCircle />
        </div>
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
          image={communityImage}
          imageAlt="Comunidad en línea"
          reverse={true}
        />
      </div>
      
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
        image={blogImage}
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
      
      {/* Blog Posts Section */}
      <section className="py-16 md:py-24 bg-muted/30" data-testid="section-blog-home">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Últimos <span className="text-secondary">Artículos</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recursos, guías y mejores prácticas para asociaciones profesionales
            </p>
          </motion.div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-2xl"
                  data-testid={`skeleton-post-home-${i}`}
                />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {posts.slice(0, 6).map((post) => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </section>
      
      {/* Certifications Section with decorative graphic */}
      <div className="relative">
        {/* Growth chart decoration */}
        <div className="absolute right-8 top-8 w-40 h-32 opacity-15 hidden lg:block">
          <GrowthChart />
        </div>
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
          image={certificationsImage}
          imageAlt="Certificaciones y cursos"
          reverse={true}
        />
      </div>
      
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
      
      {/* Marketing Section with connection lines */}
      <div className="relative">
        {/* Connection lines decoration */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-48 opacity-10 hidden lg:block">
          <ConnectionLines />
        </div>
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
          image={marketingImage}
          imageAlt="Marketing y comunicación"
        />
      </div>
      
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
      
      {/* Job Board Section with network graphic */}
      <div className="relative">
        {/* Network nodes decoration */}
        <div className="absolute right-4 bottom-8 w-48 h-48 opacity-15 hidden lg:block">
          <NetworkNodes />
        </div>
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
          image={jobBoardImage}
          imageAlt="Bolsa de trabajo"
          reverse={true}
        />
      </div>
      
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
      
      {/* Testimonials - Hidden */}
      {/* <TestimonialsSection /> */}
      
      {/* CTA */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
