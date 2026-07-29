import type { Locale } from "@/i18n/config";

export type ExperienceKind = "work" | "education";

export type Experience = {
  id: string;
  kind: ExperienceKind;
  organisation: string;
  location: string;
  /** ISO-ish start/end. `null` end means "still going". */
  start: string;
  end: string | null;
  tags: string[];
  content: Record<
    Locale,
    { title: string; period: string; description: string }
  >;
};

export const experiences: Experience[] = [
  {
    id: "ynov",
    kind: "education",
    organisation: "Ynov",
    location: "Lyon, France",
    start: "2025-09",
    end: null,
    tags: ["TypeScript", "Supabase", "Prisma", "Hono"],
    content: {
      fr: {
        title: "Mastère Développement Fullstack",
        period: "Septembre 2025 - Aujourd’hui",
        description:
          "Architecture d’applications, DevOps, sécurité et développement fullstack avancé, en alternance avec Ultrō.",
      },
      en: {
        title: "Master’s degree in Fullstack Development",
        period: "September 2025 - Present",
        description:
          "Application architecture, DevOps, security and advanced fullstack development, alongside my apprenticeship at Ultrō.",
      },
    },
  },
  {
    id: "ultro",
    kind: "work",
    organisation: "Ultrō",
    location: "Clermont-Ferrand, France",
    start: "2023-09",
    end: null,
    tags: ["Next.js", "React", "Shopify", "Pipedream"],
    content: {
      fr: {
        title: "Développeur web en alternance",
        period: "Septembre 2023 - Aujourd’hui",
        description:
          "Développement de sites e-commerce et d’outils internes : intégrations Shopify, applications Next.js et automatisations Pipedream.",
      },
      en: {
        title: "Web developer apprentice",
        period: "September 2023 - Present",
        description:
          "Building e-commerce sites and internal tools: Shopify integrations, Next.js applications and Pipedream automations.",
      },
    },
  },
  {
    id: "radar",
    kind: "work",
    organisation: "Radar Technologies",
    location: "Cournon-d’Auvergne, France",
    start: "2023-04",
    end: "2023-06",
    tags: ["PHP", "MVC", "Tests unitaires"],
    content: {
      fr: {
        title: "Stage développeur web",
        period: "Avril 2023 - Juin 2023",
        description:
          "Développement de fonctionnalités sur une application PHP en architecture MVC, avec mise en place de tests unitaires.",
      },
      en: {
        title: "Web developer internship",
        period: "April 2023 - June 2023",
        description:
          "Shipping features on a PHP application built on an MVC architecture, and introducing unit tests.",
      },
    },
  },
  {
    id: "but-info",
    kind: "education",
    organisation: "IUT Clermont Auvergne",
    location: "Clermont-Ferrand, France",
    start: "2021-09",
    end: "2024-06",
    tags: [
      "JavaScript",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Angular",
      "Vue.js",
    ],
    content: {
      fr: {
        title: "BUT Informatique",
        period: "2021 - 2024",
        description:
          "Trois ans de fondations : algorithmique, bases de données, réseaux, gestion de projet et développement web.",
      },
      en: {
        title: "Bachelor of Technology in Computer Science",
        period: "2021 - 2024",
        description:
          "Three years of fundamentals: algorithms, databases, networking, project management and web development.",
      },
    },
  },
];
