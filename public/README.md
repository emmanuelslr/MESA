# Dossier Public

Ce dossier contient tous les fichiers statiques de votre application Next.js.

## Structure

- `images/` - Dossier pour stocker vos images

## Utilisation

Les fichiers placés dans ce dossier sont accessibles depuis la racine de votre site.

### Exemple :

Si vous placez une image `logo.png` dans `public/images/logo.png`, vous pouvez l'utiliser dans votre code comme ceci :

```tsx
<img src="/images/logo.png" alt="Logo" />
```

Ou avec le composant Next.js Image :

```tsx
import Image from 'next/image'

<Image src="/images/logo.png" alt="Logo" width={500} height={300} />
```

**Important :** Ne commencez pas le chemin avec `/public/`, utilisez directement `/images/...`

