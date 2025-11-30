# Setup CI/CD - Quick Start

Guide rapide pour configurer le CI/CD en 5 minutes.

## 🚀 Étapes rapides

### 1. Token npm (2 min)

```bash
# 1. Allez sur npmjs.com → Account Settings → Access Tokens
# 2. Generate New Token → Automation
# 3. Copiez le token
```

### 2. GitHub Secret (1 min)

```bash
# 1. GitHub repo → Settings → Secrets and variables → Actions
# 2. New repository secret
# 3. Name: NPM_TOKEN
# 4. Value: <votre-token-npm>
# 5. Add secret
```

### 3. Premier Push (1 min)

```bash
git add .
git commit -m "ci: setup CI/CD workflows"
git push origin main

# ✓ Le CI s'exécute automatiquement
```

### 4. Première Release (1 min)

```bash
# Sur GitHub:
# 1. Actions → Release → Run workflow
# 2. Version type: patch
# 3. Changelog: "Initial release"
# 4. Run workflow

# ✓ Crée v1.0.0 et publie sur npm automatiquement
```

## 🎉 C'est tout !

Votre CI/CD est configuré. À partir de maintenant:

- ✅ **Chaque push** → Tests automatiques
- ✅ **Chaque PR** → Validation automatique
- ✅ **Chaque release** → Publication npm automatique

## 📖 Documentation complète

Voir [CICD_GUIDE.md](./CICD_GUIDE.md) pour tous les détails.

## 🔄 Workflow quotidien

```bash
# Développer
git checkout -b feature/ma-feature
# ... code ...
git commit -m "feat: nouvelle fonctionnalité"
git push

# Créer PR → CI s'exécute

# Merger PR → main

# Release (via GitHub Actions UI)
# Actions → Release → Run workflow → patch/minor/major

# ✓ Automatiquement publié sur npm !
```

## ⚙️ Configuration des workflows

Les workflows sont dans `.github/workflows/`:
- `ci.yml` - Tests automatiques
- `release.yml` - Création de releases
- `publish.yml` - Publication npm

**Aucune modification nécessaire** - ils fonctionnent out-of-the-box !

## 🆘 Besoin d'aide ?

- [Guide complet](./CICD_GUIDE.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [npm Token Guide](https://docs.npmjs.com/creating-and-viewing-access-tokens)
