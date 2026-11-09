# Beyrival Daily Report

Questionnaire quotidien avec date, responsable, Elo actuel, Elo quotidien, Elo précédent, recrutements, références, événements, contrôles DLC, conditions de rush et autres statistiques. Le compte rendu est envoyé dans Discord via webhook.

## Installation
1. Installer Node.js 18+.
2. Dézipper le projet et ouvrir un terminal dans le dossier.
3. `npm install`
4. Copier `.env.example` vers `.env`.
5. Créer un webhook dans le salon Discord cible (Paramètres du salon → Intégrations → Webhooks) et placer l’URL dans `.env`.
6. `npm start`, puis ouvrir http://localhost:3000.

Ne partage jamais l’URL du webhook. Pour rendre le site accessible aux membres via Internet, héberge le projet Node.js et configure `DISCORD_WEBHOOK_URL` dans les variables d’environnement.
