import { type User, type InsertUser, type Post, type InsertPost, type Podcast, type InsertPodcast } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  
  getPodcasts(): Promise<Podcast[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private podcasts: Map<string, Podcast>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.podcasts = new Map();
    this.initializeMockPosts();
    this.initializeMockPodcasts();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = { ...insertPost, id };
    this.posts.set(id, post);
    return post;
  }

  async getPodcasts(): Promise<Podcast[]> {
    return Array.from(this.podcasts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  private initializeMockPosts() {
    const mockPosts: InsertPost[] = [
      {
        title: "El Poder del Podcasting para las Asociaciones",
        slug: "el-poder-del-podcasting-para-las-asociaciones",
        excerpt: "Este webinar está diseñado para ofrecer a las organizaciones profesionales una visión general del potencial del podcasting como herramienta de comunicación.",
        content: "El podcasting se ha convertido en una herramienta poderosa para las asociaciones profesionales...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/10/el-poder-del.podcasting-webinar.png",
        category: "Webinar",
        author: "ASPAL",
        publishedAt: new Date("2024-10-28"),
      },
      {
        title: "El Papel de las OCVs en la Organización de Eventos",
        slug: "el-papel-de-las-ocvs-en-la-organizacion-de-eventos",
        excerpt: "Un recorrido sobre el papel que juegan las Oficinas de Convenciones y Visitantes (OCVs) en la planificación y ejecución de eventos para asociaciones.",
        content: "Las Oficinas de Convenciones y Visitantes juegan un papel fundamental...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/08/ocvs-en-la-organizacion-de-eventos-ligia-gonzalez-aspal.png",
        category: "Eventos",
        author: "ASPAL",
        publishedAt: new Date("2024-08-23"),
      },
      {
        title: "Gestión del Consejo de Directores",
        slug: "gestion-del-consejo-de-directores",
        excerpt: "La importancia de contar con un buen Consejo de Directores o Autoridades y su relación crucial con la directora o director.",
        content: "Un Consejo de Directores efectivo es fundamental para el éxito de cualquier asociación...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/08/gestion-del-consejo-de-directores-aspal.png",
        category: "Gestión",
        author: "ASPAL",
        publishedAt: new Date("2024-08-16"),
      },
      {
        title: "Gestión Efectiva del Marketing y la Comunicación",
        slug: "gestion-efectiva-del-marketing-y-la-comunicacion",
        excerpt: "Los 9 pasos para crear una gestión efectiva en el marketing y comunicación de tu organización.",
        content: "El marketing y la comunicación son pilares fundamentales para el crecimiento de las asociaciones...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/07/blog-marketing-comunicacion-aspal.png",
        category: "Marketing",
        author: "ASPAL",
        publishedAt: new Date("2024-07-24"),
      },
      {
        title: "Guía de 10 pasos para crear un sitio web efectivo con WordPress",
        slug: "guia-de-10-pasos-para-crear-un-sitio-web-efectivo-para-asociaciones-profesionales-con-wordpress",
        excerpt: "Hoja de ruta paso a paso para crear un sitio web utilizando WordPress.",
        content: "WordPress es la plataforma ideal para asociaciones profesionales que buscan crear una presencia digital...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/06/sitio-web-efectivo-wordpress-aspal.png",
        category: "Tecnología",
        author: "ASPAL",
        publishedAt: new Date("2024-06-24"),
      },
      {
        title: "El Papel de los Consejos y su Trabajo con el CEO",
        slug: "el-papel-de-los-consejos-y-su-trabajo-con-el-ceo",
        excerpt: "En el mundo de las asociaciones la relación entre el consejo directivo y el CEO es fundamental para el éxito de la organización.",
        content: "La relación entre el consejo directivo y el CEO determina en gran medida el éxito de una asociación...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/06/papel-de-consejos-aspal.png",
        category: "Liderazgo",
        author: "ASPAL",
        publishedAt: new Date("2024-06-14"),
      },
      {
        title: "Principales Tecnologías que un Profesional en Asociaciones Debe Conocer",
        slug: "18-herramientas-tecnologicas-que-puedes-usar-para-mejorar-a-tu-organizacion",
        excerpt: "Te presentamos 18 herramientas tecnológicas que puedes usar para mejorar a tu organización",
        content: "En la era digital, las asociaciones profesionales necesitan aprovechar la tecnología...",
        featuredImage: "https://asociacionesprofesionales.org/wp-content/uploads/2024/05/tecnologias-en-asociaciones.png",
        category: "Tecnología",
        author: "ASPAL",
        publishedAt: new Date("2024-05-27"),
      },
    ];

    mockPosts.forEach((insertPost) => {
      const id = randomUUID();
      const post: Post = { ...insertPost, id };
      this.posts.set(id, post);
    });
  }

  private initializeMockPodcasts() {
    const mockPodcasts: InsertPodcast[] = [
      {
        title: "Desde la OFVC de Guadalajara - ¿Qué son las Oficina de Convenciones y Visitantes?",
        description: "Hoy hablaremos de las oficinas de convenciones y visitantes. Tenemos una gran invitada, Ligia González, subdirectora de Industria de Reuniones de la OFVC de Guadalajara, quien compartirá qué es, para qué sirve y cómo te puede ayudar una oficina de convenciones y visitantes al momento de organizar el evento de tu asociación.",
        artwork: "https://asociacionesprofesionales.org/wp-content/uploads/2024/07/desde-la-ofvc-de-guadalajara.png",
        episodeNumber: "8",
        duration: "38:00",
        publishedAt: new Date("2024-07-31"),
        externalUrl: "https://asociacionesprofesionales.org/desde-la-ofvc-de-guadalajara/",
      },
      {
        title: "Potencia tu Asociación",
        description: "Entrevista con nuestro invitado Juan Carlos García, donde hablamos sobre la Planeación Estratégica de las Organizaciones y cómo potenciar el impacto de tu asociación profesional.",
        artwork: "https://asociacionesprofesionales.org/wp-content/uploads/2024/07/potencia-tu-aso_64604928-1.png",
        episodeNumber: "7",
        duration: "42:15",
        publishedAt: new Date("2024-07-17"),
        externalUrl: "https://asociacionesprofesionales.org/potencia-tu-asociacion/",
      },
      {
        title: "Organizaciones con Fines de Flujo - Parte 2",
        description: "Continuación de nuestra conversación sobre cómo transformar nuestras organizaciones de sin fines de lucro a con fines de flujo, explorando estrategias innovadoras para crear valor sostenible.",
        artwork: "https://asociacionesprofesionales.org/wp-content/uploads/2024/07/organizaciones_con_fines_de_flujo_parte2_aspal.png",
        episodeNumber: "6",
        duration: "45:30",
        publishedAt: new Date("2024-07-03"),
        externalUrl: "https://asociacionesprofesionales.org/organizaciones-organizaciones-con-fines-de-flujo-continuacion/",
      },
      {
        title: "Organizaciones con Fines de Flujo - Parte 1",
        description: "Primera parte donde exploramos el concepto revolucionario de organizaciones con fines de flujo y cómo este enfoque puede transformar la manera en que operan las asociaciones profesionales.",
        artwork: "https://artwork.captivate.fm/17205524-2959-4eef-b987-80145a164ec6/m4PuKR4KDhqNYuPXl3WDsW9k.jpg",
        episodeNumber: "5",
        duration: "40:22",
        publishedAt: new Date("2024-06-19"),
        externalUrl: "https://asociacionesprofesionales.org/podcast/",
      },
      {
        title: "El Poder de las Comunidades Profesionales",
        description: "Descubre cómo las comunidades profesionales pueden impulsar el crecimiento y desarrollo de tus miembros, creando redes de valor que trascienden los límites geográficos.",
        artwork: "https://artwork.captivate.fm/17205524-2959-4eef-b987-80145a164ec6/m4PuKR4KDhqNYuPXl3WDsW9k.jpg",
        episodeNumber: "4",
        duration: "35:45",
        publishedAt: new Date("2024-06-05"),
        externalUrl: "https://asociacionesprofesionales.org/podcast/",
      },
      {
        title: "Innovación en la Gestión de Eventos",
        description: "Exploramos las últimas tendencias y mejores prácticas en la organización de eventos para asociaciones profesionales, desde eventos presenciales hasta híbridos y virtuales.",
        artwork: "https://artwork.captivate.fm/17205524-2959-4eef-b987-80145a164ec6/m4PuKR4KDhqNYuPXl3WDsW9k.jpg",
        episodeNumber: "3",
        duration: "38:50",
        publishedAt: new Date("2024-05-22"),
        externalUrl: "https://asociacionesprofesionales.org/podcast/",
      },
      {
        title: "Certificaciones Profesionales: Estrategias de Implementación",
        description: "Conversamos sobre cómo diseñar, implementar y gestionar programas de certificación profesional que agreguen valor real a tus miembros y fortalezcan la reputación de tu asociación.",
        artwork: "https://artwork.captivate.fm/17205524-2959-4eef-b987-80145a164ec6/m4PuKR4KDhqNYuPXl3WDsW9k.jpg",
        episodeNumber: "2",
        duration: "41:10",
        publishedAt: new Date("2024-05-08"),
        externalUrl: "https://asociacionesprofesionales.org/podcast/",
      },
      {
        title: "Bienvenidos a Conexión Profesional",
        description: "En nuestro episodio inaugural, te damos la bienvenida a Conexión Profesional, el podcast que explora y fortalece las redes en asociaciones profesionales. Descubre qué nos motiva y qué puedes esperar en futuros episodios.",
        artwork: "https://artwork.captivate.fm/17205524-2959-4eef-b987-80145a164ec6/m4PuKR4KDhqNYuPXl3WDsW9k.jpg",
        episodeNumber: "1",
        duration: "25:30",
        publishedAt: new Date("2024-04-24"),
        externalUrl: "https://asociacionesprofesionales.org/podcast/",
      },
    ];

    mockPodcasts.forEach((insertPodcast) => {
      const id = randomUUID();
      const podcast: Podcast = { ...insertPodcast, id };
      this.podcasts.set(id, podcast);
    });
  }
}

export const storage = new MemStorage();
