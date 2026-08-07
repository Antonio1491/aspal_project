import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollRestoration } from "@/components/layout/ScrollRestoration";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Podcast from "@/pages/podcast";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/podcast" component={Podcast} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Respeta prefers-reduced-motion en todo framer-motion. El CSS de
          Tailwind necesita su propia media query en index.css: esto no lo
          cubre. Parte del público lo tiene activado por motivos médicos. */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <ScrollRestoration />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
          <ScrollToTop />
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}

export default App;
