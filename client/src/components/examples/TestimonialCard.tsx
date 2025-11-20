import TestimonialCard from '../TestimonialCard';

export default function TestimonialCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-background">
      <TestimonialCard
        quote="Mi comunidad creció mucho más rápido de lo que esperaba, y necesitaba una forma de organizarla sin perder el toque personal. Esta herramienta me permitió ofrecer una experiencia profesional."
        author="Vitoria Martín"
        role="Directora"
        organization="ANPR MÉXICO"
        index={0}
      />
      <TestimonialCard
        quote="La automatización de membresías nos ahorró innumerables horas cada mes. Ahora podemos enfocarnos en crear valor para nuestros miembros."
        author="Carlos Rodríguez"
        role="Presidente"
        organization="Asociación de Profesionales"
        index={1}
      />
      <TestimonialCard
        quote="Nuestros miembros están más comprometidos que nunca. La plataforma facilitó la creación de una verdadera comunidad."
        author="Ana Sánchez"
        role="Coordinadora"
        organization="Colegio Profesional"
        index={2}
      />
    </div>
  );
}
