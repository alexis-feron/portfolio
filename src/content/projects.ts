import type { CSSProperties } from "react";

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

/**
 * Accent colour of a project, one value per theme. A single hex can't serve
 * both: a brand colour tuned for cream loses its contrast on the dark
 * background (and vice versa), and the accent carries meaning - it tints the
 * artwork and colours the challenge numbers.
 */
export type ProjectAccent = { light: string; dark: string };

/**
 * Where the "visit" button points. A single address when the live site serves
 * every language from the same URL, one entry per locale when it doesn't -
 * sending an English reader to a French storefront is a dead end. Left out
 * while the site isn't live yet: the page then shows a "coming soon" badge
 * rather than a link to a domain that doesn't answer.
 */
export type ProjectUrl = string | Record<Locale, string>;

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  year: string;
  /** Accent colour used to tint the project page and hover states. */
  accent: ProjectAccent;
  cover: string;
  coverAlt: string;
  stack: string[];
  url?: ProjectUrl;
  repo?: string;
  content: Record<Locale, ProjectContent>;
};

export const projects: Project[] = [
  {
    slug: "picture-organic-clothing",
    kind: "company",
    title: "Picture Organic Clothing",
    year: "2026",
    accent: { light: "#111111", dark: "#ffffff" },
    cover: "/images/projects/picture-organic-clothing.png",
    coverAlt:
      "Picture Organic Clothing - page d'accueil, bannière de fin de saison, navigation par univers et sélecteur de pays",
    stack: ["Liquid", "Shopify Plus", "TypeScript", "GraphQL"],
    url: {
      fr: "https://www.picture-organic-clothing.com/fr_FR",
      en: "https://www.picture-organic-clothing.com/en_US",
    },
    content: {
      fr: {
        tagline:
          "Refonte d'un e-commerce outdoor, de Salesforce Commerce Cloud vers Shopify Plus.",
        excerpt:
          "Sortir une marque outdoor de Salesforce : un thème Liquid reconstruit de zéro et tout le catalogue rapatrié sur Shopify Plus.",
        role: "Seul développeur du projet : thème Shopify sur-mesure de bout en bout et scripts de migration des données Salesforce et Contentful",
        context:
          "Picture Organic Clothing quittait Salesforce Commerce Cloud pour Shopify Plus. En alternance chez Ultro, agence e-commerce, j'ai été le seul développeur de la refonte : reconstruire toute la boutique en Liquid et rapatrier plusieurs centaines de produits et de collections en trois langues, sans perdre une donnée en route, le tout en moins de trois mois.",
        challenges: [
          {
            title: "Un thème reconstruit de zéro",
            body: "L'ancien site était une application React sur PWA-kit : rien n'était réutilisable. Chaque écran a été réécrit en Liquid, de la page d'accueil aux collections filtrées, des fiches produit à variantes multiples au panier et à l'espace client. Tout est découpé en sections et en blocs configurables pour que les équipes Picture recomposent leurs pages sans passer par un développeur.",
          },
          {
            title: "Deux sources, un seul modèle Shopify",
            body: "Le catalogue vivait dans Salesforce, le contenu éditorial dans Contentful. Des scripts TypeScript lisent l'un via OCAPI et SCAPI, l'autre via l'API GraphQL, et écrivent dans Shopify. Les champs sans équivalent natif ont été remodélisés un par un en metafields plutôt qu'aplatis dans des descriptions.",
          },
          {
            title: "Trois langues à ne pas perdre",
            body: "Les traductions existantes ont été transférées avec le reste du catalogue, et celles qui manquaient ont été régénérées par script puis réinjectées via l'API, langue par langue. Le site est parti en production multilingue et multi-devises dès le premier jour.",
          },
        ],
        outcome:
          "Un Shopify Plus multilingue et multi-devises en ligne, où l'intégralité du catalogue et du contenu éditorial a été reprise champ par champ. Les équipes de la marque composent désormais leurs pages elles-mêmes à partir des sections du thème.",
      },
      en: {
        tagline:
          "Rebuilding an outdoor e-commerce site, from Salesforce Commerce Cloud to Shopify Plus.",
        excerpt:
          "Moving an outdoor brand off Salesforce: a Liquid theme rebuilt from scratch and the whole catalogue brought over to Shopify Plus.",
        role: "Sole developer on the project: custom Shopify theme end to end, plus the migration scripts for the Salesforce and Contentful data",
        context:
          "Picture Organic Clothing was leaving Salesforce Commerce Cloud for Shopify Plus. As an apprentice at Ultro, an e-commerce agency, I was the only developer on the rebuild: rewrite the entire store in Liquid and bring over several hundred products and collections in three languages, without losing a single record, in under three months.",
        challenges: [
          {
            title: "A theme rebuilt from scratch",
            body: "The old site was a React app on PWA-kit: nothing could be reused. Every screen was rewritten in Liquid, from the home page to filtered collections, from multi-variant product pages to the cart and the customer account. It is all split into configurable sections and blocks so the Picture team can recompose pages without a developer.",
          },
          {
            title: "Two sources, one Shopify model",
            body: "The catalogue lived in Salesforce, the editorial content in Contentful. TypeScript scripts read one through OCAPI and SCAPI, the other through the GraphQL API, and write into Shopify. Fields with no native equivalent were remodelled one by one as metafields rather than flattened into descriptions.",
          },
          {
            title: "Three languages to keep intact",
            body: "Existing translations moved across with the rest of the catalogue, and the missing ones were regenerated by script then pushed back through the API, language by language. The store went live multilingual and multi-currency from day one.",
          },
        ],
        outcome:
          "A multilingual, multi-currency Shopify Plus store in production, with the entire catalogue and editorial content carried over field by field. The brand's teams now build their own pages from the theme's sections.",
      },
    },
  },
  {
    slug: "blog-cms",
    kind: "study",
    title: "Blog CMS",
    year: "2026",
    accent: { light: "#111111", dark: "#ffffff" },
    cover: "/images/projects/blog-cms.png",
    coverAlt:
      "Blog CMS - tableau de bord de rédaction et dashboard Grafana de supervision",
    stack: [
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "Terraform",
      "Ansible",
    ],
    // Not deployed yet - restore once https://blog.alexis-feron.com is up.
    // url: "https://blog.alexis-feron.com",
    repo: "https://github.com/alexis-feron/blog",
    content: {
      fr: {
        tagline:
          "Un CMS headless livré par une chaîne CI/CD complète, du commit au serveur.",
        excerpt:
          "Le sujet n'est pas le blog : c'est tout ce qui l'emmène en production sans qu'une main se pose sur le serveur.",
        role: "Projet solo : backend NestJS, frontend Next.js, pipelines GitHub Actions, infrastructure Terraform et Ansible, supervision Prometheus et Grafana",
        context:
          "Projet du cours CI/CD à Ynov, réalisé seul en quelques jours. L'énoncé demandait une application conteneurisée et déployée automatiquement. J'ai pris le blog comme prétexte pour construire la chaîne entière : un backend NestJS découpé en Clean Architecture, un frontend Next.js rendu côté serveur, et surtout tout ce qui se passe entre un push et le conteneur qui tourne.",
        challenges: [
          {
            title: "Une CI qui bloque vraiment",
            body: "Six jobs tournent en parallèle : lint, analyse des quatre Dockerfiles par hadolint, audit des dépendances, scan Snyk, tests unitaires et tests d'intégration qui montent un vrai PostgreSQL et un vrai Redis via Testcontainers. Tous convergent vers un job final, seul statut requis par la protection de branche : aucune régression ne passe en silence. Husky et commitlint tiennent la même ligne avant même le push.",
          },
          {
            title: "Du commit au serveur, sans intervention",
            body: "La CD ne démarre que si la CI est verte sur main. Elle construit les images en multi-stage, les pousse sur GHCR avec un tag SHA immuable, les scanne, déploie en SSH puis lance un smoke test. Si ce test échoue, le déploiement revient tout seul sur le tag précédent, et un workflow manuel permet de rejouer n'importe quel SHA déjà publié.",
          },
          {
            title: "Un serveur décrit, jamais configuré à la main",
            body: "Terraform crée la machine, le réseau privé et le pare-feu ; Ansible l'installe et la déploie via trois rôles, et Traefik termine le TLS. Le backend expose son état de santé, avec un indicateur par dépendance, et ses métriques : Prometheus les collecte, Grafana les affiche sur un dashboard provisionné avec l'infrastructure, Alertmanager alerte. Le serveur est jetable et reconstructible depuis le dépôt.",
          },
        ],
        outcome:
          "Une chaîne complète du commit au conteneur supervisé. Seize fichiers de tests unitaires posés au plus près des services, guards, interceptors et repositories, deux suites d'intégration sur Testcontainers et deux parcours Playwright. Trois workflows GitHub Actions, une infrastructure reproductible et huit documents techniques qui justifient les choix d'architecture.",
      },
      en: {
        tagline:
          "A headless CMS shipped by a full CI/CD pipeline, from commit to server.",
        excerpt:
          "The point isn't the blog: it's everything that carries it to production without a hand touching the server.",
        role: "Solo project: NestJS backend, Next.js frontend, GitHub Actions pipelines, Terraform and Ansible infrastructure, Prometheus and Grafana monitoring",
        context:
          "A CI/CD course project at Ynov, built alone in a few days. The brief asked for a containerised application deployed automatically. I used the blog as a pretext to build the whole chain: a NestJS backend laid out in Clean Architecture, a server-rendered Next.js frontend, and above all everything that happens between a push and the running container.",
        challenges: [
          {
            title: "A CI that actually blocks",
            body: "Six jobs run in parallel: lint, hadolint across the four Dockerfiles, dependency audit, Snyk scan, unit tests, and integration tests that spin up a real PostgreSQL and a real Redis through Testcontainers. They all converge on a final job, the single required check on the protected branch, so no regression slips through quietly. Husky and commitlint hold the same line before the push even happens.",
          },
          {
            title: "From commit to server, hands off",
            body: "The CD pipeline only starts once CI is green on main. It builds the images in multi-stage, pushes them to GHCR under an immutable SHA tag, scans them, deploys over SSH, then runs a smoke test. If that test fails, the deployment rolls itself back to the previous tag, and a manual workflow can replay any SHA already published.",
          },
          {
            title: "A server described, never hand-configured",
            body: "Terraform creates the machine, the private network and the firewall; Ansible provisions and deploys it through three roles, and Traefik terminates TLS. The backend exposes its health, with one indicator per dependency, and its metrics: Prometheus scrapes them, Grafana renders them on a dashboard provisioned alongside the infrastructure, Alertmanager raises the alarm. The server is disposable and rebuildable from the repository.",
          },
        ],
        outcome:
          "A complete chain from commit to monitored container. Sixteen unit test files sitting next to the services, guards, interceptors and repositories, two integration suites on Testcontainers and two Playwright journeys. Three GitHub Actions workflows, a reproducible infrastructure, and eight technical documents backing the architecture decisions.",
      },
    },
  },
  {
    slug: "splits",
    kind: "personal",
    title: "Splits",
    year: "2024 - 2026",
    accent: { light: "#E7000B", dark: "#E7000B" },
    cover: "/images/projects/splits.png",
    coverAlt: "Splits - live timing, classements et calendrier F1",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "Upstash Redis",
      "Vercel",
    ],
    url: "https://splits.alexis-feron.com",
    content: {
      fr: {
        tagline:
          "Live timing, replays de Grand Prix, classements, calendrier et jeux autour de la Formule 1.",
        excerpt:
          "Suivre toute une saison de F1, de la séance d'essais au drapeau à damier, sans pub ni cookie wall.",
        role: "Conception produit, architecture, développement fullstack, infrastructure et déploiement",
        context:
          "Splits est né d'un besoin personnel : suivre la saison de Formule 1 sans publicité ni pop-up. Le projet a grandi d'un simple tableau de classements vers une PWA complète avec replays de Grand Prix, météo du week-end, actualités agrégées et des mini-jeux, développée en continu depuis novembre 2024 et publiée sur le Play Store via une TWA Android.",
        challenges: [
          {
            title: "Rejouer un Grand Prix entier",
            body: "Chaque course et chaque sprint sont rejouables : tour de piste animé depuis la télémétrie GPS, tour de classement, messages de direction de course, stratégie pneumatiques et arrêts au stand, avec contrôle de vitesse et scrubbing.",
          },
          {
            title: "Trois sources, un seul modèle de données",
            body: "Le calendrier, les classements, les résultats et la télémétrie proviennent de différentes sources. Une couche d'adaptateurs réconcilie le tout.",
          },
          {
            title: "Un cache par cadence de donnée",
            body: "Le contenu n'a pas tous la même durée de vie : calendrier revalidé toutes les 12 heures, résultats figés à 7 jours, actualités en cache Redis 30 minutes avec déduplication par similarité de Jaccard, météo historique 7 jours contre 3 heures pour les prévisions. Le site reste statique la majeure partie du temps et les APIs gratuites tiennent leurs quotas même un dimanche de course.",
          },
        ],
        outcome:
          "Un site et une application disponible sur le Play Store, consultées à chaque week-end de Grand Prix. ~22 000 lignes de TypeScript, 55 suites de tests (Jest + Testing Library), qualité suivie via SonarQube, et une passe d'accessibilité sur les contrastes et les zones tactiles.",
      },
      en: {
        tagline:
          "Formula 1 live timing, Grand Prix replays, standings, calendar and games.",
        excerpt:
          "Follow a whole F1 season, from first practice to the chequered flag, with no ads and no cookie wall.",
        role: "Product design, architecture, fullstack development, infrastructure and deployment",
        context:
          "Splits came out of a personal need: follow the Formula 1 season without ads or pop-ups. It grew from a simple standings table into a full PWA with Grand Prix replays, race-weekend weather, aggregated news and mini-games, built continuously since November 2024 and published on the Play Store as an Android TWA.",
        challenges: [
          {
            title: "Replaying an entire Grand Prix",
            body: "Every race and sprint is replayable: an animated track map driven by GPS telemetry, a timing tower, race control messages, tyre strategy and pit stops, with playback speed control and scrubbing.",
          },
          {
            title: "Three sources, one data model",
            body: "The calendar, standings, results and telemetry all come from different sources. An adapter layer reconciles them.",
          },
          {
            title: "A cache per data cadence",
            body: "Not all content ages the same way: the schedule revalidates every 12 hours, results freeze for 7 days, news sits in Redis for 30 minutes with Jaccard-similarity deduplication, historical weather lasts 7 days against 3 hours for forecasts. The site stays static most of the time and the free APIs stay within quota even on a race Sunday.",
          },
        ],
        outcome:
          "A website and an app available on the Play Store, both checked every race weekend. ~22,000 lines of TypeScript, 55 test suites (Jest + Testing Library), quality tracked with SonarQube, and an accessibility pass on contrast and touch targets.",
      },
    },
  },
];

/**
 * Inline vars for the `project-accent` class: it picks the light or the dark
 * value from the theme, so the colour resolves in CSS and is already right on
 * the very first paint. Children read it as `var(--project-accent)`.
 */
export function accentVars(accent: ProjectAccent): CSSProperties {
  return {
    "--project-accent-light": accent.light,
    "--project-accent-dark": accent.dark,
  } as CSSProperties;
}

/** Resolves a {@link ProjectUrl} against the locale the page is rendered in. */
export function projectUrl(url: ProjectUrl, locale: Locale): string {
  return typeof url === "string" ? url : url[locale];
}

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
