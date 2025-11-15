# 🚀 Quick Start - Carrousel 3D de Startups

## ⚡ Démarrage rapide

### 1. Lancer le projet
```bash
npm run dev
```

### 2. Ouvrir dans le navigateur
```
http://localhost:3000
```

### 3. Interagir avec le carrousel
- 👆 **Cliquez** sur une carte pour la sélectionner
- ⬅️➡️ **Boutons** pour naviguer
- 📍 **Dots** en bas pour aller directement à une startup
- 🖱️ **Drag** pour faire pivoter la scène (limité)

---

## 📦 Ce qui a été créé

### 🎨 Composants
```
components/
├── StartupSidebar.tsx              ← Colonne de gauche
├── 3d/
│   ├── StartupCarousel3D.tsx       ← Carrousel 3D
│   └── StartupCarousel3D.example.tsx
└── ui/
    └── badge.tsx                    ← Badge pour tags
```

### 📊 Données
```
lib/
└── startup-presets.ts              ← 5 startups de référence
```

### 📄 Documentation
```
STARTUP-CAROUSEL-3D.md              ← Documentation technique
README-INTEGRATION.md               ← Guide complet
MODIFICATIONS.md                    ← Liste des changements
QUICK-START.md                      ← Ce fichier
```

---

## 🎯 Les 5 startups disponibles

| Startup | Stade | Secteur | Couleur |
|---------|-------|---------|---------|
| 🟣 **Instagram** | Série A | Réseau social | Rose |
| 🟡 **Snapchat** | Série B | Réseau social | Jaune |
| 🔵 **Startup SaaS FR** | Série A | SaaS B2B | Bleu |
| 🟢 **TechMed** | Seed | MedTech | Vert |
| 🟢 **GreenTech** | Série A | GreenTech | Vert clair |

---

## 🔧 Configuration

### Tout est déjà configuré ! ✅
- ✅ Three.js installé
- ✅ React Three Fiber installé
- ✅ Drei installé
- ✅ Composants créés
- ✅ Layout intégré
- ✅ Pas d'erreurs de linting

### Si besoin de réinstaller :
```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

---

## 📱 Layout

### Desktop (écrans larges xl+)
```
┌───────────┬──────────────────┬──────────────┐
│           │                  │              │
│ Startups  │   Inputs MESA    │  Résultats   │
│   3D      │   Formulaire     │   MESA+DCF   │
│           │                  │              │
│ [STICKY]  │                  │   [STICKY]   │
└───────────┴──────────────────┴──────────────┘
   30%             ~45%              ~25%
```

### Mobile/Tablet
```
┌─────────────────────┐
│     Startups 3D     │
├─────────────────────┤
│   Inputs MESA       │
├─────────────────────┤
│   Résultats         │
└─────────────────────┘
```

---

## 🎮 Interactions

### Navigation
| Action | Résultat |
|--------|----------|
| Clic sur carte | Sélectionne la startup |
| Bouton ⬅️ | Startup précédente |
| Bouton ➡️ | Startup suivante |
| Clic sur dot | Va directement à cette startup |
| Drag scène | Rotation limitée (azimut ±45°) |

### États visuels
| État | Effet |
|------|-------|
| Sélectionné | Scale 1.2x, lumière émissive accrue |
| Hover | Scale 1.05x, légère rotation |
| Normal | Scale 1x, opacité 0.7 |

---

## 🔌 Callback onSelectStartup

### Actuellement (placeholder)
```typescript
const handleSelectStartup = (startupId: string) => {
  console.log("Startup sélectionnée :", startupId);
  // TODO: Implémenter le pré-remplissage
};
```

### À implémenter (futur)
```typescript
const handleSelectStartup = (startupId: string) => {
  const startup = getStartupById(startupId);
  if (!startup) return;
  
  // Pré-remplir le stade
  setStage(startup.stage);
  
  // Pré-remplir les réponses MESA (selon vos données)
  setMesaAnswers({
    // ... réponses pré-configurées pour cette startup
  });
  
  // Pré-remplir les flux (selon vos données)
  setCashflows([
    // ... flux pré-configurés pour cette startup
  ]);
};
```

---

## ➕ Ajouter une startup

### Dans `lib/startup-presets.ts`

```typescript
export const STARTUP_PRESETS: StartupPreset[] = [
  // ... startups existantes
  
  // ✨ Nouvelle startup
  {
    id: "mon-id",
    name: "Ma Startup",
    stage: "série a",
    sector: "FinTech",
    logoLabel: "MS",              // 2-3 lettres
    color: "#FF6B6B",            // Couleur hex
    tags: ["B2B", "AI", "Banking"],
    description: "Description courte",
  },
];
```

### C'est tout ! ✅
La nouvelle startup apparaîtra automatiquement dans le carrousel.

---

## 🎨 Personnalisation

### Hauteur du canvas
`components/StartupSidebar.tsx` ligne ~52 :
```tsx
<div className="h-[500px] w-full">  {/* ← Modifier ici */}
```

### Vitesse d'animation
`components/3d/StartupCarousel3D.tsx` ligne ~55 :
```tsx
meshRef.current.scale.lerp(targetScale, 0.1);  // 0.1 = vitesse
```

### Couleur des cartes
`lib/startup-presets.ts` :
```tsx
color: "#E4405F"  // ← Changer la couleur
```

### Espacement entre cartes
`components/3d/StartupCarousel3D.tsx` ligne ~140 :
```tsx
const cardSpacing = 2;  // ← Modifier l'espacement vertical
```

---

## 🧪 Tester le carrousel isolément

### Créer une page de démo

`app/demo/page.tsx` :
```tsx
import StartupCarousel3DDemo from "@/components/3d/StartupCarousel3D.example";

export default function DemoPage() {
  return <StartupCarousel3DDemo />;
}
```

### Accéder à la démo
```
http://localhost:3000/demo
```

---

## ❓ FAQ

### Q : Le canvas est blanc, que faire ?
**R :** Vérifiez que :
- WebGL est activé dans votre navigateur
- Le conteneur a une hauteur définie (`h-[500px]`)
- La console ne montre pas d'erreur (F12)

### Q : Comment changer la taille des cartes ?
**R :** Dans `StartupCard3D`, ligne ~70 :
```tsx
<planeGeometry args={[2.5, 1.5]} />  {/* [largeur, hauteur] */}
```

### Q : Comment désactiver les contrôles de rotation ?
**R :** Dans `Scene`, supprimer ou commenter `<PresentationControls>`.

### Q : Comment ajouter des ombres ?
**R :** Activer les ombres dans le Canvas :
```tsx
<Canvas shadows>
```

---

## 🐛 Problèmes courants

| Problème | Solution |
|----------|----------|
| Canvas blanc | Vérifier WebGL + console |
| Texte invisible | Normal, fonts par défaut utilisées |
| Performance lente | Réduire nombre de startups ou désactiver effets |
| Erreur "lerp" | Ajouter vérification `if (!meshRef.current)` |

---

## 📚 Documentation complète

### Pour aller plus loin :

1. **`STARTUP-CAROUSEL-3D.md`**
   → Documentation technique complète

2. **`README-INTEGRATION.md`**
   → Guide d'intégration et architecture

3. **`MODIFICATIONS.md`**
   → Liste détaillée des changements

4. **`components/3d/StartupCarousel3D.example.tsx`**
   → Exemples de code

---

## ✅ Checklist de vérification

- [x] Dépendances installées
- [x] Composants créés
- [x] Layout intégré
- [x] Données des startups configurées
- [x] Aucune erreur de linting
- [x] Documentation complète

### À faire (optionnel) :

- [ ] Implémenter le pré-remplissage du formulaire
- [ ] Ajouter vos propres startups
- [ ] Personnaliser les couleurs/animations
- [ ] Créer une page de démo
- [ ] Connecter à une API (si besoin)

---

## 🎉 Prêt à utiliser !

Le carrousel 3D est fonctionnel et intégré.

**Commandes :**
```bash
npm run dev       # Démarrer
npm run build     # Build production
npm run lint      # Vérifier le code
```

**Liens utiles :**
- Projet : http://localhost:3000
- Démo : http://localhost:3000/demo (à créer)

**Bon développement ! 🚀**

