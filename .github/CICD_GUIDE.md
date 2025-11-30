# CI/CD Guide - expo-android-targets

Guide complet pour configurer et utiliser le CI/CD avec GitHub Actions.

## 📋 Vue d'ensemble

Le projet utilise **3 workflows GitHub Actions** :

1. **`ci.yml`** - Tests automatiques à chaque push/PR
2. **`release.yml`** - Création de releases avec bump de version
3. **`publish.yml`** - Publication automatique sur npm

## 🔧 Configuration initiale

### 1. Créer un token npm

1. Connectez-vous sur [npmjs.com](https://www.npmjs.com)
2. Allez dans **Account Settings** → **Access Tokens**
3. Cliquez sur **Generate New Token** → **Classic Token**
4. Sélectionnez **Automation** (pour CI/CD)
5. Copiez le token généré

### 2. Ajouter le token à GitHub

1. Allez dans votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**
4. Nom: `NPM_TOKEN`
5. Valeur: Collez votre token npm
6. Cliquez sur **Add secret**

### 3. Activer GitHub Actions

1. Dans votre repo GitHub, allez dans **Actions**
2. Si c'est la première fois, cliquez sur **I understand my workflows, go ahead and enable them**
3. Les workflows dans `.github/workflows/` seront automatiquement détectés

## 🔄 Workflows

### CI Workflow (ci.yml)

**Déclenchement :**
- Push sur `main` ou `develop`
- Pull Request vers `main` ou `develop`

**Jobs exécutés :**
1. **Lint** - Vérifie le code (ESLint si configuré)
2. **Type Check** - Vérifie les types TypeScript
3. **Build** - Compile le TypeScript
4. **Test** - Exécute les tests (placeholder pour l'instant)
5. **Validate Package** - Vérifie que le package peut être publié

**Utilisation :**
```bash
# Automatique à chaque push/PR
git push origin main
```

### Release Workflow (release.yml)

**Déclenchement :** Manuel uniquement

**Actions :**
1. Bump la version (`patch`, `minor`, ou `major`)
2. Met à jour `CHANGELOG.md`
3. Commit les changements
4. Crée un tag Git (`v1.0.1`, `v1.1.0`, etc.)
5. Push le tag et déclenche le workflow de publication
6. Crée une GitHub Release

**Utilisation :**

1. Allez dans **Actions** → **Release** → **Run workflow**
2. Sélectionnez:
   - **Version type**: `patch` (1.0.0→1.0.1), `minor` (1.0.0→1.1.0), ou `major` (1.0.0→2.0.0)
   - **Changelog** (optionnel): Description des changements
3. Cliquez sur **Run workflow**

**Exemple de changelog:**
```
### Added
- Support pour widgets personnalisés
- Nouvelle option de configuration

### Fixed
- Bug dans la mise à jour du widget
```

### Publish Workflow (publish.yml)

**Déclenchement :**
- Automatiquement quand une GitHub Release est publiée
- Manuellement via **Actions** → **Publish to npm** → **Run workflow**

**Actions :**
1. Installe les dépendances
2. Build le TypeScript
3. Valide le package
4. Publie sur npm avec `--provenance` (sécurité)

**Note:** Ce workflow se déclenche automatiquement après le workflow `release.yml`

## 📝 Workflow de développement

### Développement quotidien

```bash
# 1. Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# 2. Faire vos changements
# ... code ...

# 3. Commit
git add .
git commit -m "feat: ajout de la nouvelle fonctionnalité"

# 4. Push
git push origin feature/nouvelle-fonctionnalite

# 5. Créer une Pull Request sur GitHub
# Le CI s'exécute automatiquement ✓
```

### Créer une release

```bash
# Option 1: Via GitHub Actions (recommandé)
# 1. Allez dans Actions → Release → Run workflow
# 2. Sélectionnez le type de version (patch/minor/major)
# 3. Ajoutez le changelog
# 4. Run workflow
# ✓ Automatiquement: bump version, tag, release GitHub, publish npm

# Option 2: Manuellement
git checkout main
git pull origin main

# Bump version
npm version patch  # ou minor/major

# Éditer CHANGELOG.md manuellement
# ...

# Commit et tag
git push origin main
git push origin v1.0.1

# Créer release sur GitHub
# ✓ Déclenche automatiquement publish workflow
```

## 🎯 Scénarios d'utilisation

### Bug Fix (patch: 1.0.0 → 1.0.1)

1. Fix le bug
2. **Actions** → **Release** → Run workflow
3. Version type: **patch**
4. Changelog:
   ```
   ### Fixed
   - Correction du bug de mise à jour du widget
   ```
5. **Run workflow**

### Nouvelle fonctionnalité (minor: 1.0.0 → 1.1.0)

1. Développer la fonctionnalité
2. Merger la PR
3. **Actions** → **Release** → Run workflow
4. Version type: **minor**
5. Changelog:
   ```
   ### Added
   - Support pour les images dans les widgets
   - Nouvelle API pour personnalisation avancée
   ```
6. **Run workflow**

### Breaking change (major: 1.0.0 → 2.0.0)

1. Implémenter les changements
2. **Actions** → **Release** → Run workflow
3. Version type: **major**
4. Changelog:
   ```
   ### Breaking Changes
   - Renommage de `updateWidget()` en `updateWidgetData()`
   - Nouvelle structure de configuration

   ### Migration Guide
   Voir MIGRATION.md pour les instructions de migration.
   ```
5. **Run workflow**

## 🔍 Vérification des workflows

### Logs en temps réel

1. Allez dans **Actions**
2. Cliquez sur le workflow en cours
3. Cliquez sur un job pour voir les logs

### Badges de statut

Ajoutez dans votre README.md:

```markdown
![CI](https://github.com/emplica/expo-android-targets/actions/workflows/ci.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/expo-android-targets.svg)
```

## 🛠️ Maintenance

### Mettre à jour les workflows

Les workflows sont dans `.github/workflows/`:
- `ci.yml` - Tests CI
- `release.yml` - Création de releases
- `publish.yml` - Publication npm

Modifier un workflow:
```bash
# Éditer le fichier
vim .github/workflows/ci.yml

# Commit et push
git add .github/workflows/ci.yml
git commit -m "ci: mise à jour du workflow CI"
git push origin main
```

### Révoquer/Renouveler le token npm

Si le token npm est compromis:

1. Allez sur [npmjs.com](https://www.npmjs.com) → **Access Tokens**
2. Révquez l'ancien token
3. Créez un nouveau token
4. Mettez à jour le secret `NPM_TOKEN` sur GitHub

## 📊 Monitoring

### Vérifier les publications

```bash
# Vérifier la dernière version sur npm
npm view expo-android-targets version

# Vérifier toutes les versions
npm view expo-android-targets versions

# Installer la dernière version
npm install expo-android-targets@latest
```

### Rollback en cas de problème

```bash
# Déprécier une version problématique
npm deprecate expo-android-targets@1.0.1 "Broken version, use 1.0.2 instead"

# Unpublish (dans les 72h seulement)
npm unpublish expo-android-targets@1.0.1
```

## 🚨 Dépannage

### Le workflow publish échoue

**Erreur: `npm ERR! code E401` (Unauthorized)**
- Vérifiez que le secret `NPM_TOKEN` est configuré
- Vérifiez que le token n'a pas expiré
- Régénérez un nouveau token si nécessaire

**Erreur: `npm ERR! code E403` (Forbidden)**
- Vérifiez que vous avez les droits de publication sur le package
- Vérifiez que le nom du package est disponible sur npm

**Erreur: Build failed**
- Vérifiez les logs du job "Build"
- Testez localement: `npm run build`
- Corrigez les erreurs TypeScript

### Le workflow release ne crée pas de tag

- Vérifiez que vous avez les permissions `contents: write`
- Vérifiez les logs du workflow
- Vérifiez que Git est correctement configuré dans le workflow

### Les tests échouent

- Vérifiez les logs du job "Test"
- Reproduisez localement: `npm test`
- Corrigez les tests qui échouent

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ✅ Checklist de déploiement

Avant de publier une nouvelle version:

- [ ] Tests passent localement (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Type check passe (`npm run typecheck`)
- [ ] CHANGELOG.md est à jour
- [ ] README.md est à jour si nécessaire
- [ ] Version suit le [Semantic Versioning](https://semver.org/)
- [ ] Token npm est valide et configuré sur GitHub
- [ ] Tous les fichiers nécessaires sont dans `files` (package.json)
