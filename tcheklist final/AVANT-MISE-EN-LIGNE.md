# Checklist avant mise en ligne — Oysen

> Le site est actuellement **volontairement invisible** des moteurs de recherche.
> Tant que ces blocages sont en place, Google n'affichera **jamais** le site,
> même une fois le nom de domaine branché.
>
> **À traiter le jour du lancement.**

---

## 1. Débloquer l'indexation (OBLIGATOIRE)

Les deux blocages doivent être retirés. Retirer un seul ne suffit pas.

### ☐ a) `public/robots.txt`

Contenu actuel (bloque tout) :

```
User-agent: *
Disallow: /
```

À remplacer par :

```
User-agent: *
Allow: /
```

### ☐ b) `src/routes/__root.tsx` (~ligne 13-14)

Supprimer ces deux lignes :

```tsx
// Site non lancé : on bloque l'indexation (voir aussi public/robots.txt).
{ name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
```

> ⚠️ C'est la ligne la plus importante du fichier. Un `noindex` oublié =
> site totalement absent de Google, sans aucun message d'alerte.

---

## 2. Vérifier APRÈS le déploiement

### ☐ Le `noindex` a bien disparu du HTML livré

```bash
curl -s https://LE-DOMAINE.fr/ | grep -i noindex
```

→ **Ne doit rien retourner.** Si une ligne s'affiche, le blocage est encore actif.

### ☐ Le `robots.txt` en ligne est le bon

```bash
curl -s https://LE-DOMAINE.fr/robots.txt
```

→ Doit afficher `Allow: /`, pas `Disallow: /`.

### ☐ Protection Vercel désactivée

Vercel → Settings → Deployment Protection → *Vercel Authentication* sur **Off**
pour la production (sinon le site demande une connexion aux visiteurs).

---

## 3. Bon à savoir

- **Aucune pénalité SEO** n'est héritée du fait que le site soit resté
  inachevé ou non optimisé pendant cette période. Google classe le site sur
  son état au moment du crawl, il n'y a pas de « mauvais historique ».
- Les URLs de preview Vercel (`oysen-xxx.vercel.app`) sont publiques par
  défaut. Elles sont couvertes par le `noindex` tant qu'il est en place.
- Après le lancement, l'indexation n'est pas instantanée : compter quelques
  jours. On peut l'accélérer via Google Search Console (« Inspection de
  l'URL » → « Demander une indexation »).
