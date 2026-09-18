# Kwanjeong Scholarship Date Correction

Last-Edited-By-Personality: Evidence-First Curator

## Objective

Synchronize the Kwanjeong Foundation Domestic Scholarship dates from the newly replaced CV into every relevant active and fallback website source, preserve the existing design and unrelated work, verify the generated CV page, and deliver one reviewed commit to the authorized remote.

## Confirmed Scope

- Authoritative date supplied by the user: May 2026-August 2027.
- The newly replaced `assets/pdf/Gyehun_Go_CV.pdf` is the factual source.
- Update all site occurrences of this scholarship date and include the updated PDF.
- Preserve the unrelated `sonicmetro/.claude/scheduled_tasks.lock` deletion and all other unrelated local changes.
- Standing non-destructive Git and scoped direct-`origin/main` push authorization remain active for this repository.

## Live Plan

1. **Complete - factual delta audit:** all three replacement PDF pages were inspected; the only factual delta is Kwanjeong `May. 2026 - Aug. 2027`.
2. **Complete - isolated lane and baseline:** a fresh worktree was created from `origin/main` at `e5c7501`; the full Jekyll baseline passed.
3. **Complete - implementation:** replacement PDF copied; Kwanjeong active JSON and fallback YAML dates corrected; code history added; Sinyang preserved.
4. **Complete - review and verification:** independent review approved the exact PDF/JSON/YAML diff; syntax, targeted formatting, full build, diff, checksum, and generated-CV assertions pass.
5. **Complete on delivery of this record:** create exactly one scoped commit and push the reviewed fast-forward to `origin/main`; this record is included in that delivery.

## Skill and Personality Decision

- Skills: `clarify`, `grill-me`, `novel-idea-support`, `pdf:pdf`, `superpowers:using-superpowers`, `superpowers:using-git-worktrees`, and `superpowers:requesting-code-review`.
- Skipped brainstorming and formal TDD because the requested factual correction is precise and carries no design choice or behavioral change.
- Personality: **Evidence-First Curator**, reused for source-faithful, minimally invasive reconciliation.

## Claim-Support Log

Claim: the change must be isolated from the original checkout rather than applied in place.

1. Reason: the original checkout contains an explicitly protected unrelated deletion.
   Material: `git status --short --branch` in `/Users/kojiy/Library/CloudStorage/OneDrive-Personal/HunMac/HunRotation.github.io` (2026-09-18).
   Evidence: `sonicmetro/.claude/scheduled_tasks.lock` is deleted and the user previously required it to remain untouched.
   Inference: an isolated worktree prevents the scholarship correction from staging or altering that deletion.
2. Reason: the original checkout is one commit behind the authoritative remote while the existing clean lane matches `origin/main` exactly.
   Material: `git rev-parse` and `git rev-list --left-right --count` outputs after `git fetch origin main` (2026-09-18).
   Evidence: `origin/main` and the clean lane both resolve to `e5c7501ad91b07c237d67ef0fa5bf4d38274fa3d`; the original checkout remains at `50eaf9f...`.
   Inference: branching from refreshed `origin/main` avoids replaying stale or dirty local state.

Limitations: generated `_site` copies are verification outputs only and must not be committed.
Disposition: retained.

Claim: the implemented correction is complete and does not alter any other scholarship or profile fact.

1. Reason: the replacement PDF contains exactly one factual delta from the committed PDF.
   Material: rendered and extracted comparison of all three pages of `assets/pdf/Gyehun_Go_CV.pdf` against commit `e5c7501` (2026-09-18).
   Evidence: only Kwanjeong changed, to `May. 2026 - Aug. 2027`; every other extracted CV fact is identical.
   Inference: a replacement PDF plus the two confirmed Kwanjeong source fields is sufficient and appropriately scoped.
2. Reason: active, fallback, and generated CV representations agree after implementation.
   Material: `assets/json/resume.json`, `_data/cv.yml`, and generated `_site/cv/index.html` in the isolated lane (2026-09-18).
   Evidence: JSON is `2026-05-01` to `2027-08-01`, YAML is `May. 2026 - Aug. 2027`, and generated HTML renders `2026.05 - 2027.08`; Sinyang remains `2024.08 - 2025.07` in source and output.
   Inference: the webpage and fallback source now consistently reflect the authoritative correction without cross-entry contamination.
3. Reason: independent validation found no unrelated or generated-file change.
   Material: final reviewer report plus full Jekyll build, targeted Prettier, JSON/YAML parsing, PDF SHA-256 comparison, and `git diff --check` (2026-09-18).
   Evidence: all checks passed; the reviewer approved exactly the replacement PDF, two date fields, and required history.
   Inference: the correction is buildable, source-faithful, and ready for scoped delivery.

Limitations: no layout/CSS code changed; visual inspection is limited to the affected generated CV section because other pages are unchanged.
Disposition: retained.

## Status

The correction and independent review are complete in `/private/tmp/hunrotation-kwanjeong-date.GtIkaN/content`. The exact source PDF, active/fallback dates, generated CV rendering, and unchanged Sinyang dates are verified. The remaining terminal action is the already-authorized single commit and direct `origin/main` push; the original checkout remains untouched.
