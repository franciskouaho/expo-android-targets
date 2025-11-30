# expo-android-targets - Project Summary

Package npm complet pour ajouter des widgets Android à votre app Expo/React Native.

## 📦 Structure du Package

```
expo-android-targets/
├── src/                          # Source TypeScript
│   ├── index.ts                  # Point d'entrée principal
│   ├── withAndroidWidget.ts      # Plugin Expo config
│   └── widget.ts                 # Helper React Native
│
├── templates/                    # Fichiers à copier dans le projet
│   ├── kotlin/                   # Code Kotlin du widget
│   │   ├── NightlyGlanceWidget.kt
│   │   ├── NightlyGlanceWidgetReceiver.kt
│   │   ├── WidgetPreferences.kt
│   │   ├── WidgetModule.kt
│   │   └── WidgetPackage.kt
│   ├── xml/
│   │   └── nightly_widget_info.xml
│   └── layout/
│       └── appwidget_placeholder.xml
│
├── build/                        # TypeScript compilé (généré)
│   ├── index.js
│   ├── index.d.ts
│   ├── withAndroidWidget.js
│   ├── withAndroidWidget.d.ts
│   ├── widget.js
│   └── widget.d.ts
│
├── package.json                  # Métadonnées npm
├── tsconfig.json                 # Configuration TypeScript
├── README.md                     # Documentation principale
├── WIDGET_SETUP.md              # Guide complet
├── QUICK_START.md               # Guide rapide
├── PUBLISHING.md                # Guide de publication
├── CHANGELOG.md                 # Historique des versions
├── LICENSE                      # Licence MIT
├── .gitignore                   # Git ignore
├── .npmignore                   # npm ignore
└── example.app.config.js        # Exemple de configuration
```

## 🎯 Ce que fait le package

### 1. Configuration automatique

Le plugin Expo (`withAndroidWidget.ts`) modifie automatiquement:

- **build.gradle** → Ajoute les dépendances Glance/AndroidX
- **AndroidManifest.xml** → Enregistre le widget receiver
- **MainApplication.kt** → Ajoute le WidgetPackage
- **Copie les fichiers** → Kotlin et XML dans le projet Android

### 2. Widget Jetpack Glance

Le widget affiche:
- Un titre
- Un sous-titre
- Design moderne avec Compose for Glance

### 3. Bridge React Native

JavaScript ↔ Native via `updateWidgetData(title, subtitle)`

- Écrit dans SharedPreferences
- Déclenche le rafraîchissement du widget
- Type-safe avec TypeScript

## 🚀 Utilisation par les développeurs

### Installation

```bash
npm install expo-android-targets
```

### Configuration (app.config.js)

```javascript
module.exports = {
  android: {
    package: "com.votreapp.android"
  },
  plugins: ["expo-android-targets"]
};
```

### Build

```bash
npx expo prebuild --platform android
npx expo run:android
```

### Usage dans l'app

```typescript
import { updateWidgetData } from 'expo-android-targets';

updateWidgetData('Nightly', 'Prochain jeu: Action ou Vérité');
```

## 📝 Fichiers Importants

### src/index.ts
- Exporte le plugin et les helpers
- Point d'entrée du package

### src/withAndroidWidget.ts
- Plugin Expo config
- Modifie Gradle, Manifest, MainApplication
- Copie les templates

### src/widget.ts
- Helper React Native
- Appelle le NativeModule
- Gestion d'erreurs

### templates/kotlin/
- **NightlyGlanceWidget.kt**: UI du widget (Compose)
- **NightlyGlanceWidgetReceiver.kt**: Receiver Android
- **WidgetPreferences.kt**: Gestion SharedPreferences
- **WidgetModule.kt**: Native Module RN
- **WidgetPackage.kt**: ReactPackage

### templates/xml/
- **nightly_widget_info.xml**: Métadonnées widget
- **appwidget_placeholder.xml**: Layout placeholder

## 🔧 Développement du Package

### Setup local

```bash
cd /chemin/vers/expo-android-targets
bun install
```

### Build TypeScript

```bash
bun run build
```

### Test local

```bash
# Dans le package
npm link

# Dans un projet test
npm link expo-android-targets
```

### Structure de développement

```bash
# Modifier le code source
src/withAndroidWidget.ts
src/widget.ts

# Compiler
bun run build

# Les fichiers générés apparaissent dans build/
build/index.js
build/index.d.ts
...
```

## 📦 Publication npm

### Checklist

1. ✅ Incrémenter version dans `package.json`
2. ✅ Mettre à jour `CHANGELOG.md`
3. ✅ Compiler: `bun run build`
4. ✅ Tester localement avec `npm link`
5. ✅ Vérifier les fichiers: `npm pack --dry-run`

### Commandes

```bash
# Première publication
npm publish --access public

# Mises à jour
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish
```

## 🎨 Personnalisation pour les utilisateurs

Les utilisateurs peuvent modifier après `expo prebuild`:

### Couleurs
`android/app/src/main/java/.../widget/NightlyGlanceWidget.kt`
```kotlin
.background(ColorProvider(android.graphics.Color.parseColor("#1a1a2e")))
```

### Taille
`android/app/src/main/res/xml/nightly_widget_info.xml`
```xml
android:minWidth="180dp"
android:minHeight="60dp"
```

### Textes
Via l'API JavaScript:
```typescript
updateWidgetData('Nouveau titre', 'Nouveau sous-titre')
```

## 🧪 Tests

### Tests manuels

1. Créer un projet Expo test:
   ```bash
   npx create-expo-app test-widget
   cd test-widget
   ```

2. Installer le package:
   ```bash
   npm install expo-android-targets
   ```

3. Configurer `app.config.js`:
   ```javascript
   plugins: ["expo-android-targets"]
   ```

4. Build et tester:
   ```bash
   npx expo prebuild --platform android
   npx expo run:android
   ```

5. Ajouter le widget au home screen

6. Appeler `updateWidgetData()` depuis l'app

7. Vérifier que le widget se met à jour

### Tests automatisés (futur)

- Tests unitaires du plugin
- Tests d'intégration avec Expo
- CI/CD avec GitHub Actions

## 📚 Documentation

- **README.md**: Overview, installation, usage
- **WIDGET_SETUP.md**: Guide complet avec customisation
- **QUICK_START.md**: Guide rapide 5 minutes
- **PUBLISHING.md**: Guide publication npm
- **CHANGELOG.md**: Historique versions
- **example.app.config.js**: Exemple configuration

## 🔑 Points Clés

### Architecture

```
User App (JavaScript)
    ↓
updateWidgetData()
    ↓
NativeModules.WidgetModule
    ↓
WidgetModule.kt (Native)
    ↓
WidgetPreferences (SharedPreferences)
    ↓
NightlyGlanceWidget.refreshAll()
    ↓
Glance UI Update
    ↓
Android Home Screen
```

### Technologies

- **Expo Config Plugins**: Modification native automatique
- **Jetpack Glance**: UI widget moderne
- **React Native Bridge**: Communication JS ↔ Native
- **SharedPreferences**: Persistence données
- **TypeScript**: Type safety
- **Kotlin**: Code natif Android

### Avantages

✅ Zero code natif pour l'utilisateur
✅ Installation simple via npm
✅ Configuration automatique
✅ Type-safe
✅ Personnalisable
✅ Production-ready
✅ Open source (MIT)

## 🔄 Workflow de mise à jour

1. **Bug fix ou nouvelle fonctionnalité**
   - Modifier `src/` ou `templates/`
   - Compiler: `bun run build`
   - Tester localement

2. **Documentation**
   - Mettre à jour README.md
   - Ajouter au CHANGELOG.md

3. **Version**
   ```bash
   npm version patch  # ou minor/major
   ```

4. **Publication**
   ```bash
   npm publish
   ```

5. **Tag Git**
   ```bash
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin v1.0.1
   ```

6. **GitHub Release**
   - Créer une release sur GitHub
   - Copier le CHANGELOG

## 🐛 Troubleshooting courant

### Build errors
- Nettoyer: `rm -rf android && npx expo prebuild`
- Vérifier package name cohérent

### Widget not appearing
- Vérifier AndroidManifest.xml
- Vérifier que les fichiers Kotlin sont copiés
- Logs: `adb logcat | grep -i widget`

### Not updating
- Vérifier WidgetPackage dans MainApplication
- Vérifier SharedPreferences
- Tester avec `updateWidgetData()`

## 📊 Métriques

### Fichiers
- 3 fichiers TypeScript source
- 5 fichiers Kotlin template
- 2 fichiers XML template
- 6 fichiers documentation

### Dépendances
- Production: `@expo/config-plugins`
- Dev: `typescript`, `@types/node`

### Taille package
- Source: ~20 KB
- Compilé: ~30 KB
- Templates: ~15 KB
- **Total: ~65 KB**

## 🎯 Prochaines étapes potentielles

### Fonctionnalités
- [ ] Support iOS widgets (WidgetKit)
- [ ] Thèmes multiples
- [ ] Images dans le widget
- [ ] Actions cliquables
- [ ] Configuration avancée du plugin
- [ ] Mises à jour périodiques automatiques

### Technique
- [ ] Tests automatisés (Jest)
- [ ] CI/CD (GitHub Actions)
- [ ] Exemple app démo
- [ ] Playground en ligne
- [ ] Support config avec options

### Communauté
- [ ] Documentation vidéo
- [ ] Blog posts
- [ ] Templates supplémentaires
- [ ] Contributions community

## 📞 Support

- GitHub Issues: https://github.com/emplica/expo-android-targets/issues
- Documentation: README.md
- Email: [votre email]

## 📄 Licence

MIT © Emplica

---

**Version**: 1.0.0
**Dernière mise à jour**: 2025-01-XX
**Auteur**: Emplica
**Status**: ✅ Ready for production
