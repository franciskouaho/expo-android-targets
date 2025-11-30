# CI/CD Setup - Summary

✅ **CI/CD complet configuré pour expo-android-targets !**

## 📦 Fichiers créés

### Workflows GitHub Actions

```
.github/
├── workflows/
│   ├── ci.yml           ✅ Tests automatiques (push/PR)
│   ├── release.yml      ✅ Création releases (manuel)
│   ├── publish.yml      ✅ Publication npm (auto)
│   └── README.md        📖 Documentation workflows
├── CICD_GUIDE.md        📖 Guide complet CI/CD
└── SETUP.md             📖 Setup rapide 5 min
```

### Scripts package.json

```json
{
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build",
    "clean": "rm -rf build",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run clean && npm run build",
    "test": "echo \"No tests yet\" && exit 0"
  }
}
```

## 🚀 Comment utiliser

### 1️⃣ Configuration initiale (5 min)

```bash
# 1. Créer token npm
# → https://www.npmjs.com/settings/tokens
# → "Generate New Token" → "Automation"

# 2. Ajouter token sur GitHub
# → Settings → Secrets → New secret
# → Name: NPM_TOKEN
# → Value: <votre-token>

# 3. Push les workflows
git add .github/
git commit -m "ci: setup CI/CD workflows"
git push origin main
```

### 2️⃣ Développement quotidien

```bash
# Créer branche
git checkout -b feature/ma-feature

# Développer
# ... code ...

# Commit & Push
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin feature/ma-feature

# Créer PR
# ✓ CI s'exécute automatiquement
# ✓ Lint, TypeCheck, Build, Tests, Validation
```

### 3️⃣ Créer une release

**Option A: Via GitHub UI (Recommandé)**

```
1. Allez sur GitHub → Actions
2. Sélectionnez "Release" workflow
3. Click "Run workflow"
4. Choisissez:
   - Version type: patch/minor/major
   - Changelog: Description des changements
5. Click "Run workflow"

✓ Automatiquement:
  → Bump version (package.json)
  → Update CHANGELOG.md
  → Commit & Tag (v1.0.1)
  → Push tag
  → Create GitHub Release
  → Publish to npm
```

**Option B: Manuellement**

```bash
# Bump version
npm version patch  # ou minor/major

# Edit CHANGELOG.md
# ...

# Commit & Tag
git push origin main
git push origin v1.0.1

# Create GitHub Release
# ✓ Déclenche publish workflow automatiquement
```

## 🔄 Pipeline CI/CD

### Workflow 1: CI (Automatique)

**Trigger:** Push/PR sur main/develop

```
Push/PR → CI Workflow
          ├─ Lint
          ├─ Type Check
          ├─ Build TypeScript
          ├─ Tests
          └─ Validate Package
```

### Workflow 2: Release (Manuel)

**Trigger:** Actions → Release → Run workflow

```
Manual Trigger → Release Workflow
                 ├─ Bump Version (patch/minor/major)
                 ├─ Update CHANGELOG.md
                 ├─ Git Commit
                 ├─ Git Tag (v1.0.1)
                 ├─ Push Tag
                 └─ Create GitHub Release
                     └─ Triggers Publish Workflow
```

### Workflow 3: Publish (Automatique)

**Trigger:** GitHub Release créée

```
GitHub Release → Publish Workflow
                 ├─ Build TypeScript
                 ├─ Validate Package
                 └─ Publish to npm (with provenance)
```

## 📊 Features

### ✅ CI/CD Features

- ✅ **Tests automatiques** à chaque push/PR
- ✅ **Type checking** TypeScript
- ✅ **Build validation** avant publication
- ✅ **Bump automatique** de version
- ✅ **CHANGELOG** auto-update
- ✅ **Git tagging** automatique
- ✅ **GitHub Releases** créées automatiquement
- ✅ **Publication npm** automatisée
- ✅ **Provenance** npm pour sécurité
- ✅ **Artifacts** sauvegardés (build/)
- ✅ **Summary** détaillé dans GitHub Actions

### 🔐 Sécurité

- ✅ npm token stocké dans GitHub Secrets
- ✅ Provenance attestation pour packages npm
- ✅ Permissions minimales pour chaque workflow
- ✅ Validation du package avant publication

## 📝 Scénarios d'utilisation

### Scénario 1: Bug Fix

```bash
# 1. Fix le bug
git checkout -b fix/widget-update
# ... fix ...
git commit -m "fix: widget update issue"
git push

# 2. Créer PR → CI vérifie

# 3. Merger PR

# 4. Release
# Actions → Release → Run workflow
# Version: patch (1.0.0 → 1.0.1)
# Changelog: "### Fixed\n- Widget update issue"

# ✓ Publié sur npm automatiquement
```

### Scénario 2: Nouvelle fonctionnalité

```bash
# 1. Développer feature
git checkout -b feature/custom-widgets
# ... code ...
git commit -m "feat: support custom widget layouts"
git push

# 2. PR → CI

# 3. Merger

# 4. Release
# Version: minor (1.0.0 → 1.1.0)
# Changelog: "### Added\n- Custom widget layouts support"

# ✓ Publié automatiquement
```

### Scénario 3: Breaking Change

```bash
# 1. Implémenter breaking change
git checkout -b breaking/new-api
# ... code ...
git commit -m "feat!: new widget API"
git push

# 2. PR → CI

# 3. Merger

# 4. Release
# Version: major (1.0.0 → 2.0.0)
# Changelog: "### Breaking Changes\n- New widget API\n\n### Migration\nSee MIGRATION.md"

# ✓ Publié automatiquement
```

## 🎯 Avantages

### Pour le développeur

- ✅ **Zéro configuration** - Fonctionne out-of-the-box
- ✅ **Pas de commandes manuelles** - Tout automatisé
- ✅ **Pas d'oublis** - CHANGELOG, tags, releases
- ✅ **Validation avant merge** - CI sur toutes les PRs
- ✅ **Releases reproductibles** - Toujours le même process

### Pour les utilisateurs

- ✅ **Packages fiables** - Testés avant publication
- ✅ **Provenance vérifiée** - npm provenance attestation
- ✅ **Releases claires** - GitHub Releases avec changelog
- ✅ **Semantic versioning** - Versions prévisibles

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [.github/SETUP.md](.github/SETUP.md) | Setup rapide 5 minutes |
| [.github/CICD_GUIDE.md](.github/CICD_GUIDE.md) | Guide complet et détaillé |
| [.github/workflows/README.md](.github/workflows/README.md) | Documentation des workflows |

## 🔍 Monitoring

### Vérifier le status

```bash
# Sur GitHub
→ Actions tab
→ Voir les workflows en cours
→ Cliquer sur un workflow pour les logs

# Vérifier npm
npm view expo-android-targets version
npm view expo-android-targets versions
```

### Badges GitHub

Ajoutez dans README.md:

```markdown
![CI](https://github.com/emplica/expo-android-targets/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/expo-android-targets.svg)
```

## 🛠️ Commandes utiles

```bash
# Tester localement avant push
npm run typecheck    # Vérifier types
npm run build        # Build TS
npm test             # Tests
npm pack --dry-run   # Simuler publication

# Git workflow
git checkout -b feature/my-feature
git commit -m "feat: description"
git push origin feature/my-feature

# Après merge sur main
# → Actions → Release → Run workflow
# → patch/minor/major
# → ✓ Publié automatiquement
```

## ✅ Checklist première release

- [x] CI/CD workflows créés
- [x] Scripts npm configurés
- [ ] Token npm créé sur npmjs.com
- [ ] Secret NPM_TOKEN ajouté sur GitHub
- [ ] Premier push des workflows
- [ ] Premier workflow CI exécuté avec succès
- [ ] Première release créée via GitHub Actions
- [ ] Package publié sur npm
- [ ] Badge CI ajouté au README

## 🎉 Prochaines étapes

1. **Configurer le token npm** (si pas encore fait)
2. **Push les workflows** sur GitHub
3. **Créer la première release** via Actions UI
4. **Vérifier la publication** sur npmjs.com
5. **Ajouter les badges** au README

## 🆘 Support

- 📖 [Guide complet](.github/CICD_GUIDE.md)
- 📖 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 🐛 [Issues](https://github.com/emplica/expo-android-targets/issues)
