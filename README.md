# Survey Mémoire — Collecte de données M2

Application web de collecte et d'analyse de données pour un mémoire de Master 2 sur l'adoption de l'IA en entreprise.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (PostgreSQL, Auth, Realtime)
- **Recharts** (visualisations dashboard)

## Setup

### 1. Cloner le repo

```bash
git clone https://github.com/<your-username>/survey-memoire.git
cd survey-memoire
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le contenu de `schema.sql`
3. Copier l'URL du projet et la clé `anon` depuis **Settings > API**

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplir `.env.local` avec vos valeurs :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DASHBOARD_PASSWORD=un-mot-de-passe-securise
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/survey` | Formulaire de collecte (22 questions) |
| `/thank-you` | Page de remerciement |
| `/dashboard` | Dashboard d'analyse (protégé par mot de passe) |

## Structure

```
src/
├── app/
│   ├── survey/          # Formulaire public
│   ├── thank-you/       # Page de confirmation
│   ├── dashboard/       # Dashboard protégé
│   └── api/             # API routes
├── components/
│   ├── survey/          # Composants du formulaire
│   ├── dashboard/       # Composants du dashboard
│   └── ui/              # shadcn/ui (auto-generated)
└── lib/
    ├── supabase.ts      # Client Supabase
    └── questions.ts     # Configuration du questionnaire
```

## Licence

Projet académique — usage personnel.
