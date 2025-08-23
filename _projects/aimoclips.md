---
layout: project
title: "AImoclips: A Benchmark for Evaluating Emotion Conveyance in Text-to-Music Generation"
description: A comprehensive benchmark for evaluating how well text-to-music (TTM) generation systems convey intended emotions to human listeners.
img: assets/img/aimoclips.jpg # Add a preview image to this path
importance: 1
category: work
---

## Abstract

Recent advances in text-to-music (TTM) generation have enabled controllable and expressive music creation using natural language prompts. However, the emotional fidelity of TTM systems remains largely underexplored compared to human preference or text alignment. In this study, we introduce **AImoclips**, a benchmark for evaluating how well TTM systems convey intended emotions to human listeners, covering both open-source and commercial models. We selected 12 emotion intents spanning four quadrants of the valence-arousal space, and used six state-of-the-art TTM systems to generate over 1,000 music clips. A total of 111 participants rated the perceived valence and arousal of each clip on a 9-point Likert scale. Our results show that commercial systems tend to produce music perceived as more pleasant than intended, while open-source systems tend to perform the opposite. Emotions are more accurately conveyed under high-arousal conditions across all models. Additionally, all systems exhibit a bias toward emotional neutrality, highlighting a key limitation in affective controllability. This benchmark offers valuable insights into model-specific emotion rendering characteristics and supports future development of emotionally aligned TTM systems.

<div class="buttons" style="text-align: center; margin: 2rem 0;">
    <a href="https://arxiv.org/abs/YOUR_PAPER_ID" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-solid fa-file-lines" style="margin-right: 0.5rem;"></i>Paper</a>
    <a href="https://github.com/HunRotation/AImoclips" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-brands fa-github" style="margin-right: 0.5rem;"></i>Dataset</a>
</div>

---

## Sample Questionnaire

*This section is a placeholder for the sample questionnaire used in your study.*

---

## Examples

| Music Source | TTM System | Emotion Intent | Rated Mean Valence | Rated Mean Arousal |
| :----------- | :--------- | :------------- | :----------------- | :----------------- |
| Example 1    | MusicGen   | Happy          | 0.8                | 0.7                |
| Example 2    | Riffusion  | Sad            | -0.6               | -0.5               |
| Example 3    | Mubert     | Energetic      | 0.5                | 0.9                |
| Example 4    | MusicGen   | Calm           | 0.2                | -0.8               |