# Configuration 3D - Simulateur MESA

## Packages installés

Les librairies suivantes ont été installées et sont prêtes à être utilisées :

- **three** (v0.168.0) : Bibliothèque 3D de base
- **@react-three/fiber** (v8.18.0) : Renderer React pour Three.js (compatible React 18)
- **@react-three/drei** (v9.122.0) : Helpers et composants utilitaires pour React Three Fiber
- **@types/three** (v0.181.0) : Types TypeScript pour Three.js

## Structure du projet

Un dossier `components/3d/` a été créé pour accueillir vos futurs composants 3D.

## Versions

- React : 18.x
- Next.js : 14.2.5
- TypeScript : 5.x

## Compatibilité

Les versions installées sont compatibles avec React 18. Si vous mettez à jour React vers la version 19 à l'avenir, vous pourrez alors mettre à jour @react-three/fiber vers la version 9.x.

## Commandes

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Créer le build de production
- `npm start` : Démarrer le serveur de production

## Prêt pour l'utilisation

Vous pouvez maintenant commencer à créer vos scènes 3D en important :

```typescript
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
```

