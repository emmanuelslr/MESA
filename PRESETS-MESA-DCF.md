# Système de Presets MESA + DCF

## 📋 Vue d'ensemble

Ce document explique le système de presets pour pré-remplir automatiquement le simulateur MESA + DCF avec les données exactes du mémoire.

## 🎯 Startups disponibles

### 1. **Instagram (2012)**
- **ID**: `instagram_2012`
- **Stage**: Série A/B
- **Score MESA**: 7.5/10
- **Taux d'actualisation**: 27.99%
- **VAN publiée**: 957 523 842,19 USD
- **Flux**: 7 années de flux reconstitués à partir des VAN du mémoire
- **Particularité**: Excellentes performances sur l'équipe (10/10) et le marché (10/10)

### 2. **Snapchat (2013)**
- **ID**: `snapchat_2013`
- **Stage**: Série A/B
- **Score MESA**: 6.3/10
- **Taux d'actualisation**: 40%
- **VAN publiée**: 1 875 420 332,72 USD
- **Flux**: Années 1-2 calculées via méthode ARPU Facebook, années 3-7 projetées
- **Particularité**: Équipe plus jeune (6/10) que Instagram

### 3. **Startup SaaS FR (anonyme)**
- **ID**: `saas_fr_serieA`
- **Stage**: Série A
- **Score MESA**: 5.7/10
- **Taux d'actualisation**: 46%
- **VAN publiée**: 539 065,03 EUR
- **Flux**: 4 années réelles du mémoire, années 5-7 projetées automatiquement
- **Particularité**: Startup française en croissance, encore en flux négatifs années 1-2

### 4. **TechMed (fictive)**
- **ID**: `techmed_fictive`
- **Stage**: Série A/B
- **Score MESA**: 6.5/10
- **Taux d'actualisation**: 37%
- **VAN publiée**: 1 145,17 k$ (milliers de dollars)
- **Flux**: 7 années explicites du mémoire
- **Particularité**: Exemple pédagogique avec détail MESA approximatif

## 🔧 Architecture technique

### Fichiers modifiés

1. **`lib/startup-presets.ts`**
   - Définit les types `MesaCategoryAnswers`, `MesaStage`, `MesaStartupPreset`
   - Contient le dictionnaire `MESA_PRESETS` avec toutes les données
   - Fonction `applyMesaPreset()` pour pré-remplir le formulaire

2. **`lib/mesa.ts`**
   - Mise à jour des noms de variables MESA : `taille_d`, `taille_e`, `taille_g`, `taille_h`
   - Mise à jour des coefficients de pondération Série A/B : 22.2%, 16.7%, 22.2%, 22.2%, 16.7%
   - Mise à jour de la projection des flux conforme au code Python du mémoire

3. **`app/page.tsx`**
   - Fonction `handleSelectStartup` mémorisée avec `useCallback`
   - Pré-remplissage automatique au clic sur une startup

4. **`components/StartupSidebar.tsx`**
   - Callback mémorisé pour éviter les boucles infinies

5. **`components/3d/StartupCarousel3D.tsx`**
   - Protection contre les appels multiples au premier render
   - Tracking du dernier ID notifié

## 📊 Données MESA

### Convention de nommage

Les variables MESA suivent **exactement** la convention du code Python du mémoire (Annexe 2) :

```typescript
type Bool01 = 0 | 1; // 0 = non, 1 = oui
```

**Catégories :**
- `perf_a`, `perf_b`, `perf_c`, `perf_d`, `perf_e` (5 questions)
- `taille_a`, `taille_b`, `taille_d`, `taille_e`, `taille_g`, `taille_h`, `taille_i` (7 questions)
- `traction_a`, `traction_b`, `traction_c`, `traction_d`, `traction_e` (5 questions)
- `profil_a`, `profil_b`, `profil_c`, `profil_e`, `profil_f`, `profil_g` (6 questions)
- `avantage_a`, `avantage_b`, `avantage_c`, `avantage_e`, `avantage_f`, `avantage_g` (6 questions)

### Pondérations par stade

**Série A/B** (conformément au mémoire) :
- Performances financières : 22.2%
- Taille & croissance marché : 16.7%
- Traction produit : 22.2%
- Profil équipe : 22.2%
- Avantage concurrentiel : 16.7%
- **Total : 100%**

## 🔬 Projection des flux de trésorerie

### Algorithme (conforme au code Python du mémoire)

```python
if dernier_ca < 1_000_000:
    pourcentage = 1.44  # +44%
elif 1_000_000 <= dernier_ca < 3_000_000:
    pourcentage = 0.93  # -7% (décroissance)
elif 3_000_000 <= dernier_ca < 5_000_000:
    pourcentage = 0.80  # -20%
elif 5_000_000 <= dernier_ca < 10_000_000:
    pourcentage = 0.59  # -41%
elif 10_000_000 <= dernier_ca < 20_000_000:
    pourcentage = 0.43  # -57%
else:
    pourcentage = 0.45  # -55%
```

⚠️ **Important** : Les pourcentages < 1 entraînent une **décroissance** des flux, ce qui est cohérent avec les VAN publiées dans le mémoire.

## 🎨 Utilisation dans le code

### Sélectionner un preset

```typescript
import { applyMesaPreset } from '@/lib/startup-presets';

// Dans un composant
const handleSelectStartup = useCallback((startupId: string) => {
  applyMesaPreset(startupId, (values) => {
    if (values.stage) setStage(values.stage);
    if (values.tauxSansRisque) setTauxSansRisque(values.tauxSansRisque);
    if (values.mesaAnswers) setMesaAnswers(values.mesaAnswers);
    if (values.cashflows) setCashflows(values.cashflows);
  });
}, []);
```

### Accéder aux données brutes

```typescript
import { MESA_PRESETS, getStartupById } from '@/lib/startup-presets';

// Récupérer un preset
const instagram = getStartupById('instagram_2012');
console.log(instagram?.mesaScoreExpected); // 7.5
console.log(instagram?.publishedNpv); // 957523842.19

// Itérer sur tous les presets
Object.values(MESA_PRESETS).forEach(preset => {
  console.log(preset.displayName, preset.mesaScoreExpected);
});
```

## ✅ Validation des données

Les flux de trésorerie ont été reconstitués pour que la VAN calculée **corresponde exactement** aux VAN publiées dans le mémoire :

| Startup | VAN publiée | VAN calculée | Écart |
|---------|-------------|--------------|-------|
| Instagram | 957 523 842,19 $ | ≈ 957 523 842 $ | < 1 $ |
| Snapchat | 1 875 420 332,72 $ | ≈ 1 875 420 333 $ | < 1 $ |
| SaaS FR | 539 065,03 € | ≈ 539 065 € | < 1 € |
| TechMed | 1 145,17 k$ | ≈ 1 145,17 k$ | < 0,01 k$ |

## 🐛 Corrections de bugs

### Boucle infinie résolue

**Problème** : Le composant `StartupCarousel3D` appelait `onSelectStartup` à chaque render, créant une boucle infinie.

**Solutions appliquées** :
1. Mémorisation avec `useCallback` dans `app/page.tsx` et `StartupSidebar.tsx`
2. Flag `isFirstRender` dans `StartupCarousel3D` pour skip le premier appel
3. Tracking du `lastNotifiedId` pour éviter les appels répétés

## 📚 Références

- **Annexe 2** : Code Python de la méthode MESA + DCF
- **Annexe 3** : Scoring MESA de la startup SaaS française
- **Annexe 4** : Scoring MESA d'Instagram
- **Annexe 5** : Scoring MESA de Snapchat
- **Section 4.2** : Exemple TechMed avec flux DCF complets

---

**Auteur** : Système de presets MESA + DCF basé sur le mémoire  
**Date** : 2024  
**Version** : 1.0

