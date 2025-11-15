# Carrousel 3D de Startups - Documentation

## 📦 Installation

Les dépendances Three.js sont déjà installées dans le projet :

```bash
# Si vous devez les réinstaller :
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

## 🏗️ Architecture

### Fichiers créés

```
lib/
  └── startup-presets.ts          # Types et données des startups

components/
  ├── StartupSidebar.tsx          # Colonne de gauche complète
  ├── 3d/
  │   └── StartupCarousel3D.tsx   # Canvas 3D avec carrousel
  └── ui/
      └── badge.tsx               # Composant Badge (shadcn/ui)

app/
  └── page.tsx                    # Intégration dans la page principale
```

### Structure des données

```typescript
interface StartupPreset {
  id: string;              // Identifiant unique
  name: string;            // Nom de la startup
  stage: Stage;            // Stade d'investissement
  sector: string;          // Secteur d'activité
  logoLabel: string;       // Acronyme pour le logo (2-3 lettres)
  color: string;           // Couleur dominante (hex)
  tags: string[];          // Tags descriptifs
  description?: string;    // Description courte
}
```

## 🎯 Startups de référence

5 startups sont pré-configurées :

1. **Instagram** - Série A - Réseau social (#E4405F)
2. **Snapchat** - Série B - Réseau social (#FFFC00)
3. **Startup SaaS Française** - Série A - SaaS B2B (#0066FF)
4. **TechMed** - Seed - MedTech (#00CC88)
5. **GreenTech Innovations** - Série A - GreenTech (#34C759)

## 🎨 Composants

### 1. StartupCarousel3D

Composant principal du carrousel 3D.

**Props :**

```typescript
interface StartupCarousel3DProps {
  startups: StartupPreset[];
  onSelectStartup?: (startupId: string) => void;
  initialStartupId?: string;
}
```

**Fonctionnalités :**

- ✨ Cartes 3D animées avec effet de profondeur
- 🎯 Carte sélectionnée mise en avant (scale, brightness)
- 🖱️ Navigation par clic sur les cartes
- ⬅️➡️ Boutons de navigation précédent/suivant
- 📍 Indicateurs de position (dots)
- 🎭 Animations smooth avec `lerp`
- 💫 Effets de flottement avec `Float` de drei

**Interactions 3D :**

- Rotation limitée avec `PresentationControls`
- Hover states sur les cartes
- Animations fluides entre les transitions

### 2. StartupSidebar

Wrapper de la colonne de gauche.

**Props :**

```typescript
interface StartupSidebarProps {
  onSelectStartup?: (startupId: string) => void;
}
```

**Contenu :**

- 📋 Header explicatif
- 🎨 Canvas 3D (500px de hauteur)
- 📊 Détails de la startup sélectionnée (nom, stade, secteur, tags)
- 💡 Message pour fonctionnalité future

### 3. Badge

Composant shadcn/ui standard pour afficher les tags.

**Variants :**

- `default` - Style primaire
- `secondary` - Style secondaire (utilisé pour les tags)
- `destructive` - Style destructif
- `outline` - Style outline

## 🔌 Intégration dans la page principale

La page `app/page.tsx` a été modifiée pour intégrer le carrousel :

```tsx
<div className="flex flex-col xl:flex-row gap-6">
  {/* Colonne gauche : Startups (30%) */}
  <div className="w-full xl:w-[30%] xl:max-w-[450px]">
    <div className="xl:sticky xl:top-4">
      <StartupSidebar onSelectStartup={handleSelectStartup} />
    </div>
  </div>
  
  {/* Reste du simulateur existant */}
  <div className="flex-1">
    {/* Simulateur MESA + DCF */}
  </div>
</div>
```

**Layout responsive :**

- Mobile/Tablet : Colonne verticale (startups en haut)
- Desktop (xl+) : Layout horizontal avec sidebar sticky

## 🎬 Callback onSelectStartup

```typescript
const handleSelectStartup = (startupId: string) => {
  console.log("Startup sélectionnée :", startupId);
  // TODO: Pré-remplir le simulateur avec les données de la startup
};
```

**Utilisation future :**

Ce callback permettra de :

- Pré-remplir les champs du formulaire MESA
- Charger des données de référence depuis une API
- Personnaliser l'expérience utilisateur

## 🎨 Customisation

### Ajouter une startup

Dans `lib/startup-presets.ts` :

```typescript
{
  id: "nouvelle-startup",
  name: "Ma Startup",
  stage: "série a",
  sector: "FinTech",
  logoLabel: "MS",
  color: "#FF6B6B",
  tags: ["B2B", "Banking", "AI"],
  description: "Description de ma startup",
}
```

### Modifier les couleurs

Les couleurs sont définies dans chaque preset :

```typescript
color: "#E4405F"  // Couleur dominante de la carte
```

### Ajuster la hauteur du canvas

Dans `components/StartupSidebar.tsx` :

```tsx
<div className="h-[500px] w-full">  {/* Modifier ici */}
  <StartupCarousel3D ... />
</div>
```

### Personnaliser les animations

Dans `components/3d/StartupCarousel3D.tsx` :

```typescript
// Vitesse de l'animation
meshRef.current.scale.lerp(targetScale, 0.1);  // 0.1 = vitesse

// Intensité du float
<Float
  speed={2}              // Vitesse
  rotationIntensity={0.2}  // Rotation
  floatIntensity={0.3}     // Flottement
>
```

## 🐛 Dépannage

### Canvas blanc ou vide

- Vérifiez que les dépendances sont installées
- Vérifiez la console pour les erreurs Three.js
- Assurez-vous que le conteneur a une hauteur définie

### Texte invisible

- Les composants `Text` de drei nécessitent WebGL
- Vérifiez que WebGL est activé dans le navigateur

### Performance lente

- Réduisez le nombre de polygones
- Utilisez `React.memo` pour optimiser les re-renders
- Limitez le nombre de startups affichées

## 📱 Support navigateurs

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ⚠️ Mobile : Performances variables selon l'appareil

## 🚀 Prochaines étapes

- [ ] Implémenter le pré-remplissage automatique du formulaire
- [ ] Ajouter une API pour charger des startups dynamiquement
- [ ] Intégrer des données réelles de startups
- [ ] Ajouter des animations de transition plus complexes
- [ ] Permettre le drag-and-drop pour naviguer
- [ ] Ajouter un mode recherche/filtrage des startups

## 💡 Notes importantes

⚠️ **Ne modifiez pas la logique MESA/DCF** : La logique métier du simulateur est dans `lib/mesa.ts` et ne doit pas être touchée.

✅ **Separation of concerns** : Le carrousel 3D est complètement découplé du simulateur et peut être utilisé indépendamment.

🎯 **Focus UX** : L'effet 3D apporte une dimension interactive et moderne sans compromettre l'utilisabilité du simulateur.

