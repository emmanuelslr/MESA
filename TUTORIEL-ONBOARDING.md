# 🎯 Tutoriel Guidé Interactif - Simulateur MESA DCF

## 📋 Vue d'ensemble

Un système de tutoriel guidé **interactif et contextuel** en 6 étapes qui se lance uniquement sur la section simulateur. Le tutoriel utilise un système de **spotlight automatique** qui déflourte et met en lumière chaque composant spécifique du simulateur avec scroll automatique.

## ✨ Fonctionnalités implémentées

### 🎨 Design & UX

- **Panneau flottant** fixe en bas à droite
- **Système de spotlight automatique** :
  - Bordure rouge animée (pulsation) autour de chaque composant ciblé
  - Scroll automatique vers la section concernée lors du clic sur "Suivant"
  - Zone ciblée défloutée et mise en lumière
  - Reste de l'écran fortement flouté (blur 4px) et assombri (75% opacité)
- **Navigation fluide** : Transition automatique vers chaque section
- **Animations élégantes** : Pulsation, fade-in/out, transitions douces
- **Barre de progression visuelle** (6 segments pour les 6 étapes)
- **Icônes émojis** pour chaque étape (👋, ⚙️, 📋, 💰, 📊, 🚀)
- **Badges** indiquant l'étape en cours (Étape 1/6, 2/6, etc.)

### 🔄 Comportement

#### **Lancement contextuel**
- Le tutoriel se lance **uniquement quand on arrive sur la section simulateur**
- Ne s'affiche **PAS** sur la page de garde (hero section)
- Utilise un `IntersectionObserver` pour détecter l'arrivée sur #simulator
- Se lance automatiquement **800ms** après l'entrée dans la zone

#### **Navigation automatique**
- Cliquer sur "Suivant" → Scroll automatique vers la prochaine section
- Transition fluide avec `scrollIntoView({ behavior: 'smooth', block: 'center' })`
- Le spotlight suit automatiquement pour mettre en avant la bonne zone

#### **Les 6 étapes détaillées**

**Étape 1 : Bienvenue sur le Simulateur MESA** 👋
- **Position panneau** : Bas droite
- **Contenu** : Introduction générale (MESA + DCF)
- **Spotlight** : Aucun (vue d'ensemble)
- **Action** : Cliquer sur "Suivant"

**Étape 2 : Paramètres généraux** ⚙️
- **Position panneau** : Bas droite
- **Contenu** : Explication du stade de startup et du taux sans risque
- **Spotlight** : Card "Paramètres généraux" (`#general-parameters`)
- **Scroll** : Vers la card des paramètres généraux
- **Zone cliquable** : Les selects restent fonctionnels

**Étape 3 : Questionnaire MESA** 📋
- **Position panneau** : Bas droite
- **Contenu** : Explication des 5 catégories MESA
- **Spotlight** : Card "Questionnaire MESA" (`#mesa-questionnaire`)
- **Scroll** : Vers le questionnaire MESA
- **Zone cliquable** : Les accordéons et checkboxes restent fonctionnels

**Étape 4 : Flux de trésorerie** 💰
- **Position panneau** : Bas droite
- **Contenu** : Explication des prévisions de cashflows sur 7 ans
- **Spotlight** : Card "Flux de trésorerie" (`#cashflow-section`)
- **Scroll** : Vers la section des flux
- **Zone cliquable** : Les inputs restent fonctionnels

**Étape 5 : Résultats et Valorisation** 📊
- **Position panneau** : Bas droite
- **Contenu** : Explication du score MESA, prime de risque, et VAN
- **Spotlight** : Colonne droite complète (`#results-section`)
- **Scroll** : Vers la colonne des résultats
- **Zone cliquable** : Le bouton "Voir l'analyse détaillée" reste fonctionnel

**Étape 6 : Startups de référence** 🚀
- **Position panneau** : Bas droite
- **Contenu** : Explication du système de presets
- **Spotlight** : Colonne gauche (carrousel) (`#startup-sidebar`)
- **Scroll** : Vers le carrousel de startups
- **Zone cliquable** : Le carrousel reste entièrement fonctionnel
- **Bouton final** : "Terminer" au lieu de "Suivant"

#### **Options de contrôle**

- **"Passer le tutoriel"** : Bouton disponible à chaque étape pour ignorer complètement
- **Bouton X** : Ferme le tutoriel à tout moment
- **"Revoir le tutoriel"** : Bouton discret (icône ❓) en haut à droite du simulateur
  - Visible après avoir fermé ou passé le tutoriel
  - Permet de relancer le tutoriel depuis l'étape 1

### 💾 Persistance des données

- **Pas de persistance localStorage** : Le tutoriel se relance à chaque arrivée sur le simulateur
- **Persistance de session** : Le flag `hasCompletedTutorial` empêche le relancement pendant la session en cours
- **Relancement manuel** : Possible via le bouton "Revoir le tutoriel"

### 🔗 Intégration avec le simulateur

Le tutoriel est **complètement intégré** et **contextuel** :

1. **IDs sur les sections ciblées** :
   - `#simulator` : Section principale du simulateur (pour l'IntersectionObserver)
   - `#general-parameters` : Card "Paramètres généraux"
   - `#mesa-questionnaire` : Card "Questionnaire MESA"
   - `#cashflow-section` : Card "Flux de trésorerie"
   - `#results-section` : Colonne droite (résultats)
   - `#startup-sidebar` : Colonne gauche (carrousel)

2. **IntersectionObserver** :
   - Détecte quand on arrive sur `#simulator`
   - Threshold de 30% de visibilité
   - Ne se lance qu'une fois par session (sauf relance manuelle)

3. **Spotlight CSS dynamique** :
   - Utilise `::before` pour la bordure animée
   - Utilise `::after` pour un léger effet de surbrillance
   - `z-index` intelligent (45 pour la zone ciblée, 40 pour l'overlay)
   - `box-shadow` avec propagation infinie pour l'overlay assombri
   - Animation CSS `pulse-spotlight` pour l'effet de pulsation

4. **Scroll automatique** :
   - `scrollIntoView({ behavior: 'smooth', block: 'center' })`
   - Délai de 300ms pour laisser le temps à l'animation
   - Centrage vertical de la zone ciblée

## 📁 Fichiers créés/modifiés

### Modifié : `components/TutorialOverlay.tsx`
- Type `TutorialStep` : 0 | 1 | 2 | 3 | 4 | 5 | 6 (au lieu de 0-4)
- 6 étapes de contenu au lieu de 4
- Scroll automatique vers la section ciblée dans useEffect
- Overlay plus prononcé (blur 4px, opacité 75%)
- Spotlight avec double pseudo-élément (::before et ::after)
- Animation `pulse-spotlight` améliorée
- Panneau toujours en bas à droite (plus de positionnement dynamique)

### Modifié : `app/page.tsx`
- **IntersectionObserver** pour détecter l'arrivée sur #simulator
- IDs ajoutés sur les sections ciblées :
  - `id="general-parameters"` sur Card "Paramètres généraux"
  - `id="mesa-questionnaire"` sur Card "Questionnaire MESA"
  - `id="cashflow-section"` sur Card "Flux de trésorerie"
  - `id="results-section"` sur colonne droite (déjà présent)
  - `id="startup-sidebar"` sur colonne gauche (déjà présent)
- `handleTutorialNext()` : limite passée de 4 à 6
- useEffect modifié pour observer #simulator au lieu de se lancer directement
- Dépendances de useEffect : `[hasCompletedTutorial, tutorialStep]`

## 🎨 Composants UI utilisés

Tous issus du design system existant (shadcn/ui) :
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Button` (variants: default, ghost, outline)
- `Badge` (variant: default)
- Icônes `lucide-react` : `X`, `HelpCircle`, `ArrowRight`

## 🚀 Comment tester

1. **Page de garde** :
   - Charger la page d'accueil
   - Observer que le tutoriel **NE SE LANCE PAS** sur la hero section
   - Cliquer sur "Découvrir" ou scroller vers le bas

2. **Arrivée sur le simulateur** :
   - Dès que la section #simulator entre dans la vue (30% visible)
   - Le tutoriel devrait se lancer après 800ms
   - Étape 1 : Message de bienvenue

3. **Navigation entre les étapes** :
   - **Étape 1 → 2** : Cliquer "Suivant" → Scroll vers "Paramètres généraux"
   - Observer la bordure rouge pulsante autour de la card
   - **Étape 2 → 3** : Cliquer "Suivant" → Scroll vers "Questionnaire MESA"
   - Observer le spotlight sur le questionnaire
   - **Étape 3 → 4** : Cliquer "Suivant" → Scroll vers "Flux de trésorerie"
   - **Étape 4 → 5** : Cliquer "Suivant" → Scroll vers les résultats (colonne droite)
   - **Étape 5 → 6** : Cliquer "Suivant" → Scroll vers le carrousel (colonne gauche)
   - **Étape 6** : Cliquer "Terminer" → Tutoriel se ferme

4. **Test d'interactivité** :
   - À l'étape 2 : Essayer de changer le stade → doit fonctionner
   - À l'étape 3 : Essayer de cocher des checkboxes MESA → doit fonctionner
   - À l'étape 4 : Essayer de saisir un flux → doit fonctionner
   - À l'étape 6 : Essayer de cliquer sur une startup → doit fonctionner

5. **Test de relance** :
   - Fermer le tutoriel (bouton X ou "Passer")
   - Le bouton "❓ Revoir le tutoriel" devrait apparaître en haut à droite
   - Cliquer dessus → Le tutoriel redémarre à l'étape 1

6. **Test de rechargement** :
   - Recharger la page
   - Scroller vers le simulateur
   - Le tutoriel devrait se relancer automatiquement

## 🔧 Personnalisation

### Modifier le délai de lancement

Éditer `app/page.tsx`, ligne ~80 :

```typescript
setTimeout(() => {
  setTutorialStep(1);
  setIsTutorialOpen(true);
}, 800); // Modifier cette valeur (en ms)
```

### Modifier le seuil de déclenchement

Éditer `app/page.tsx`, ligne ~87 :

```typescript
{ threshold: 0.3 } // 0.3 = 30% de visibilité
```

### Personnaliser l'effet de flou

Éditer `components/TutorialOverlay.tsx`, ligne ~58 :

```css
backdropFilter: 'blur(4px)', // Intensité du flou
background: 'rgba(0, 0, 0, 0.75)', // Opacité de l'overlay
```

### Modifier la couleur du spotlight

Éditer `components/TutorialOverlay.tsx`, ligne ~70 :

```css
border: 4px solid rgb(239, 68, 68); /* Rouge primaire */
```

### Ajouter une nouvelle étape

1. Ajouter un ID sur votre section dans `app/page.tsx` :
```tsx
<Card id="ma-nouvelle-section" className="...">
  {/* Votre contenu */}
</Card>
```

2. Ajouter l'étape dans `TutorialOverlay.tsx` :
```typescript
7: {
  title: "Ma Nouvelle Section",
  description: "Description...",
  action: "Action attendue...",
  emoji: "✨",
  targetId: "ma-nouvelle-section",
},
```

3. Mettre à jour :
   - `type TutorialStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;`
   - `const totalSteps = 7;`
   - `if (tutorialStep < 7)` dans `handleTutorialNext()`

## ✅ Points d'attention

- ✅ **Lancement contextuel** : Uniquement sur le simulateur, pas sur la hero
- ✅ **Scroll automatique** : Transition fluide vers chaque section
- ✅ **Interactivité préservée** : Toutes les zones spotlight restent cliquables
- ✅ **Effet de flou prononcé** : Vraiment flouter le reste (4px) pour focus sur la zone
- ✅ **z-index intelligent** : Gestion automatique des couches
- ✅ **Performance optimisée** : CSS animations avec GPU, IntersectionObserver
- ✅ **Responsive** : Le panneau reste accessible sur mobile
- ✅ **Accessibilité** : Navigation au clavier fonctionnelle
- ✅ **Type-safe** : TypeScript strict
- ✅ **Compatible dark mode** : Couleurs adaptatives

## 🎯 Résultat

Un tutoriel guidé **vraiment interactif et pédagogique** qui :
- ✨ Se lance au bon moment (sur le simulateur, pas avant)
- 🎯 Guide étape par étape avec spotlight visuel
- 🔄 Scroll automatiquement vers chaque section concernée
- 💡 Floute le reste et défloute la zone ciblée
- 🖱️ Permet d'interagir avec les éléments en temps réel
- 🎨 S'intègre parfaitement au design existant
- ⚡ Reste fluide et non intrusif

---

**Auteur** : Système de tutoriel MESA DCF  
**Date** : Novembre 2025  
**Version** : 3.0 (Contextuel et détaillé)
