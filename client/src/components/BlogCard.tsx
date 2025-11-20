import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Post } from "@shared/schema";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-post-${post.id}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          data-testid={`img-post-featured-${post.id}`}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-secondary text-secondary-foreground" data-testid={`badge-category-${post.id}`}>
            {post.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="flex-1">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer" data-testid={`text-post-title-${post.id}`}>
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3" data-testid={`text-post-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <time dateTime={new Date(post.publishedAt).toISOString()} data-testid={`text-post-date-${post.id}`}>
            {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
          </time>
        </div>
        
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" asChild data-testid={`button-read-more-${post.id}`}>
          <Link href={`/blog/${post.slug}`}>
            Leer más
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
