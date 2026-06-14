# Backend Groupomania

API REST Node.js / Express / Sequelize / PostgreSQL.

## Prerequis

- Node.js 18+
- Une base PostgreSQL (locale ou hebergee)

## Installation

```bash
npm install
cp .env.example .env   # puis remplir les valeurs
```

Variables d'environnement (voir `.env.example`) :

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Chaine de connexion PostgreSQL |
| `JWT_SECRET` | Secret de signature des tokens JWT |
| `EMAIL_SECRET` | Cle de chiffrement des emails en base |
| `CORS_ORIGIN` | URL(s) du front autorisee(s) (virgules), `*` par defaut |
| `PORT` | Port d'ecoute (3000 par defaut) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte admin cree par le seed |
| `CLOUDINARY_*` | Stockage des images (sinon disque local) |

Generer un secret solide :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Base de donnees

```bash
npm run migrate       # cree / met a jour les tables
npm run seed          # cree le compte admin (ADMIN_EMAIL / ADMIN_PASSWORD)
npm run migrate:undo  # annule la derniere migration
```

## Lancer

```bash
npm run dev    # developpement (nodemon)
npm start      # production
```

L'API ecoute sur `http://localhost:3000/api`.

## Stockage des images

- **Local** : si les variables `CLOUDINARY_*` sont absentes, les images vont
  dans `backend/images/` et sont servies sur `/images/...`.
- **Production** : definir `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` et
  `CLOUDINARY_API_SECRET`. Indispensable sur un hebergeur a disque ephemere
  (Render, Railway...) sinon les uploads sont perdus a chaque redeploiement.

## Deploiement (Render)

1. Creer un service **PostgreSQL** sur Render, recuperer l'*Internal Database URL*.
2. Creer un service **Web** pointant sur ce dossier `backend/`.
   - Build command : `npm install`
   - Start command : `npm run migrate && npm start`
3. Renseigner les variables d'environnement dans l'onglet *Environment* :
   `DATABASE_URL`, `JWT_SECRET`, `EMAIL_SECRET`, `CORS_ORIGIN` (URL du front),
   `NODE_ENV=production`, et les `CLOUDINARY_*`.
4. (Une fois) lancer le seed admin via un *Shell* Render : `npm run seed`.

> Le plan gratuit Render met l'instance en veille apres 15 min d'inactivite :
> la premiere requete apres une periode d'inactivite peut prendre ~30 s.
