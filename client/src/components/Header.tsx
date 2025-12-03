import logoLight from "@assets/ASPAL-para fondo claro_1763675327795.png";
import logoDark from "@assets/ASPAL-para fondo oscuro_1763675345456.png";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, X, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with 50% opacity */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="header-modal-backdrop"
          />
          
          {/* Modal wrapper with close button above */}
          <motion.div
            className="relative z-10 w-full max-w-4xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Close button - positioned above and to the right of video */}
            <div className="flex justify-end mb-3">
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                onClick={onClose}
                data-testid="header-button-close-modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Video container with 16:9 aspect ratio */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/kl4Zd89F8jk?autoplay=1&rel=0"
                title="Video de presentación"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="header-iframe-video"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aprendeOpen, setAprendeOpen] = useState(false);
  const [participaOpen, setParticipaOpen] = useState(false);
  const [bolsaOpen, setBolsaOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center" data-testid="link-logo">
              <img 
                src={logoLight} 
                alt="Aspal" 
                className="h-8 w-auto dark:hidden"
                data-testid="img-logo-light"
              />
              <img 
                src={logoDark} 
                alt="Aspal" 
                className="h-8 w-auto hidden dark:block"
                data-testid="img-logo-dark"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Aprende Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger data-testid="menu-aprende">
                  Aprende
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link
                        href="/blog"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none" data-testid="link-blog">Blog</div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/podcast"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-podcast"
                      >
                        <div className="text-sm font-medium leading-none">Podcast</div>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#biblioteca"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-biblioteca"
                      >
                        <div className="text-sm font-medium leading-none">Biblioteca Digital</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#cursos"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-cursos"
                      >
                        <div className="text-sm font-medium leading-none">Cursos en Línea</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#documentos"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-documentos"
                      >
                        <div className="text-sm font-medium leading-none">Documentos</div>
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Participa Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger data-testid="menu-participa">
                  Participa
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[240px] gap-3 p-4">
                    <li>
                      <a
                        href="#comunidad"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-comunidad"
                      >
                        <div className="text-sm font-medium leading-none">Comunidad</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#directorio-miembros"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-directorio-miembros"
                      >
                        <div className="text-sm font-medium leading-none">Directorio de Miembros</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#directorio-industria"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-directorio-industria"
                      >
                        <div className="text-sm font-medium leading-none">Directorio de la Industria</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#eventos"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-eventos"
                      >
                        <div className="text-sm font-medium leading-none">Eventos y Grupos</div>
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Bolsa de Trabajo Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger data-testid="menu-bolsa">
                  Bolsa de Trabajo
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-3 p-4">
                    <li>
                      <a
                        href="#bolsa-home"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-bolsa-home"
                      >
                        <div className="text-sm font-medium leading-none">Home</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#candidatos"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-candidatos"
                      >
                        <div className="text-sm font-medium leading-none">Candidatos</div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#reclutadores"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        data-testid="link-reclutadores"
                      >
                        <div className="text-sm font-medium leading-none">Reclutadores</div>
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Se Miembro */}
              <NavigationMenuItem>
                <a
                  href="https://comunidad.asociacionesprofesionales.org/register/membresia-basica/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navigationMenuTriggerStyle()}
                  data-testid="link-se-miembro"
                >
                  Sé Miembro
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" data-testid="button-login">
              Iniciar sesión
            </Button>
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90" 
              onClick={() => setIsVideoOpen(true)}
              data-testid="button-demo"
            >
              <Play className="mr-2 w-4 h-4" />
              Ver Video
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {/* Aprende Collapsible */}
              <Collapsible open={aprendeOpen} onOpenChange={setAprendeOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" data-testid="mobile-menu-aprende">
                  Aprende
                  <ChevronDown className={`h-4 w-4 transition-transform ${aprendeOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2 pt-2">
                  <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-blog">
                    Blog
                  </Link>
                  <Link href="/podcast" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-podcast">
                    Podcast
                  </Link>
                  <a href="#biblioteca" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-biblioteca">
                    Biblioteca Digital
                  </a>
                  <a href="#cursos" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-cursos">
                    Cursos en Línea
                  </a>
                  <a href="#documentos" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-documentos">
                    Documentos
                  </a>
                </CollapsibleContent>
              </Collapsible>

              {/* Participa Collapsible */}
              <Collapsible open={participaOpen} onOpenChange={setParticipaOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" data-testid="mobile-menu-participa">
                  Participa
                  <ChevronDown className={`h-4 w-4 transition-transform ${participaOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2 pt-2">
                  <a href="#comunidad" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-comunidad">
                    Comunidad
                  </a>
                  <a href="#directorio-miembros" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-directorio-miembros">
                    Directorio de Miembros
                  </a>
                  <a href="#directorio-industria" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-directorio-industria">
                    Directorio de la Industria
                  </a>
                  <a href="#eventos" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-eventos">
                    Eventos y Grupos
                  </a>
                </CollapsibleContent>
              </Collapsible>

              {/* Bolsa de Trabajo Collapsible */}
              <Collapsible open={bolsaOpen} onOpenChange={setBolsaOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" data-testid="mobile-menu-bolsa">
                  Bolsa de Trabajo
                  <ChevronDown className={`h-4 w-4 transition-transform ${bolsaOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2 pt-2">
                  <a href="#bolsa-home" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-bolsa-home">
                    Home
                  </a>
                  <a href="#candidatos" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-candidatos">
                    Candidatos
                  </a>
                  <a href="#reclutadores" className="block text-sm text-muted-foreground hover:text-foreground py-1" data-testid="mobile-link-reclutadores">
                    Reclutadores
                  </a>
                </CollapsibleContent>
              </Collapsible>

              {/* Se Miembro */}
              <a 
                href="https://comunidad.asociacionesprofesionales.org/register/membresia-basica/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="mobile-link-se-miembro"
              >
                Sé Miembro
              </a>

              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" className="w-full" data-testid="button-mobile-login">
                  Iniciar sesión
                </Button>
                <Button 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  onClick={() => {
                    setIsVideoOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  data-testid="button-mobile-demo"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Ver Video
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </header>
  );
}
