# Workflow handoff

- Canonical handoff: https://github.com/pyw31337/macmini-workflow-handoff
- Read the canonical `AGENTS.md` and latest workflow inventory before changing the landing page, extension packaging, Pages deployment, or release assets.
- Keep extension source files and release ZIPs reproducible; never commit secret values, `.env` files, tokens, cookies, or machine-specific paths.

## Release note · v1.5.0

- Source: `pyw31337/pick`, branch `main`; no GitHub Actions workflow or schedule changed.
- Packaging now produces `assets/lets-pick-v1.5.0.zip` from the repository source, excluding `.git`, prior ZIPs, and local files.
- Rollback: reload the prior version ZIP from `assets/lets-pick-v1.4.13.zip` in `chrome://extensions`.
