import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Post } from "@shared/schema";

const CATEGORIES = [
  { name: "Todos", color: "bg-secondary" },
  { name: "Podcasting", color: "bg-blue-500" },
  { name: "Eventos", color: "bg-green-500" },
  { name: "Marketing", color: "bg-purple-500" },
  { name: "Comunidad", color: "bg-orange-500" },
  { name: "Certificaciones", color: "bg-pink-500" },
  { name: "Carrera", color: "bg-cyan-500" },
  { name: "Innovación", color: "bg-rose-500" },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const featuredPost = useMemo(() => {
    return posts?.[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const otherPosts = posts.slice(1);
    if (activeCategory === "Todos") return otherPosts;
    return otherPosts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Split Panel Design */}
      <section className="relative bg-primary overflow-hidden" data-testid="section-blog-hero">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch min-h-[400px]">
            {/* Left Panel - Title with decorative element */}
            <motion.div
              className="relative flex flex-col justify-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-foreground/5 to-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-secondary" />
              <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-secondary/60" />
              <div className="absolute top-1/2 right-16 w-2 h-2 rounded-full bg-primary-foreground/40" />

              {/* Abstract globe illustration */}
              <div className="absolute right-4 bottom-4 opacity-20">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" className="text-secondary" />
                  <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" className="text-primary-foreground/30" />
                  <ellipse cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="1" className="text-secondary/60" />
                  <path d="M100 20 Q140 100 100 180" stroke="currentColor" strokeWidth="1" className="text-primary-foreground/40" fill="none" />
                  <path d="M100 20 Q60 100 100 180" stroke="currentColor" strokeWidth="1" className="text-primary-foreground/40" fill="none" />
                </svg>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight relative z-10"
                data-testid="text-blog-title"
              >
                Artículos de<br />
                <span className="text-secondary">Conocimiento</span>
              </h1>

              <p className="mt-4 text-primary-foreground/70 text-lg max-w-md relative z-10">
                Recursos, guías y mejores prácticas para asociaciones profesionales
              </p>
            </motion.div>

            {/* Right Panel - Featured Article */}
            {featuredPost && (
              <motion.div
                className="relative flex flex-col bg-card rounded-3xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {/* Featured image as background */}
                <div className="absolute inset-0">
                  <img
                    src={featuredPost.featuredImage}
                    alt=""
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/95 to-card/80" />
                </div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-end">
                  <Badge
                    className="self-start mb-4 bg-secondary text-secondary-foreground font-semibold px-3 py-1"
                    data-testid="badge-featured"
                  >
                    Artículo Destacado
                  </Badge>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer leading-tight"
                      data-testid="text-featured-title"
                    >
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p
                    className="mt-4 text-muted-foreground line-clamp-3 text-base md:text-lg"
                    data-testid="text-featured-excerpt"
                  >
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="uppercase tracking-wide font-medium text-foreground">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {estimateReadTime(featuredPost.content)} min lectura
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <motion.span
                      className="inline-flex items-center gap-2 mt-6 text-primary font-semibold cursor-pointer"
                      whileHover={{ x: 5 }}
                      data-testid="link-read-featured"
                    >
                      Leer artículo
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 37 768 43 864 45C960 47 1056 45 1152 41.7C1248 38 1344 33 1392 30.8L1440 28.5V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Topics/Categories Filter */}
      <section className="py-12 md:py-16" data-testid="section-topics">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8" data-testid="text-topics-title">
              Temas de Interés
            </h2>

            <div className="flex flex-wrap gap-3" data-testid="filter-categories">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium transition-all
                    ${activeCategory === category.name
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`button-category-${category.name}`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      activeCategory === category.name ? "bg-secondary" : category.color
                    }`}
                  />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-16 md:pb-24" data-testid="section-posts-grid">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-2xl"
                  data-testid={`skeleton-post-${i}`}
                />
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
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
              {filteredPosts.map((post) => (
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
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg" data-testid="text-no-posts">
                No hay artículos en esta categoría.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
