/*
 * L'adresse officielle du site : oysen.fr redirige vers www.oysen.fr
 * (Vercel, 308). Les canonical, et plus tard le sitemap, og:url et le
 * JSON-LD, pointent donc toutes sur la version www, en https.
 */
export const SITE = 'https://www.oysen.fr'

/**
 * La balise canonical d'une page, à poser dans les `links` de sa route.
 *
 * Le chemin s'écrit sans barre finale (« /contact », pas « /contact/ ») et
 * sans paramètres : « /contact?theme=mariage » a pour canonical « /contact ».
 * L'accueil seul garde sa barre : « https://www.oysen.fr/ ».
 */
export function canonical(chemin: string) {
  return { rel: 'canonical', href: chemin === '/' ? `${SITE}/` : `${SITE}${chemin}` }
}
