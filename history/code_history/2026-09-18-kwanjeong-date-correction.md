# Kwanjeong Scholarship Date Correction

- Last-Edited-By-Personality: Evidence-First Curator
- Date: 2026-09-18
- Scope: Update the Kwanjeong Foundation Domestic Scholarship date to match the replacement CV.

## Changed files

- `assets/pdf/Gyehun_Go_CV.pdf`: replaced the committed PDF with the user-provided replacement PDF.
- `assets/json/resume.json`: changed only the Kwanjeong scholarship `startDate` from `2024-08-01` to `2026-05-01` and `endDate` from `2025-07-01` to `2027-08-01`.
- `_data/cv.yml`: changed only the Kwanjeong scholarship display date from `Aug. 2024 - Jul. 2025` to `May. 2026 - Aug. 2027`.

## Rationale

The replacement CV is the authoritative current source supplied by the user and records `Kwanjeong Foundation Domestic Scholarship — May. 2026 - Aug. 2027`. The Sinyang Cultural Foundation Scholarship remains `Aug. 2024 - Jul. 2025` in both structured and display data.

## Novel-idea-support mapping

- Evidence: replacement `assets/pdf/Gyehun_Go_CV.pdf` supplied by the user; it supports the updated Kwanjeong dates.
- Cross-check: current `assets/json/resume.json` and `_data/cv.yml`; both contained the stale Kwanjeong dates and independently preserved the Sinyang dates.
- Inference and limitation: only the explicitly requested Kwanjeong date fields were changed; no other CV facts were inferred or modified.

## Validation

- Replacement PDF checksum compared with the supplied source.
- JSON and YAML parsed successfully.
- Targeted Prettier check passed.
- `git diff --check` passed.
- Full Jekyll build passed.
- Generated CV output contains `2026.05 - 2027.08` for Kwanjeong and retains `2024.08 - 2025.07` for Sinyang.
- Final diff review confirmed no scratch or generated files were added.
