# Git Workflow & Branching Strategy

## Tổng Quan

QuikRide sử dụng **Git Flow** workflow với các quy tắc rõ ràng để đảm bảo code quality và collaboration hiệu quả.

---

## Branch Structure

### Main Branches (Permanent)

#### 1. `main` / `master`
- **Purpose:** Production-ready code
- **Protection:**
  - ✅ Require pull request reviews (minimum 2 approvals)
  - ✅ Require status checks to pass
  - ✅ Require branches to be up to date
  - ✅ Include administrators
  - ❌ No direct commits
  - ❌ No force push
- **Deployment:** Auto-deploy to production
- **Naming:** `main`

#### 2. `develop`
- **Purpose:** Integration branch for features
- **Protection:**
  - ✅ Require pull request reviews (minimum 1 approval)
  - ✅ Require status checks to pass
  - ❌ No force push
- **Deployment:** Auto-deploy to staging environment
- **Naming:** `develop`

### Supporting Branches (Temporary)

#### 3. Feature Branches
- **Purpose:** Develop new features
- **Branch from:** `develop`
- **Merge to:** `develop`
- **Naming convention:** `feature/<issue-number>-<short-description>`
  - Examples:
    - `feature/123-user-authentication`
    - `feature/456-seat-selection-ui`
    - `feature/789-payment-integration`
- **Lifetime:** Delete after merge
- **Commit convention:** Use Conventional Commits

#### 4. Bugfix Branches
- **Purpose:** Fix bugs in develop branch
- **Branch from:** `develop`
- **Merge to:** `develop`
- **Naming convention:** `bugfix/<issue-number>-<short-description>`
  - Examples:
    - `bugfix/234-login-error`
    - `bugfix/567-booking-validation`
- **Lifetime:** Delete after merge

#### 5. Hotfix Branches
- **Purpose:** Fix critical bugs in production
- **Branch from:** `main`
- **Merge to:** `main` AND `develop`
- **Naming convention:** `hotfix/<version>-<short-description>`
  - Examples:
    - `hotfix/1.0.1-payment-crash`
    - `hotfix/1.2.3-security-patch`
- **Lifetime:** Delete after merge
- **Priority:** URGENT

#### 6. Release Branches
- **Purpose:** Prepare for production release
- **Branch from:** `develop`
- **Merge to:** `main` AND `develop`
- **Naming convention:** `release/<version>`
  - Examples:
    - `release/1.0.0`
    - `release/2.1.0`
- **Activities:**
  - Final testing
  - Bug fixes only (no new features)
  - Update version numbers
  - Update CHANGELOG
- **Lifetime:** Delete after merge

---

## Workflow Diagram

```
main ──────●─────────────────●─────────────────●────────> (production)
           │                 ▲                 ▲
           │                 │ (hotfix)       │ (release)
           │                 │                 │
           └────> hotfix ────┘                 │
                                               │
develop ───●───────●──────●──────●─────────────●────────> (staging)
           │       │      │      │             ▲
           │       │      │      │             │
           ▼       ▼      ▼      ▼             │
        feature feature feature bugfix      release
        branch  branch  branch  branch       branch
```

---

## Commit Message Convention

Sử dụng **Conventional Commits** specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat(auth): add Google OAuth login` |
| **fix** | Bug fix | `fix(booking): resolve seat lock issue` |
| **docs** | Documentation | `docs(readme): update installation guide` |
| **style** | Code style (formatting, missing semi colons, etc.) | `style(eslint): fix linting errors` |
| **refactor** | Code refactoring | `refactor(api): simplify booking controller` |
| **perf** | Performance improvement | `perf(search): add index for trip queries` |
| **test** | Adding tests | `test(auth): add unit tests for login` |
| **build** | Build system or dependencies | `build(deps): upgrade react to 18.2.0` |
| **ci** | CI/CD changes | `ci(github): add automated testing` |
| **chore** | Maintenance tasks | `chore(gitignore): add .env files` |
| **revert** | Revert previous commit | `revert: revert commit abc123` |

### Scope (Optional)
- `auth` - Authentication
- `booking` - Booking system
- `payment` - Payment processing
- `api` - Backend API
- `ui` - Frontend UI
- `db` - Database

### Subject
- Imperative mood ("add" not "added")
- No capitalization
- No period at the end
- Max 50 characters

### Body (Optional)
- Explain **what** and **why** (not how)
- Wrap at 72 characters

### Footer (Optional)
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123`, `Fixes #456`

### Examples

```bash
# Simple feature
feat(auth): add email verification

# Bug fix with issue reference
fix(booking): prevent double booking
Fixes #234

# Breaking change
feat(api): change booking API response format

BREAKING CHANGE: The booking response now returns an object instead of array.
Migration guide: https://docs.quikride.com/migration

# Multiple scopes
feat(auth,api): implement JWT refresh tokens
```

---

## Pull Request Process

### 1. Before Creating PR

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop

# Rebase your feature branch
git checkout feature/123-user-auth
git rebase develop

# Run tests locally
npm test

# Run linting
npm run lint

# Fix any conflicts
```

### 2. Creating PR

**Title format:** Same as commit message
```
feat(auth): add Google OAuth login
```

**Description template:**
```markdown
## 📝 Description
Brief description of what this PR does

## 🔗 Related Issue
Closes #123

## 🧪 Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## ✅ Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## 📸 Screenshots (if applicable)
Add screenshots for UI changes

## 🧪 Testing
How has this been tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## 📚 Additional Notes
Any additional information
```

### 3. Code Review

**Reviewer checklist:**
- [ ] Code quality and readability
- [ ] Tests coverage
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Breaking changes documented

**Review comments:**
- Be constructive and respectful
- Suggest improvements
- Approve if all criteria met

### 4. Merge Strategy

**Squash and Merge (Preferred)**
- Keeps commit history clean
- All commits in PR squashed into one
- Use for feature branches

**Merge Commit**
- Preserves all commits
- Use for release branches

**Rebase and Merge**
- Linear history
- Use when commits are already clean

---

## Git Commands Cheat Sheet

### Daily Workflow

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/123-new-feature

# Make changes and commit
git add .
git commit -m "feat(scope): add new feature"

# Push to remote
git push origin feature/123-new-feature

# Update with latest develop
git checkout develop
git pull origin develop
git checkout feature/123-new-feature
git rebase develop

# Squash last 3 commits (interactive rebase)
git rebase -i HEAD~3

# Amend last commit
git commit --amend -m "feat(scope): updated message"

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# Stash changes
git stash
git stash pop
git stash list

# Delete branch
git branch -d feature/123-new-feature
git push origin --delete feature/123-new-feature
```

### Emergency Hotfix

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/1.0.1-critical-bug

# Fix and commit
git add .
git commit -m "fix(critical): resolve payment crash"

# Merge to main
git checkout main
git merge --no-ff hotfix/1.0.1-critical-bug
git tag -a v1.0.1 -m "Version 1.0.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/1.0.1-critical-bug
git push origin develop

# Delete hotfix branch
git branch -d hotfix/1.0.1-critical-bug
git push origin --delete hotfix/1.0.1-critical-bug
```

### Release Process

```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Update version in package.json
# Update CHANGELOG.md
git add .
git commit -m "chore(release): prepare v1.0.0"

# Final testing and bug fixes
# ...

# Merge to main
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/1.0.0
git push origin develop

# Delete release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

---

## Versioning Strategy

Sử dụng **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

### Format: `v1.2.3`

- **MAJOR (1):** Breaking changes
  - API không tương thích ngược
  - Database schema changes
  - Example: `v1.0.0` → `v2.0.0`

- **MINOR (2):** New features (backward-compatible)
  - Thêm tính năng mới
  - Example: `v1.0.0` → `v1.1.0`

- **PATCH (3):** Bug fixes (backward-compatible)
  - Sửa bugs
  - Example: `v1.0.0` → `v1.0.1`

### Examples
```
v1.0.0 - Initial release
v1.0.1 - Bug fix: Payment gateway timeout
v1.1.0 - Feature: Add MoMo payment
v1.1.1 - Bug fix: Booking validation
v2.0.0 - Breaking: New API structure
```

### Pre-release versions
```
v1.0.0-alpha.1 - Alpha version
v1.0.0-beta.1  - Beta version
v1.0.0-rc.1    - Release candidate
```

---

## Protected Branches Configuration

### GitHub Settings

**For `main` branch:**
```yaml
Branch protection rules:
  - Require pull request reviews before merging: 2
  - Dismiss stale pull request approvals when new commits are pushed: true
  - Require review from Code Owners: true
  - Require status checks to pass before merging: true
    - build
    - test
    - lint
  - Require branches to be up to date before merging: true
  - Require linear history: false
  - Include administrators: true
  - Restrict who can push to matching branches: true
  - Allow force pushes: false
  - Allow deletions: false
```

**For `develop` branch:**
```yaml
Branch protection rules:
  - Require pull request reviews before merging: 1
  - Require status checks to pass before merging: true
    - build
    - test
    - lint
  - Require branches to be up to date before merging: true
  - Allow force pushes: false
  - Allow deletions: false
```

---

## CHANGELOG Maintenance

### Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- New features in development

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security patches

## [1.0.0] - 2024-01-15
### Added
- Initial release
- User authentication with JWT
- Booking system
- Payment integration (VNPay, MoMo)
- QR code ticket generation

### Fixed
- Payment timeout issue (#123)
- Seat selection bug (#456)
```

---

## Best Practices

### ✅ DO

1. **Commit often, commit early**
2. **Write descriptive commit messages**
3. **Keep commits atomic** (one logical change per commit)
4. **Review your own code before creating PR**
5. **Update documentation with code changes**
6. **Run tests before pushing**
7. **Use meaningful branch names**
8. **Rebase to keep history clean**
9. **Tag releases with semantic versions**
10. **Delete merged branches**

### ❌ DON'T

1. **Don't commit to main/develop directly**
2. **Don't force push to shared branches**
3. **Don't commit sensitive data (.env, credentials)**
4. **Don't create large PRs (>500 lines)**
5. **Don't merge without code review**
6. **Don't ignore merge conflicts**
7. **Don't use generic commit messages** ("fix bug", "update")
8. **Don't commit commented code**
9. **Don't commit node_modules or build files**
10. **Don't mix refactoring with features**

---

## Emergency Procedures

### 1. Revert Last Commit (Local)
```bash
git reset --hard HEAD~1
```

### 2. Revert Pushed Commit
```bash
# Create revert commit
git revert <commit-hash>
git push origin <branch>
```

### 3. Rollback Production
```bash
# Tag current state
git tag -a rollback-$(date +%Y%m%d-%H%M) -m "Rollback point"

# Checkout previous stable version
git checkout v1.0.0

# Create hotfix to restore
git checkout -b hotfix/rollback-to-v1.0.0
```

### 4. Fix Accidental Commit to Main
```bash
# Reset main to previous commit (if not pushed)
git checkout main
git reset --hard HEAD~1

# If already pushed, contact DevOps team
# DO NOT force push to main
```

---

## Tools & Integrations

### Recommended Git Tools
- **GitKraken / SourceTree:** GUI for Git
- **Git Lens (VSCode):** Enhanced Git integration
- **Conventional Commits (VSCode):** Commit message helper
- **Husky:** Git hooks automation
- **commitlint:** Validate commit messages
- **semantic-release:** Automate versioning

### GitHub Integrations
- **GitHub Actions:** CI/CD
- **Dependabot:** Dependency updates
- **CodeQL:** Security scanning
- **Codecov:** Code coverage reports

---

## Conclusion

Tuân thủ Git workflow giúp:
- ✅ **Code quality:** Review process bắt bugs sớm
- ✅ **Collaboration:** Nhiều developers làm việc hiệu quả
- ✅ **Traceability:** Biết ai làm gì, khi nào, tại sao
- ✅ **Rollback:** Dễ dàng quay lại version ổn định
- ✅ **Release management:** Deploy an toàn và có kiểm soát

**Remember:** Good commit messages = Documentation for future you! 📝
