import type { Dictionary } from "./fr";

export const en: Dictionary = {
  meta: {
    title: "Alexis Feron - Fullstack Web Developer",
    description:
      "Portfolio of Alexis Feron, fullstack web developer based in Lyon, France. Bespoke interfaces, backend and fast web applications.",
    keywords:
      "Alexis Feron, portfolio, web developer, fullstack, react, next.js, typescript, backend",
    ogAlt: "Alexis Feron’s portfolio",
  },

  nav: {
    home: "Home",
    about: "About",
    work: "Work",
    journey: "Journey",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  actions: {
    toggleTheme: "Toggle theme",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    switchLanguage: "Switch language",
    backToTop: "Back to top",
    scroll: "Scroll",
  },

  hero: {
    greeting: "Portfolio",
    firstName: "Alexis",
    lastName: "Feron",
    role: "Fullstack Web Developer",
    tagline: "I design and build polished, fast and alive web experiences.",
    location: "Lyon, France",
    scrollHint: "Scroll",
  },

  about: {
    eyebrow: "About me",
    title: "Hi,",
    intro:
      "I’m Alexis, web developer at Ultrō and a master’s student in fullstack development at Ynov Lyon.",
    paragraphs: [
      "For the past five years I’ve been building web products from the very first pixel to production: animated interfaces, APIs, databases and deployment.",
      "What drives me is the detail, the transition that lands just right, the page that loads in a blink, the code that still reads well six months later.",
      "When I’m not coding, I’m probably watching Formula 1, running or prototyping yet another side project.",
    ],
    cta: "Send me a message",
    stats: [
      { value: "5+", label: "Years of code" },
      { value: "20+", label: "Projects shipped" },
      { value: "3", label: "Languages spoken" },
    ],
    portraitAlt: "Portrait of Alexis Feron",
  },

  journey: {
    eyebrow: "Journey",
    title: "Experience & education",
    description:
      "4 years of apprenticeship, a master’s degree, and plenty of projects",
    present: "Present",
    scrollHint: "Scroll to explore",
    kinds: {
      work: "Work",
      education: "Study",
    },
  },

  work: {
    eyebrow: "Selected projects",
    title: "Selected work",
    description:
      "A selection of personal and professional projects, from concept to deployment.",
    viewProject: "View project",
    kinds: {
      personal: "Personal project",
      study: "Study project",
      company: "Company project",
    },
  },

  project: {
    back: "Back to work",
    next: "Next project",
    overview: "Overview",
    role: "Role",
    year: "Year",
    stack: "Stack",
    context: "Context",
    challenges: "Challenges",
    outcome: "Outcome",
    visit: "Visit website",
    source: "Source code",
    notFound: "This project does not exist.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Let’s talk",
    description: "Got a project, an opportunity, or just want to say hi?",
    form: {
      name: "Your name",
      email: "Your email",
      message: "Your message",
      submit: "Send message",
      sending: "Sending…",
      success: "Message sent, thank you! I’ll get back to you shortly.",
      error:
        "Something went wrong. Try again or email me directly at contact@alexis-feron.com.",
      required: "This field is required",
      invalidEmail: "Invalid email address",
    },
  },

  footer: {
    builtWith: "Designed & built with care",
    rights: "All rights reserved",
    localTime: "Local time",
  },

  notFound: {
    title: "Page not found",
    description: "The page you’re looking for has moved or no longer exists.",
    cta: "Back home",
  },
};
