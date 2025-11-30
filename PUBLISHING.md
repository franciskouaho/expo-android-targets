# Publishing Guide - expo-android-targets

Guide pour publier le package sur npm.

## Pré-requis

1. **Compte npm**
   ```bash
   npm login
   ```

2. **Build le TypeScript**
   ```bash
   bun install
   bun run build
   ```

3. **Vérifier la structure**
   ```bash
   ls -la build/
   # Devrait contenir: index.js, index.d.ts, withAndroidWidget.js, withAndroidWidget.d.ts, widget.js, widget.d.ts
   ```

## Checklist avant publication

- [ ] Version mise à jour dans `package.json`
- [ ] `CHANGELOG.md` mis à jour avec les nouvelles fonctionnalités
- [ ] Code compilé (`bun run build` exécuté)
- [ ] Tests effectués dans un projet Expo
- [ ] README à jour
- [ ] Pas de fichiers sensibles dans le package

## Test en local

Avant de publier, testez le package localement:

```bash
# Dans le dossier du package
npm link

# Dans un projet Expo de test
cd /path/to/test-project
npm link expo-android-targets

# Ajouter à app.config.js
plugins: ["expo-android-targets"]

# Tester
bunx expo prebuild --platform android
bunx expo run:android
```

## Publication

### 1. Première publication

```bash
# Vérifier les fichiers qui seront publiés
npm pack --dry-run

# Voir le contenu du tarball
npm pack
tar -tzf expo-android-targets-1.0.0.tgz

# Publier (package public)
npm publish --access public
```

### 2. Mises à jour ultérieures

```bash
# Patch version (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor version (1.0.0 -> 1.1.0) - Nouvelles fonctionnalités
npm version minor

# Major version (1.0.0 -> 2.0.0) - Breaking changes
npm version major

# Publier
npm publish
```

## Vérification post-publication

1. **Vérifier sur npm**
   ```
   https://www.npmjs.com/package/expo-android-targets
   ```

2. **Installer dans un nouveau projet**
   ```bash
   npx create-expo-app test-widget
   cd test-widget
   npm install expo-android-targets
   ```

3. **Tester l'installation**
   ```javascript
   // app.config.js
   module.exports = {
     plugins: ["expo-android-targets"]
   };
   ```

   ```bash
   npx expo prebuild --platform android
   ```

## Structure du package publié

Le package npm contient:

```
expo-android-targets/
├── build/                    # TypeScript compilé
│   ├── index.js
│   ├── index.d.ts
│   ├── withAndroidWidget.js
│   ├── withAndroidWidget.d.ts
│   ├── widget.js
│   └── widget.d.ts
├── templates/               # Fichiers Kotlin et XML
│   ├── kotlin/
│   │   ├── NightlyGlanceWidget.kt
│   │   ├── NightlyGlanceWidgetReceiver.kt
│   │   ├── WidgetPreferences.kt
│   │   ├── WidgetModule.kt
│   │   └── WidgetPackage.kt
│   ├── xml/
│   │   └── nightly_widget_info.xml
│   └── layout/
│       └── appwidget_placeholder.xml
├── package.json
├── README.md
└── LICENSE
```

## Dépannage

### "You do not have permission to publish"

```bash
# Vérifier que vous êtes connecté
npm whoami

# Se connecter
npm login

# Vérifier l'organisation/scope
npm owner ls expo-android-targets
```

### "Version already exists"

```bash
# Incrémenter la version
npm version patch

# Ou éditer manuellement package.json
```

### "Missing dependencies in build/"

```bash
# Nettoyer et rebuilder
bun run clean
bun run build

# Vérifier le contenu
ls -la build/
```

## Badge npm

Ajouter au README:

```markdown
[![npm version](https://img.shields.io/npm/v/expo-android-targets.svg)](https://www.npmjs.com/package/expo-android-targets)
[![downloads](https://img.shields.io/npm/dm/expo-android-targets.svg)](https://www.npmjs.com/package/expo-android-targets)
```

## GitHub Release

1. Créer un tag:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. Créer une release sur GitHub avec le CHANGELOG

## Maintenance continue

### Tester avec nouvelles versions d'Expo

```bash
# Créer un projet avec nouvelle version Expo
npx create-expo-app@latest test-new-expo
cd test-new-expo
npm install expo-android-targets

# Tester
npx expo prebuild --platform android
npx expo run:android
```

### Mettre à jour les dépendances

```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour
npm update

# Tester après mise à jour
bun run build
```

## Rollback en cas de problème

```bash
# Déprécier une version problématique
npm deprecate expo-android-targets@1.0.1 "Version broken, use 1.0.2"

# Ou unpublish (dans les 72h seulement)
npm unpublish expo-android-targets@1.0.1
```

## Automatisation (optionnel)

Créer `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Support

Pour questions:
- GitHub Issues: https://github.com/emplica/expo-android-targets/issues
- Email: [votre email de support]
