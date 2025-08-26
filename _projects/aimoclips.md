---
layout: project
title: "AImoclips: A Benchmark for Evaluating Emotion Conveyance in Text-to-Music Generation"
description: Gyehun Go, Satbyul Han, Ahyeon Choi, Eunjin Choi, Juhan Nam and Jeong Mi Park
img: assets/img/aimoclips.jpg # Add a preview image to this path
importance: 1
category: work
project_key: go2025aimoclips
---

### Under Construction

<div class="buttons" style="text-align: center; margin: 2rem 0;">
    <a href="https://arxiv.org/abs/YOUR_PAPER_ID" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-solid fa-file-lines" style="margin-right: 0.5rem;"></i>Paper</a>
    <a href="https://github.com/HunRotation/AImoclips" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-brands fa-github" style="margin-right: 0.5rem;"></i>Dataset</a>
</div>

## Abstract

Recent advances in text-to-music (TTM) generation have enabled controllable and expressive music creation using natural language prompts. However, the emotional fidelity of TTM systems remains largely underexplored compared to human preference or text alignment. In this study, we introduce **AImoclips**, a benchmark for evaluating how well TTM systems convey intended emotions to human listeners, covering both open-source and commercial models. We selected 12 emotion intents spanning four quadrants of the valence-arousal space, and used six state-of-the-art TTM systems to generate over 1,000 music clips. A total of 111 participants rated the perceived valence and arousal of each clip on a 9-point Likert scale. Our results show that commercial systems tend to produce music perceived as more pleasant than intended, while open-source systems tend to perform the opposite. Emotions are more accurately conveyed under high-arousal conditions across all models. Additionally, all systems exhibit a bias toward emotional neutrality, highlighting a key limitation in affective controllability. This benchmark offers valuable insights into model-specific emotion rendering characteristics and supports future development of emotionally aligned TTM systems.

---

## Method



---

## Results

Our analysis reveals significant differences in emotional conveyance across various text-to-music models. **Commercial models generally skewed towards higher valence**, producing music that was perceived as more positive than intended, whereas open-source models tended to do the opposite. We observed that high-arousal emotions were more accurately conveyed across all systems. A consistent finding was a **systemic bias towards emotional neutrality**, indicating that current TTM models have difficulty rendering strong, unambiguous emotions. These results underscore the need for improved affective control in future text-to-music generation systems.

<style>
* {box-sizing: border-box;}
.slideshow-container {
  max-width: 1000px;
  position: relative;
  margin: auto;
}
.mySlides {
  display: none;
}
.prev, .next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
  background-color: rgba(0,0,0,0.5);
}
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.8);
}
.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
  background-color: rgba(0,0,0,0.5);
}
.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}
@-webkit-keyframes fade {
  from {opacity: .4}
  to {opacity: 1}
}
@keyframes fade {
  from {opacity: .4}
  to {opacity: 1}
}
</style>

<div class="slideshow-container">
  <div class="mySlides fade">
    <img src="/assets/img/AImoclips/model_averages_only.png" style="width:100%">
    <div class="text">Mean valence and arousal ratings for each Text-to-Music (TTM) system, averaged across all emotion intents. The origin (0,0) represents neutral valence and arousal. Error bars indicate 95% confidence intervals. This figure highlights model-specific biases in emotion rendering.</div>
  </div>

  <div class="mySlides fade">
    <img src="/assets/img/AImoclips/quadrant_analysis_scatter_plots.png" style="width:100%">
    <div class="text">Scatter plots of rated valence and arousal for each of the four emotional quadrants: High Arousal/High Valence (HAHV), High Arousal/Low Valence (HALV), Low Arousal/Low Valence (LALV), and Low Arousal/High Valence (LAHV). Each point represents a music clip, and ellipses denote 95% confidence intervals for each TTM system.</div>
  </div>

  <div class="mySlides fade">
    <img src="/assets/img/AImoclips/quadrant_mean_comparison_plot.png" style="width:100%">
    <div class="text">Comparison of intended versus rated mean valence and arousal for each TTM system across the four emotional quadrants. Arrows connect the intended emotional target (e.g., HAHV) to the actual perceived emotional output, illustrating the direction and magnitude of emotional distortion for each model.</div>
  </div>

  <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
  <a class="next" onclick="plusSlides(1)">&#10095;</a>
</div>

<script>
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}
</script>

---

## Examples

| Music Source | TTM System | Emotion Intent | Rated Mean Valence | Rated Mean Arousal |
| :----------- | :--------- | :------------- | :----------------- | :----------------- |
| Example 1    | MusicGen   | Happy          | 0.8                | 0.7                |
| Example 2    | Riffusion  | Sad            | -0.6               | -0.5               |
| Example 3    | Mubert     | Energetic      | 0.5                | 0.9                |
| Example 4    | MusicGen   | Calm           | 0.2                | -0.8               |

---

## BibTeX