# Gestion Piste Frontend - React + Vite

Frontend React moderne pour l'application de gestion de parc avion.

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser la build
npm run preview
```

L'application sera accessible sur `http://localhost:3000`

## Structure du projet

```
src/
├── components/
│   ├── SessionsView.jsx      # Vue principale des sessions
│   ├── TabNavigation.jsx     # Barre de navigation des onglets
│   ├── TabContent.jsx        # Contenu d'une session
│   └── HistoryView.jsx       # Page d'historique
├── services/
│   └── api.js                # Client API Axios
├── App.jsx                   # Composant principal
├── App.css                   # Styles globaux
├── index.css                 # Styles de base
└── main.jsx                  # Point d'entrée
```

## Fonctionnalités

### Sessions
- Créer, modifier et supprimer des sessions
- Sélectionner un avion via dropdown
- Cocher "APRS OK" pour colorer l'onglet en vert
- Enregistrer les heures (arrivée, départ, départ réel)
- Ajouter/modifier/supprimer tractages, MEL items et tâches
- Bouton "Enregistrer" pour sauvegarder dans l'historique

### Historique
- Vue de tous les enregistrements triés par date
- Filtrer par date
- Voir les détails d'un enregistrement (matricule, heures, tractages, MEL items, tâches)
- Supprimer des enregistrements

## Configuration API

L'API est configurée pour communiquer avec le backend .NET sur `http://localhost:5000/api`.

Modifiez l'URL dans `src/services/api.js` si nécessaire :

```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

## Design responsif

L'application est entièrement responsive et fonctionne sur :
- Desktop
- Tablette
- Mobile

## Technologies utilisées

- React 18
- Vite 5
- Axios
- CSS3 (Flexbox, Grid, Animations)
