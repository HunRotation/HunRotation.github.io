---
layout: project
title: "AImoclips: A Benchmark for Evaluating Emotion Conveyance in Text-to-Music Generation"
description: Gyehun Go, Satbyul Han, Ahyeon Choi, Eunjin Choi, Juhan Nam and Jeong Mi Park
img: assets/img/AImoclips/quadrant_analysis_scatter_plots.png
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
  max-width: 800px; /* Fixed width */
  position: relative;
  margin: auto;
  border: 1px solid #ddd; /* Added a border for better visibility */
}
.mySlides {
  display: none;
  text-align: center; /* Center the image */
}
.mySlides img {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
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
  background-color: rgba(0,0,0,0.3); /* a bit more transparent */
}
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.6);
}
.text {
  color: #333;
  font-size: 14px;
  padding: 15px;
  text-align: center;
  background-color: #f2f2f2;
}
</style>

<div class="slideshow-container">
  <div class="mySlides">
    <img src="/assets/img/AImoclips/model_averages_only.png">
    <div class="text">Mean valence and arousal deviations for each Text-to-Music (TTM) system, averaging (clip ratings - corresponding emotion intent scores) across all emotion intents.</div>
  </div>

  <div class="mySlides">
    <img src="/assets/img/AImoclips/quadrant_mean_comparison_plot.png">
    <div class="text">Mean valence and arousal deviations for each valence-arousal quadrant, averaging (clip ratings - corresponding emotion intent scores) across all TTM systems.</div>
  </div>

  <div class="mySlides">
    <img src="/assets/img/AImoclips/quadrant_analysis_scatter_plots.png">
    <div class="text">Valence–arousal quadrant distributions for each TTM system. Stars show mean ratings per quadrant, ’X’ marks represent ground truth scores of emotion intents, and ellipses indicate 95% confidence regions.</div>
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



{%- assign audio_files = site.static_files | where_exp: "item", "item.path contains '/assets/audio'" -%}
{%- assign aimoclips_samples = '' | split: '' -%}
{%- for audio_file in audio_files -%}
  {%- assign filename = audio_file.path | split: '/' | last -%}
  {%- assign parts = filename | remove: ".wav" | split: '_' -%}
  {%- assign model = parts[0] -%}
  {%- assign emotion = parts[1] -%}
  {%- assign file_index = parts[2] | plus: 0 -%}

  {%- for row in site.data.clips_metadata -%}
    {%- if row.model == model and row.emotion == emotion and row.file_index == file_index -%}
      {%- assign sample = row -%}
      {%- assign sample_with_source = sample | merge: {'music_source': audio_file.path} -%}
      {%- assign aimoclips_samples = aimoclips_samples | push: sample_with_source -%}
      {%- break -%}
    {%- endif -%}
  {%- endfor -%}
{%- endfor -%}
<table class="table table-sm table-borderless">
<thead>
<tr>
<th scope="col">Music Source</th>
<th scope="col">TTM System</th>
<th scope="col">Emotion Intent</th>
<th scope="col">Rated Mean Valence</th>
<th scope="col">Rated Mean Arousal</th>
</tr>
</thead>
<tbody>
{% for sample in aimoclips_samples %}
<tr>
<td><audio controls><source src="{{ sample.music_source | relative_url }}" type="audio/wav"></audio></td>
<td>{{ sample.model }}</td>
<td>{{ sample.emotion }}</td>
<td>{{ sample.valence }}</td>
<td>{{ sample.arousal }}</td>
</tr>
{% endfor %}
</tbody>
</table>
</div>



---

## BibTeX