export const fr = {
  meta: {
    title: "Alexis Feron - Développeur Web Fullstack",
    description:
      "Portfolio d’Alexis Feron, développeur web fullstack basé à Lyon. Interfaces sur mesure, backend et applications web performantes.",
    keywords:
      "Alexis Feron, portfolio, développeur web, fullstack, react, next.js, typescript, backend",
    ogAlt: "Portfolio d’Alexis Feron",
  },

  nav: {
    home: "Accueil",
    about: "À propos",
    work: "Projets",
    journey: "Parcours",
    contact: "Contact",
    menu: "Menu",
    close: "Fermer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },

  actions: {
    toggleTheme: "Changer de thème",
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    switchLanguage: "Changer de langue",
    backToTop: "Retour en haut",
    scroll: "Défiler",
  },

  hero: {
    greeting: "Portfolio",
    firstName: "Alexis",
    lastName: "Feron",
    role: "Développeur Web Fullstack",
    tagline:
      "Je conçois et développe des expériences web soignées, rapides et vivantes.",
    location: "Lyon, France",
    scrollHint: "Défiler",
  },

  about: {
    eyebrow: "À propos",
    title: "Salut,",
    intro:
      "Je suis Alexis, développeur web chez Ultrō et étudiant en Master développement fullstack à Ynov Lyon.",
    paragraphs: [
      "Depuis cinq ans, je construis des produits web du premier pixel jusqu’à la mise en production : interfaces animées, APIs, bases de données et déploiement.",
      "Ce qui m’anime, c’est le détail, la transition qui tombe juste, la page qui charge en un clin d’œil, le code que l’on relit avec plaisir six mois plus tard.",
      "Quand je ne code pas, je suis probablement en train de suivre un Grand Prix de Formule 1, de courir ou de tester une nouvelle idée de side-project.",
    ],
    cta: "Écrivez-moi",
    stats: [
      { value: "5+", label: "Années de code" },
      { value: "20+", label: "Projets livrés" },
      { value: "3", label: "Langues parlées" },
    ],
    portraitAlt: "Portrait d’Alexis Feron",
  },

  journey: {
    eyebrow: "Parcours",
    title: "Expériences & formation",
    description: "4 années d'alternance, un bac+5, et beaucoup de projets",
    present: "Aujourd’hui",
    scrollHint: "Faites défiler pour explorer",
    kinds: {
      work: "Travail",
      education: "Études",
    },
  },

  work: {
    eyebrow: "Projets sélectionnés",
    title: "Selected work",
    description:
      "Une sélection de projets personnels et professionnels, du concept au déploiement.",
    viewProject: "Voir le projet",
    kinds: {
      personal: "Projet personnel",
      study: "Projet d’études",
      company: "Projet d’entreprise",
    },
  },

  project: {
    back: "Retour aux projets",
    next: "Projet suivant",
    overview: "Aperçu",
    role: "Rôle",
    year: "Année",
    stack: "Technologies",
    context: "Contexte",
    challenges: "Défis",
    outcome: "Résultat",
    visit: "Visiter le site",
    comingSoon: "Bientôt en ligne",
    source: "Code source",
    notFound: "Ce projet n’existe pas.",
  },

  contact: {
    eyebrow: "Contact",
    title: "On en parle ?",
    description: "Un projet, une opportunité ou simplement envie d’échanger ?",
    form: {
      name: "Votre nom",
      email: "Votre email",
      message: "Votre message",
      submit: "Envoyer le message",
      sending: "Envoi…",
      success: "Message envoyé, merci ! Je reviens vers vous très vite.",
      error:
        "Oups, l’envoi a échoué. Réessayez ou écrivez-moi directement par mail à contact@alexis-feron.com.",
      required: "Ce champ est requis",
      invalidEmail: "Adresse email invalide",
      captchaRequired:
        "Merci de valider la vérification anti-spam avant d’envoyer.",
    },
  },

  footer: {
    builtWith: "Conçu et développé avec soin",
    rights: "Tous droits réservés",
    localTime: "Heure locale",
  },

  notFound: {
    title: "Page introuvable",
    description:
      "Cette page s’est éparpillée en route : elle a changé d’adresse, ou n’a jamais existé.",
    cta: "Retour à l’accueil",
  },
};

/**
 * The French dictionary is the source of truth: every other locale is checked
 * against this shape at compile time.
 */
export type Dictionary = typeof fr;
