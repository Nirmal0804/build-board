# Contributing to BuildBoard

Thank you for your interest in contributing to **BuildBoard**! We welcome contributions from developers of all experience levels, especially first-time open-source contributors.

---

## Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the community standards we expect.

---

## Finding an Issue to Work On

If you are new to the project, start by looking for issues labeled:

* [`good first issue`](docs/good-first-issues.md) — Tasks designed with clear boundaries and minimal prerequisites.
* `help wanted` — Open tasks ready for community implementation.

> **Important**: Before starting work on any issue, please leave a comment on the issue asking to be assigned (e.g., *"I'd like to work on this issue!"*). This prevents multiple developers from duplicating effort on the same task.

---

## Contribution Workflow

Follow these 10 steps to make your contribution:

### 1. Fork the Repository
Click the **Fork** button at the top right of the [BuildBoard GitHub repository](https://github.com/buildboard/buildboard) to create your personal copy.

### 2. Clone Your Fork
Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/buildboard.git
cd buildboard
```

Add the upstream remote:

```bash
git remote add upstream https://github.com/buildboard/buildboard.git
```

### 3. Install Dependencies
Install all project dependencies from the repository root:

```bash
npm install
```

### 4. Create a Feature Branch
Create a new branch from `main` using our branch naming convention:

```bash
git checkout -b <branch-type>/<short-description>
```

**Branch naming prefixes:**
- `feature/<name>` — New user-facing features or components
- `fix/<name>` — Bug fixes or broken behavior corrections
- `docs/<name>` — Documentation additions or improvements
- `test/<name>` — New test suites or expanded coverage
- `refactor/<name>` — Code cleanup without behavior changes

*Example:*
```bash
git checkout -b fix/category-badge-colors
```

### 5. Make Your Changes
Write clean, readable code. Follow existing patterns and consult [docs/development.md](docs/development.md) for local setup instructions.

### 6. Run Tests
Verify that all unit and integration tests pass:

```bash
npm test
```

### 7. Run Linter
Ensure your code adheres to our formatting and linting rules:

```bash
npm run lint
```

### 8. Commit Your Changes
Use concise conventional commit messages:

**Commit message prefixes:**
- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation changes
- `test:` — Adding or modifying tests
- `refactor:` — Code refactoring

*Example:*
```bash
git commit -m "fix: resolve badge color contrast on dark backgrounds"
```

### 9. Push to Your Fork
Push your branch to your GitHub fork:

```bash
git push -u origin <your-branch-name>
```

### 10. Open a Pull Request
1. Navigate to your fork on GitHub.
2. Click the **Compare & pull request** button.
3. Fill out the pull request template with a clear description of your changes and reference the issue number (e.g. `Fixes #14`).
4. Maintainers will review your PR, provide constructive feedback, and merge it!

---

## Community Questions?

If you have questions or get stuck, feel free to open a Discussion on GitHub or reach out to maintainers. We are here to help you learn and succeed!
