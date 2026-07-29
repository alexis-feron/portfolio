import type { Locale } from "@/i18n/config";

export type ProjectContent = {
  /** One-line hook, displayed under the title. */
  tagline: string;
  /** Short paragraph used on the home page card. */
  excerpt: string;
  role: string;
  context: string;
  challenges: { title: string; body: string }[];
  outcome: string;
};

/** Drives the label shown on the card; wording lives in the dictionaries. */
export type ProjectKind = "personal" | "study" | "company";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  year: string;
  /** Accent colour used to tint the project page and hover states. */
  accent: string;
  cover: string;
  coverAlt: string;
  stack: string[];
  url: string;
  repo?: string;
  content: Record<Locale, ProjectContent>;
};

export const projects: Project[] = [
  {
    slug: "big-brain-games",
    kind: "personal",
    title: "Big Brain Games",
    year: "2024",
    accent: "#EA9C43",
    cover: "/images/projects/bigbraingames.png",
    coverAlt: "Big Brain Games - interface de jeu",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
    url: "https://big-brain-games.alexis-feron.com",
    content: {
      fr: {
        tagline: "Affrontez une IA au Blackjack et au jeu de Nim.",
        excerpt:
          "Une plateforme de jeux où l’on affronte une intelligence artificielle au Blackjack et au jeu de Nim, avec classement en temps réel.",
        role: "Conception, développement fullstack, design d’interface",
        context:
          "Big Brain Games est né d’une envie simple : transformer deux algorithmes de théorie des jeux en une expérience que l’on a envie de rejouer. L’IA du Nim s’appuie sur la stratégie optimale (somme de Nim), celle du Blackjack sur une table de décision statistique.",
        challenges: [
          {
            title: "Une IA imbattable, mais amusante",
            body: "Une IA parfaite au Nim gagne toujours. Il a fallu introduire des niveaux de difficulté et une part d’aléatoire pour garder le jeu intéressant sans le rendre trivial.",
          },
          {
            title: "Classement et persistance",
            body: "Les scores sont stockés côté serveur et agrégés pour produire un classement, avec gestion des sessions anonymes pour jouer sans créer de compte.",
          },
          {
            title: "Animations de cartes",
            body: "Les distributions de cartes sont animées de bout en bout, tout en gardant l’état de la partie strictement synchronisé avec le serveur.",
          },
        ],
        outcome:
          "Une application rapide, jouable au clavier comme au doigt, entièrement rendue côté serveur pour un premier chargement quasi instantané.",
      },
      en: {
        tagline: "Play Blackjack and Nim against the AI.",
        excerpt:
          "A game platform where you face an artificial intelligence at Blackjack and Nim, with a live leaderboard.",
        role: "Concept, fullstack development, interface design",
        context:
          "Big Brain Games started from a simple idea: turn two game-theory algorithms into something you actually want to replay. The Nim AI relies on optimal play (Nim-sum), the Blackjack one on a statistical decision table.",
        challenges: [
          {
            title: "An unbeatable yet fun AI",
            body: "A perfect Nim AI always wins. Difficulty levels and a dose of randomness were needed to keep the game interesting without making it trivial.",
          },
          {
            title: "Leaderboard and persistence",
            body: "Scores are stored server-side and aggregated into a ranking, with anonymous sessions so you can play without creating an account.",
          },
          {
            title: "Card animations",
            body: "Every deal is animated end to end while keeping game state strictly in sync with the server.",
          },
        ],
        outcome:
          "A fast application, playable with keyboard or touch, fully server-rendered for a near-instant first load.",
      },
    },
  },
  {
    slug: "game-center",
    kind: "personal",
    title: "Game Center",
    year: "2023",
    accent: "#90A5CF",
    cover: "/images/projects/gamecenter.png",
    coverAlt: "Game Center - tableau de bord esport",
    stack: ["Vue.js", "Vite", "Pinia", "REST API", "Tailwind CSS"],
    url: "https://game-center.alexis-feron.com",
    content: {
      fr: {
        tagline: "L’actualité et les résultats esport, au même endroit.",
        excerpt:
          "Un espace dédié à l’actualité et aux résultats de l’esport : matchs, équipes, tournois et classements agrégés dans une seule interface.",
        role: "Développement front-end, intégration d’API, architecture des données",
        context:
          "Suivre plusieurs jeux compétitifs signifie jongler entre des sites qui affichent tous la même chose différemment. Game Center agrège ces sources dans un tableau de bord unique et lisible.",
        challenges: [
          {
            title: "Normaliser des API hétérogènes",
            body: "Chaque source expose ses propres formats de dates, d’équipes et de scores. Une couche d’adaptateurs unifie tout cela avant l’affichage.",
          },
          {
            title: "Fraîcheur des données",
            body: "Les matchs en direct demandent des rafraîchissements fréquents sans saturer les quotas d’API : mise en cache et revalidation contrôlée.",
          },
          {
            title: "Densité d’information",
            body: "Afficher beaucoup de données sans étouffer l’utilisateur : hiérarchie typographique stricte et composants compacts.",
          },
        ],
        outcome:
          "Une interface qui condense plusieurs sources en un coup d’œil, responsive du mobile au grand écran.",
      },
      en: {
        tagline: "Esports news and results, all in one place.",
        excerpt:
          "A space dedicated to esports news and results: matches, teams, tournaments and standings aggregated into a single interface.",
        role: "Front-end development, API integration, data architecture",
        context:
          "Following several competitive games means juggling sites that all show the same thing differently. Game Center aggregates those sources into one readable dashboard.",
        challenges: [
          {
            title: "Normalising heterogeneous APIs",
            body: "Every source exposes its own date, team and score formats. An adapter layer unifies them before anything reaches the UI.",
          },
          {
            title: "Data freshness",
            body: "Live matches need frequent refreshes without blowing API quotas: caching and controlled revalidation.",
          },
          {
            title: "Information density",
            body: "Showing a lot of data without overwhelming the reader: strict typographic hierarchy and compact components.",
          },
        ],
        outcome:
          "An interface that condenses several sources at a glance, responsive from mobile to widescreen.",
      },
    },
  },
  {
    slug: "splits",
    kind: "personal",
    title: "Splits",
    year: "2025",
    accent: "#1A3263",
    cover: "/images/projects/splits.png",
    coverAlt: "Splits - classements et calendrier F1",
    stack: ["Next.js", "TypeScript", "Server Components", "Vercel"],
    url: "https://splits.alexis-feron.com",
    content: {
      fr: {
        tagline: "Classements, calendrier et jeu autour de la Formule 1.",
        excerpt:
          "Le point de rendez-vous des classements F1, du calendrier des courses et d’un jeu de pronostics entre amis.",
        role: "Conception produit, développement fullstack, déploiement",
        context:
          "Splits est né d’un besoin personnel : suivre la saison de Formule 1 sans publicités ni pop-ups, et pronostiquer les résultats avec des amis.",
        challenges: [
          {
            title: "Fuseaux horaires",
            body: "Un Grand Prix se court à Suzuka, Interlagos ou Melbourne. Toutes les sessions sont converties dans le fuseau du visiteur, sans décalage au rendu serveur.",
          },
          {
            title: "Rendu serveur et données live",
            body: "Les classements sont pré-rendus et revalidés après chaque course, ce qui garde le site statique la plupart du temps tout en restant à jour.",
          },
          {
            title: "Pronostics",
            body: "Un système de points départage les participants, avec verrouillage automatique des pronostics au départ de la course.",
          },
        ],
        outcome:
          "Un site consulté chaque week-end de Grand Prix, léger et sans distraction.",
      },
      en: {
        tagline: "Formula 1 standings, calendar and a prediction game.",
        excerpt:
          "Your one-stop destination for F1 standings, the race calendar and a prediction game to play with friends.",
        role: "Product design, fullstack development, deployment",
        context:
          "Splits came out of a personal need: follow the Formula 1 season without ads or pop-ups, and predict results with friends.",
        challenges: [
          {
            title: "Time zones",
            body: "A Grand Prix runs in Suzuka, Interlagos or Melbourne. Every session is converted to the visitor’s time zone with no server-render mismatch.",
          },
          {
            title: "Server rendering with live data",
            body: "Standings are pre-rendered and revalidated after each race, keeping the site static most of the time while staying current.",
          },
          {
            title: "Predictions",
            body: "A points system ranks participants, with predictions locked automatically at lights out.",
          },
        ],
        outcome:
          "A site checked every race weekend - light, fast and distraction-free.",
      },
    },
  },
];

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
