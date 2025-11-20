import { type User, type InsertUser, type Post, type InsertPost } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.initializeMockPosts();
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
}

export const storage = new MemStorage();
