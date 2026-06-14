# Frontend Groupomania

Application React (build Vite).

## Prerequis

- Node.js 18+
- Le backend lance (voir `../backend`)

## Installation

```bash
npm install
cp .env.example .env   # adapter VITE_API_URL si besoin
```

| Variable | Role |
|----------|------|
| `VITE_API_URL` | URL de l'API backend (defaut `http://localhost:3000/api`) |

## Lancer

```bash
npm run dev       # serveur de developpement (http://localhost:3001)
npm run build     # build de production -> dossier build/
npm run preview   # previsualiser le build de production
npm test          # tests (Vitest)
```

## Deploiement

`npm run build` genere un dossier `build/` statique a servir par n'importe quel
hebergeur de fichiers statiques (Netlify, Vercel, Render Static Site, GitHub Pages...).
Definir `VITE_API_URL` sur l'URL publique de l'API au moment du build.
