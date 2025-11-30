# GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour l'automatisation CI/CD.

## 📁 Fichiers

| Workflow | Fichier | Déclenchement | Description |
|----------|---------|---------------|-------------|
| **CI** | `ci.yml` | Push/PR sur main/develop | Tests automatiques, build, validation |
| **Release** | `release.yml` | Manuel (workflow_dispatch) | Bump version, tag, release GitHub |
| **Publish** | `publish.yml` | GitHub Release créée | Publication sur npm |

## 🔄 Pipeline complet

```
┌─────────────────────────────────────────────────────────────┐
│                    Push/PR sur main                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   CI Workflow (ci.yml) │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌──────┐      ┌─────────┐     ┌──────┐
    │ Lint │      │  Build  │     │ Test │
    └──────┘      └─────────┘     └──────┘
                        │
                        ▼
                ┌───────────────┐
                │   ✓ Validé    │
                └───────────────┘

════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│        Manuel: Actions → Release → Run workflow             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌────────────────────────────────┐
        │ Release Workflow (release.yml)  │
        └────────────┬───────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌─────────┐
   │ Bump   │  │ Update  │  │  Git    │
   │Version │  │CHANGELOG│  │ Tag     │
   └────────┘  └─────────┘  └────┬────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │ GitHub Release   │
                        │    Created       │
                        └─────────┬────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────┐
        │   Publish Workflow (publish.yml)    │
        └──────────────┬──────────────────────┘
                       │
           ┌───────────┼───────────┐
           │           │           │
           ▼           ▼           ▼
      ┌────────┐  ┌────────┐  ┌─────────┐
      │ Build  │  │Validate│  │ Publish │
      │  TS    │  │Package │  │  npm    │
      └────────┘  └────────┘  └────┬────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │  📦 Published!   │
                        │  npm registry    │
                        └──────────────────┘
```

## 🎯 Utilisation

### CI - Automatique

Déclenché automatiquement à chaque push/PR:
- Vérifie le code (lint, typecheck)
- Build le TypeScript
- Valide le package
- Exécute les tests

### Release - Manuel

1. Allez dans **Actions** → **Release**
2. Cliquez sur **Run workflow**
3. Sélectionnez le type de version:
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
   - `minor` - New features (1.0.0 → 1.1.0)
   - `major` - Breaking changes (1.0.0 → 2.0.0)
4. Ajoutez le changelog (optionnel)
5. Cliquez sur **Run workflow**

### Publish - Automatique

Se déclenche automatiquement quand une GitHub Release est créée (par le workflow Release).

## 🔐 Secrets requis

| Secret | Description | Où le créer |
|--------|-------------|-------------|
| `NPM_TOKEN` | Token npm pour publication | [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens |
| `GITHUB_TOKEN` | Token GitHub (automatique) | Fourni par GitHub Actions |

## 📝 Configuration

### Ajouter NPM_TOKEN

```bash
# 1. Créer token sur npmjs.com
# 2. GitHub → Settings → Secrets and variables → Actions
# 3. New repository secret
# 4. Name: NPM_TOKEN
# 5. Value: <votre-token>
```

## 🔍 Monitoring

### Voir les workflows en cours

```bash
# Sur GitHub
Actions → Sélectionner un workflow → Voir les logs
```

### Vérifier la publication

```bash
# Dernière version sur npm
npm view expo-android-targets version

# Toutes les versions
npm view expo-android-targets versions
```

## 🛠️ Développement local

Tester avant de push:

```bash
# Type check
npm run typecheck

# Build
npm run build

# Test
npm test

# Simuler publication (dry-run)
npm pack --dry-run
```

## 📚 Documentation

- [Guide complet CI/CD](./CICD_GUIDE.md) - Documentation détaillée
- [Setup rapide](./SETUP.md) - Configuration en 5 minutes
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 🔄 Workflow quotidien

```bash
# 1. Développer
git checkout -b feature/my-feature
# ... code ...

# 2. Tester localement
npm run typecheck
npm run build
npm test

# 3. Commit & Push
git commit -am "feat: my feature"
git push origin feature/my-feature

# 4. Créer PR
# → CI s'exécute automatiquement

# 5. Merger PR

# 6. Release (via GitHub UI)
# Actions → Release → Run workflow → patch/minor/major
# → Publish automatiquement sur npm
```

## ✅ Status Badges

Ajoutez dans votre README.md:

```markdown
![CI](https://github.com/emplica/expo-android-targets/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/emplica/expo-android-targets/actions/workflows/release.yml/badge.svg)
![Publish](https://github.com/emplica/expo-android-targets/actions/workflows/publish.yml/badge.svg)
```

## 🆘 Support

- [Issues](https://github.com/emplica/expo-android-targets/issues)
- [Discussions](https://github.com/emplica/expo-android-targets/discussions)
