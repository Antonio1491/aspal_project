import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

interface BlogCardProps {
  post: WPPost;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Podcasting: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Eventos: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Marketing: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    Comunidad: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Certificaciones: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    Carrera: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    Innovación: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return colors[category] || "bg-secondary/10 text-secondary-foreground border-secondary/20";
};

export default function BlogCard({ post }: BlogCardProps) {
  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer">
      <motion.div
        className="group h-full cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <Card
          className="h-full flex flex-col overflow-hidden bg-card border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
          data-testid={`card-post-${post.id}`}
        >
          {/* Image container */}
          <div className="relative h-52 overflow-hidden bg-muted/30">
            <motion.img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              data-testid={`img-post-featured-${post.id}`}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Arrow icon on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-2 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-6">
            {/* Category and read time */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <Badge
                variant="outline"
                className={`text-xs font-medium border ${getCategoryColor(post.category)}`}
                data-testid={`badge-category-${post.id}`}
              >
                {post.category}
              </Badge>
              
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {estimateReadTime(post.content)} min
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3"
              data-testid={`text-post-title-${post.id}`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p
              className="text-sm text-muted-foreground line-clamp-2 flex-1"
              data-testid={`text-post-excerpt-${post.id}`}
            >
              {post.excerpt}
            </p>

            {/* Footer with date */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground" data-testid={`text-post-date-${post.id}`}>
                {format(new Date(post.publishedAt), "d MMM, yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </a>
  );
}
