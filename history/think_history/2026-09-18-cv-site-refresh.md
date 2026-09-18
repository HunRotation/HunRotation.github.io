# CV-to-Site Refresh - Orchestration Notes

Last-Edited-By-Personality: Evidence-First Curator

## Intake

`clarify` found the content scope explicit: the supplied PDF is the current source of truth and all site tabs are in scope. `grill-me` identified Git authorization, unrelated dirty state, and the protected target branch as the only material unresolved execution boundary after the user added commit-and-push.

## Skill and Personality Decision

- Skill-definer selected PDF inspection plus the Superpowers plan/worktree/review route; formal TDD is unnecessary unless behavioral code changes emerge.
- Personality-definer selected **Evidence-First Curator** over Technical Biographer and Release Editor because the core task is exact cross-surface factual reconciliation.
- No design interview is needed unless the audit uncovers facts that cannot fit the current information architecture.

## Execution Boundaries

- Main orchestrator owns this task/think record and final synthesis only.
- Factual auditor may read the PDF and site but may not edit or inspect history.
- Implementer will receive exact file scopes and a discrepancy matrix only after authorization/workspace preparation is resolved.
- Code reviewer will be read-only, must not inspect history, and will verify factual coverage, build output, navigation, and visual consistency.

## Audit Result

The latest CV differs from site sources in four coupled areas: public profile copy/configuration, structured resume data, CV section rendering, and generated-output verification. Required content includes the new audio-language-model research framing, KAIST GPA, Kwanjeong scholarship, updated language proficiency, and current UMATO title. The existing PDF link is already correct. News and Project cards are potential tab enrichments, but they are not necessary to correct a contradiction unless implementation inspection finds established conventions that make them expected.

## Cross-Tab Resolution

- **About/Bio:** required copy, keyword, and contact-email changes.
- **CV:** required JSON data and section-rendering changes; active data source is `assets/json/resume.json`.
- **Publications:** no missing works; optionally normalize AVS venue wording.
- **Projects:** preserve current selected cards because they remain valid and the CV does not provide sufficient source material for a complete set of new cards.
- **News:** add UMATO (Dec. 2025) and Album Arts presentation (Jan. 2026) because News is surfaced on About and currently stops in Sep. 2025.
- **Links/contact:** `_config.yml` contains the only stale email; existing socials are current.

The factual and cross-tab planning phases are complete. The sole remaining pre-implementation dependency is the user's explicit standing Git authorization and direct-main push approval.

## Blocked Audit

The same authorization condition was revalidated on three consecutive goal turns. On the final check, `authorized_repos.md` still listed only `my-codex-harness`; the current repository remained on dirty `main` with the user-supplied CV modification, the unrelated SonicMetro lock-file deletion, and required history records. No safe additional implementation step remains because repository policy requires authorization, a safe refreshed main state, and isolated implementation setup before an Implementer edits files. The goal is therefore marked blocked pending explicit standing authorization and direct-main push confirmation.

## Authorization Resume and Baseline

The user granted the exact requested standing authorization on 2026-09-18. The canonical registry now includes the repository path and normalized origin. A fresh `git fetch` confirmed local `main` equals `origin/main`; `git pull --ff-only origin main` was a no-op. An isolated worktree/branch was created without touching the original checkout's unrelated deletion.

Baseline debugging followed `superpowers:systematic-debugging`:

1. `/usr/bin/bundle` failed because system Ruby 2.6 exposes Bundler 1.17.2 while the lockfile requires 2.6.9.
2. Existing `rbenv` Ruby 3.3.0 supplies Bundler 2.6.9 and passes `bundle check`, so no Ruby installation is needed.
3. With that runtime, Jekyll proceeds through asset generation and then fails converting `assets/jupyter/blog.ipynb` because the `jupyter` executable is absent.
4. Node/Prettier dependencies are also absent locally.

This is a pre-existing environment baseline limitation, not a repository-code regression. Installing Jupyter and Node dependencies requires separate explicit authority under repository policy, so implementation is paused for that narrow decision.

The user authorized those dependency installations. Jupyter was installed only in `/private/tmp/hunrotation-cv-site-refresh.iCz0m7/jupyter-env`, and `npm ci` populated only the isolated worktree. With the task-local Jupyter path and existing rbenv Ruby, the full baseline Jekyll build passed. Repository-wide Prettier still reports 17 pre-existing failures confined to unrelated SonicMetro/MyLittleGarden/template files; the implementation gate is therefore targeted Prettier over changed files plus a full post-change Jekyll build.

## Implementation and Review Outcome

The Implementer completed the scoped data/content/template changes and removed all scratch artifacts. Fresh specification review passed every requirement. The paired code reviewer found one P1 issue: month-only News used `display_date` on list pages but individual post pages exposed the technical sort day. The Implementer added a backwards-compatible `page.display_date` branch in `_layouts/post.liquid`; re-review confirmed new News pages show only month/year while legacy posts retain full dates.

Final verification passed: JSON/YAML/BibTeX parsing, targeted Prettier for changed parseable files, `git diff --check`, full Jekyll build, generated HTML assertions, and desktop browser inspection of About, CV, Publications, Projects, and News. No CSS or responsive-layout source was changed. The original checkout's unrelated SonicMetro deletion remained untouched throughout.

## Claim-Support Cross-Reference

See `history/task_history/2026-09-18-cv-site-refresh.md` for the full evidence/inference records supporting the current design-preservation assumption and Git blocker conclusion.
