# Overview

This is a professional association/community management platform built as a marketing landing page. The application showcases features for managing memberships, building online communities, content creation (blogs), certifications, marketing tools, and job boards. It's designed for non-profit organizations and professional associations looking to create and manage their digital presence.

The application uses a modern React frontend with a component-based architecture, styled with Tailwind CSS and shadcn/ui components. The backend is a minimal Express server with support for PostgreSQL database integration via Drizzle ORM.


# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**Routing**: Client-side routing implemented with `wouter`, a minimal routing library. Supports:
- `/` - Homepage/landing page
- `/blog` - Blog list page showing all articles
- `/blog/:slug` - Individual blog post page
- `/podcast` - Podcast page showing all episodes
- `*` - 404 not found page

**State Management**: 
- TanStack Query (React Query) for server state management and data fetching
- React hooks for local component state
- Custom hooks for responsive behavior (`use-mobile`) and toast notifications

**Styling System**:
- Tailwind CSS as the core utility-first CSS framework
- shadcn/ui component library (New York variant) for pre-built, accessible UI components
- Custom design system based on institutional purple/yellow color scheme
- Montserrat font family from Google Fonts
- Design guidelines inspired by Stripe (minimalism) + Notion (clarity) + institutional elements

**Component Architecture**:
- Atomic design pattern with reusable UI components in `/components/ui/`
- Feature-specific components (HeroSection, FeatureCard, TestimonialCard, BlogCard, PodcastCard, etc.)
- Blog components:
  - `BlogCard`: Displays blog post preview with image, title, excerpt, category, date, and CTA
  - Blog page (`/pages/blog.tsx`): Hero section + responsive grid (1/2/3 columns) of blog posts
  - BlogPost page (`/pages/blog-post.tsx`): Individual article view with full content
- Podcast components:
  - `PodcastCard`: Displays podcast episode with artwork, title, description, episode number, duration, date, and external link
  - Podcast page (`/pages/podcast.tsx`): Hero section with branding + responsive grid (1/2/3 columns) of episodes
- Example components for demonstration purposes in `/components/examples/`
- All components use TypeScript for type safety
- data-testid attributes on all interactive and meaningful elements for testing

## Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Architecture Pattern**: Simple REST API structure with:
- Centralized route registration in `server/routes.ts`
- Storage abstraction layer via interface pattern
- Development/production mode support with environment-based configuration

**Session Management**: Built-in support for `connect-pg-simple` for PostgreSQL-backed session storage (not yet fully implemented)

**Development Tools**:
- Vite middleware integration for HMR (Hot Module Replacement)
- Custom logging with timestamp formatting
- Request/response interceptors for API monitoring
- Replit-specific plugins for development environment

## Data Storage

**ORM**: Drizzle ORM for type-safe database operations

**Database Schema**:
- Users table with UUID primary keys, username, and password fields
- Posts table with fields: id, title, slug (unique), excerpt, content, featuredImage, category, publishedAt (timestamp), author
- Podcasts table with fields: id, title, description, artwork, episodeNumber, duration, publishedAt (timestamp), externalUrl
- Schema validation using Zod for type-safe inserts
- PostgreSQL dialect with Neon serverless driver support

**Storage Pattern**: 
- Interface-based storage abstraction (`IStorage`) allowing multiple implementations
- Current implementation: In-memory storage (`MemStorage`) for development
- Ready for PostgreSQL implementation via Drizzle ORM
- CRUD operations:
  - Users: getUser, getUserByUsername, createUser
  - Posts: getPosts (sorted by publishedAt desc), getPostBySlug
  - Podcasts: getPodcasts (sorted by publishedAt desc)
- Mock data: 
  - 7 blog posts initialized with real ASPAL content covering podcasting, events, marketing, community, certifications, career development, and innovation
  - 8 podcast episodes from "Conexión Profesional" with real episode information, artwork, and external links

**Migration Strategy**: Drizzle Kit for schema management with migrations stored in `/migrations/`

## External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, navigation, popover, toast, etc.)
- Embla Carousel for image/content carousels
- Lucide React for icon system
- class-variance-authority for variant-based component styling
- cmdk for command palette functionality

**Form Handling**:
- React Hook Form with Hookform resolvers for validation
- Zod for schema validation
- Integration with Drizzle schemas via `drizzle-zod`

**Database & Backend**:
- @neondatabase/serverless for PostgreSQL connection
- Drizzle ORM and Drizzle Kit for database operations and migrations
- connect-pg-simple for session storage

**Utilities**:
- date-fns for date formatting and manipulation with Spanish locale for blog dates
- clsx and tailwind-merge for conditional class names
- nanoid for unique ID generation

**Development Tools**:
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
- esbuild for server-side bundling
- tsx for TypeScript execution

**External Services Referenced**:
- Social media platforms (Facebook, Twitter/X, LinkedIn, Instagram)
- YouTube for video content (https://youtu.be/kl4Zd89F8jk)
- External registration system (https://asociacionesprofesionales.org)
- Image assets stored in `/attached_assets/` directory

**Design Assets**:
- Custom brand logos (ASPAL) for light and dark themes
- Partner/client logos (ANPR México, Expo Mascotas, World Urban Parks)
- Generated UI mockups and illustrations
- Purple/yellow institutional color scheme
