# portfolio-v2

Portfolio d'Alexis Feron - Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lenis · React Three Fiber.

```bash
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run lint     # eslint
npm run typecheck
```

`next dev` écrit dans `.next-dev`, `next build` / `next start` dans `.next` (voir `next.config.ts`). Par défaut les deux partagent `.next` : lancer un build pendant que le serveur de dev tourne écrase les manifests qu'il sert, et toutes les routes se mettent à répondre 404 jusqu'à recompilation. Les séparer supprime le problème ; le déploiement n'est pas affecté, il lit toujours `.next`.

## Structure

```
src/
├─ app/
│  ├─ globals.css              # design system (tokens, thèmes, utilities)
│  └─ [locale]/                # racine du site - le layout ici EST le root layout
│     ├─ layout.tsx            # <html>, polices, providers, navbar, footer, metadata
│     ├─ page.tsx              # page d'accueil (assemble les sections)
│     ├─ not-found.tsx
│     └─ work/[slug]/page.tsx  # page de détail d'un projet
├─ components/
│  ├─ layout/                  # navbar, footer, theme toggle, locale switcher
│  ├─ providers/               # thème (sans flash), smooth scroll Lenis
│  ├─ sections/                # hero, about, journey, work, contact
│  ├─ three/                   # scène 3D du hero
│  └─ ui/                      # primitives réutilisables (reveal, split-text, button…)
├─ content/                    # ← LE CONTENU DU SITE
│  ├─ site.ts                  # nom, email, localisation, réseaux sociaux
│  ├─ projects.ts              # projets (+ contenu FR/EN par projet)
│  └─ experience.ts            # parcours (+ contenu FR/EN)
├─ i18n/
│  ├─ config.ts                # locales disponibles, locale par défaut
│  ├─ get-dictionary.ts
│  └─ dictionaries/{fr,en}.ts  # ← TOUS LES TEXTES D'INTERFACE
├─ lib/                        # fonts, helpers
└─ proxy.ts                    # redirection `/` → `/fr` ou `/en`
```

## Gérer le contenu

Aucun CMS, aucun service tiers : **tout le contenu est dans `src/content/` et `src/i18n/dictionaries/`**, en TypeScript typé. Une faute de frappe dans une clé ou une traduction manquante fait échouer le build.

### Modifier un texte d'interface

Ouvrir `src/i18n/dictionaries/fr.ts` (source de vérité) et `en.ts`. `fr.ts` définit le type `Dictionary` ; `en.ts` est typé `Dictionary`, donc TypeScript signale toute clé manquante ou en trop.

### Ajouter un projet

1. Déposer l'image dans `public/images/projects/`.
2. Ajouter une entrée dans `src/content/projects.ts` :

```ts
{
  slug: 'mon-projet',        // → /fr/work/mon-projet
  title: 'Mon projet',
  year: '2026',
  accent: '#EA9C43',         // teinte de la page projet
  cover: '/images/projects/mon-projet.png',
  coverAlt: '…',
  stack: ['Next.js', 'TypeScript'],
  url: 'https://…',
  repo: 'https://github.com/…',   // optionnel
  content: {
    fr: { tagline, excerpt, role, context, challenges: [{ title, body }], outcome },
    en: { … },
  },
}
```

La page de détail, le routing, les metadata et le lien « projet suivant » sont générés automatiquement.

### Ajouter une expérience

Même principe dans `src/content/experience.ts` (`end: null` = poste en cours, affiché avec l'accent orange).

### Ajouter une langue

1. Ajouter le code dans `locales` (`src/i18n/config.ts`) + `localeNames` / `localeTags`.
2. Créer `src/i18n/dictionaries/<code>.ts` typé `Dictionary`.
3. Ajouter l'entrée dans `dictionaries` (`src/i18n/get-dictionary.ts`).
4. Ajouter la traduction dans le champ `content` de chaque projet et expérience.

Le sélecteur de langue, les routes statiques et les `alternates` SEO suivent automatiquement.

## Design system

Défini dans `src/app/globals.css`.

| Token       | Clair     | Sombre    |
| ----------- | --------- | --------- |
| `bg`        | `#FDFBED` | `#191919` |
| `fg`        | `#191919` | `#FDFBED` |
| `accent`    | `#1A3263` | `#90A5CF` |
| `highlight` | `#EA9C43` | `#EA9C43` |

Gradient de marque : `var(--gradient-brand)` → utilitaire `.text-gradient` / `.bg-gradient-brand`.

**Typographie**

- Titres : _Dirtyline 36Daysoftype 2022_ (`.display-xl`, `.display-l`, `.display-m`, `font-display`).
  ⚠️ Cette police ne contient **que des capitales** : tout titre est automatiquement passé en `uppercase`. Ses glyphes débordent de leur boîte de ligne, d'où l'utilitaire `.line-mask` utilisé par les animations de révélation.
- Sous-titres : Josefin Sans **Bold** (`.subtitle`, `.eyebrow`).
- Textes : Josefin Sans **Light** (300, appliqué au `body`).

**Thème clair / sombre** - classe `.dark` sur `<html>`, posée avant le premier paint par `ThemeScript` (aucun flash). Ce composant est un client component qui **ne rend son `<script>` que côté serveur** (`if (typeof window !== "undefined") return null`) : React refuse de _créer_ une balise `<script>` pendant un rendu client et log une erreur, ce qui arrivait à chaque changement de langue puisque le layout `[locale]` est alors re-rendu dans le navigateur.

⚠️ **Le DOM n'est pas la source de vérité du thème**, c'est `localStorage`. Changer de langue re-rend le layout racine, et Next **remet alors tous les attributs de `<html>` à leur valeur serveur** : la classe posée à l'exécution disparaît (n'importe quel attribut ajouté côté client disparaît, pas seulement `class`). `ThemeProvider` relit donc `localStorage` et repose la classe dans un `useLayoutEffect` sans tableau de dépendances, ce qui la restaure dans la même frame que l'effacement, donc avant le paint. La bascule utilise l'API View Transitions quand elle est disponible.

**Scroll** - Lenis pilote le scroll, donc la restauration native de Next ne s'applique pas : `ScrollReset` (dans `smooth-scroll.tsx`) est le seul endroit qui décide où démarre une nouvelle route. Il appelle `lenis.resize()` avant chaque `scrollTo`, sinon Lenis clampe la cible sur les dimensions de la page précédente.

Le point d'arrivée des ancres est calculé dans `src/lib/scroll.ts` (`sectionScrollTop`). Il se mesure sur le **premier enfant** de la section, pas sur la section elle-même : chaque section porte 160 px de `padding-top`, donc viser son bord ferait atterrir le titre très bas avec une bande vide au-dessus. Ne pas ajouter de `scroll-mt-*` sur une section : Lenis honore aussi `scroll-margin-top` et les deux décalages se cumuleraient silencieusement.

## Internationalisation

Routing par segment `[locale]` : `/fr`, `/en`, `/fr/work/splits`…
`src/proxy.ts` (remplaçant de `middleware.ts` en Next 16) redirige `/` vers la langue du cookie `locale`, sinon celle de l'en-tête `Accept-Language`, sinon `fr`.

## À faire / points ouverts

- `site.email` dans `src/content/site.ts` est un placeholder à remplacer.
- Le formulaire de contact poste vers Formspree (endpoint repris de l'ancien portfolio) et n'a qu'un honeypot : ré-ajouter Cloudflare Turnstile si le spam revient.
- Les images de projet sont celles de l'ancien portfolio ; le contenu détaillé des pages projet est à relire.
- `public/models/*.glb` et `public/draco/` sont repris de l'ancien site, non utilisés pour l'instant.
- Les expériences passées gardent leurs lieux réels (Clermont-Ferrand) ; seule la localisation personnelle est passée à Lyon.
