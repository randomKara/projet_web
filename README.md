# Projet HTML

## Prérequis

- Node.js et npm doivent être installés sur votre machine
- MongoDB doit être installé et configuré
- Un compte MongoDB Atlas pour la base de données

## Configuration

1. Dans le dossier `back`, créez un fichier `.env` avec la configuration suivante :
```
MONGODB_URI=mongodb+srv://<serveur URL>
```
Remplacez `<serveur URL>` par votre lien mangoDB trouvable à la création d'une connection dans votre Cluster.

## Installation

1. Backend :
```bash
cd back
npm install
```

2. Frontend :
```bash
cd front/vite
npm install
```

## Démarrage

1. Backend :
```bash
cd back
npm start
```

2. Frontend :
```bash
cd front/vite
npm run dev
```
