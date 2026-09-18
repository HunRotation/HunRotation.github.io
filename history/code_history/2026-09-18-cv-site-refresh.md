---
Last-Edited-By-Personality: Evidence-First Curator
---

# CV-to-site refresh — 2026-09-18

## Scope

Updated the JSON-driven CV, About page, contact/research metadata, fallback CV data, publication metadata, News rendering, and News entries to match the user-provided `assets/pdf/Gyehun_Go_CV.pdf`. Copied the updated binary CV into `assets/pdf/Gyehun_Go_CV.pdf`. Existing design, navigation, social links, project pages, and unrelated content were preserved.

## Files changed

- `assets/pdf/Gyehun_Go_CV.pdf`
- `_pages/about.md`
- `_config.yml`
- `assets/json/resume.json`
- `_layouts/cv.liquid`
- `_includes/resume/scholarships.liquid`
- `_includes/resume/presentations.liquid`
- `_includes/news.liquid`
- `_data/cv.yml`
- `_bibliography/papers.bib`
- `_news/announcement_260100.md`
- `_news/announcement_251200.md`
- `_news/announcement_250200.md`

## Implementation rationale

The current CV source establishes: audio language models aligned with human thinking; reasoning for audio/speech/music understanding; personalized music perception; KAIST GPA 4.12/4.3; four scholarships including Kwanjeong; two presentations including the Best Poster Award; English TOEFL 5.5/6.0 (110/120); Japanese advanced/JLPT N1 (140/180); four research experiences; and the revised UMATO title. These facts are represented in the About page, JSON resume, fallback YAML, site hashtags, CV section allow-list, and rendered includes. AttentionX/additional experience was removed because it is absent from the current CV.

News entries use technical first-of-month sort dates only because Jekyll requires a date, and use explicit `display_date` month/year labels so no invented day is shown to visitors.

## Claim-support record

| Claim or decision                         | Evidence consulted                                                                                                  | Evidence vs. inference                                                                                          | Limitation/disposition                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Current profile framing and facts         | `assets/pdf/Gyehun_Go_CV.pdf`, pages 1–3 (rendered/OCR inspected)                                                   | Evidence: direct CV text and visual layout                                                                      | Used source wording; no unsupported facts added.                                |
| Existing navigation/rendering conventions | `_layouts/cv.liquid`, `_includes/resume/*.liquid`, `_layouts/about.liquid`, `_includes/news.liquid`, `_pages/cv.md` | Evidence: repository templates                                                                                  | New includes follow existing card/list/date conventions.                        |
| Active contact/social values              | `_data/socials.yml`, existing project sources                                                                       | Evidence: repository values; inference: preserve unchanged correct links                                        | Only stale `_config.yml` contact note was changed.                              |
| AVS venue and UMATO title normalization   | CV page 1 and `_bibliography/papers.bib`                                                                            | Evidence: direct CV and existing BibTeX entry                                                                   | Retained existing author/link data; changed only supported venue/title wording. |
| Month-only News display                   | CV page 1 dates and Jekyll News include behavior                                                                    | Evidence: source dates; inference: technical sort date plus display label is smallest compatible implementation | No exact day is presented.                                                      |

## Validation

Validation results:

- JSON syntax: passed with `node -e "JSON.parse(...)"`.
- YAML front matter/config syntax: passed with Ruby Psych for `_config.yml`, `_data/cv.yml`, and all three new News files.
- BibTeX syntax: passed with TeX Live `bibtex`; one existing non-fatal warning remains for the UMATO entry’s empty volume.
- Targeted Prettier: passed for every changed text/source file supported by the repository formatter. BibTeX is intentionally excluded because the installed Prettier has no parser for it.
- Exact Jekyll build: passed with `PATH=/private/tmp/hunrotation-cv-site-refresh.iCz0m7/jupyter-env/bin:$PATH RBENV_VERSION=3.3.0 rbenv exec bundle exec jekyll build`; only existing Sass/Jekyll deprecation warnings and the existing empty-slug warning were emitted.
- Generated HTML inspection: passed for `_site/index.html`, `_site/cv/index.html`, `_site/publications/index.html`, `_site/projects/index.html`, and `_site/news/index.html`; required new facts and month/year News labels are present, while stale Gmail, AttentionX, and Intermediate values are absent.
- Scoped diff review: passed with `git diff --check`; no generated `_site`, `node_modules`, or scratch files are tracked or included in the allowed change list.

## Limitations

The CV itself provides month/year precision for most dates; the site stores technical first-of-month sort values internally while displaying only month/year. The user’s PDF is treated as factual source data, not as instructions.
