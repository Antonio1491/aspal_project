import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  organization: string;
  avatar?: string;
  index?: number;
}

export default function TestimonialCard({ 
  quote, 
  author, 
  role, 
  organization, 
  avatar,
  index = 0 
}: TestimonialCardProps) {
  const initials = author.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card 
      className="h-full backdrop-blur-sm bg-card/80 border-primary/20 hover-elevate transition-all duration-300"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'backwards'
      }}
      data-testid={`card-testimonial-${index}`}
    >
      <CardContent className="p-8 space-y-6">
        <Quote className="w-10 h-10 text-primary/30" />
        
        <p className="text-lg leading-relaxed text-foreground" data-testid={`text-testimonial-quote-${index}`}>
          {quote}
        </p>
        
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Avatar className="w-12 h-12" data-testid={`avatar-testimonial-${index}`}>
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="font-semibold text-foreground" data-testid={`text-testimonial-author-${index}`}>
              {author}
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
              {role}
            </div>
            <div className="text-sm font-medium text-primary" data-testid={`text-testimonial-org-${index}`}>
              {organization}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
