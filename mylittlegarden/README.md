Introduction to Culture Technology (GCT501)

HW2. Generative AI x Me

Gyehun Go (20254122)

[My work is available here](https://hunrotation.github.io/mylittlegarden/)

---
# The Significance of This Project

This website is the realization of a personal sanctuary, a space once confined to my imagination, now brought to life through the power of AI. It began as a garden that existed only in my mind, and with the assistance of the internet and artificial intelligence, I have endeavored to create a tangible, audiovisual representation of it. As this is a space designed exclusively for me, its atmosphere, objects, and available interactions are all tailored to my personality and preferences. Consequently, the implemented environment itself serves as an expression of who I am. I hope that all who visit this space can leisurely appreciate my personal sanctuary with their eyes, ears, and heart, accompanied by music. **All website-related code was developed with the assistance of the AI code generation tool, 'Gemini Code Assist'.**

As a researcher dedicated to enhancing the musical experiences of others, and as an individual who enjoys listening to serene background music, it is only natural that this small garden is perpetually filled with the kind of music I love. I envision a future where I reside in this garden, a time when my research has become a valuable and integrated part of many people's lives. In that future, I will absorb the ambiance of this place with a sense of quiet fulfillment.

My appreciation for nature, particularly forests and ponds, has also deeply influenced the design of my garden. I have adorned it with natural elements that resonate with me, and the small house I will inhabit is designed to complement this verdant tranquility.

# Website Description

## Main Page (Garden Overview)

Upon accessing the [website](https://www.google.com/search?q=http://hunrotation.github.io/mylittlegarden/), the visitor is first greeted with a panoramic view from the garden's entrance. To the left stands a cozy wooden house; in the center, a table with a parasol and a speaker; and to the right, a small pond with a fountain, surrounded by blooming flowers. Interactive buttons labeled 'Home', 'Table', and 'Pond' correspond to these locations, allowing users to explore each area in greater detail. **All images used on this website, including the main scenic view, were generated using Google Gemini 2.5 Flash (Nano Banana).**

## Pond Scenery Video

This video simulates the perspective of someone peacefully gazing at the fountain in the pond. **An image depicting a closer view of the pond was first generated using Nano Banana and then animated into a moving landscape with Veo 3**. The prompt used for this generation was as follows:

```
Can you make a short video of the fountain and a pond? The sound of the fountain is heard throughout the video, and an ambient sound of a forest is heard from faraway, along with a small bird chirping.
```

To prevent browsers from automatically blocking playback, the video is initially muted. The user can unmute it via the controls at the bottom of the player. In the event of a video loading failure, the 'Back' button in the upper-right corner allows for a return to the main page.

## Speaker on the Table

By interacting with the speaker on the table, visitors can change the background music playing throughout the garden. Specifically, four buttons in the center of the screen—'Morning', 'Midday', 'Evening', and 'Night'—allow the user to select and play music appropriate for that time of day. The chosen BGM will play continuously and loop without interruption while navigating the garden. The background image of the music selection page also changes to match the selected time. **All background music tracks were generated using the Suno v3.5 music generation model.**

## Home

Clicking the 'Home' button on the main page triggers an animation of entering the house, after which the scene transitions to the interior. **This animation was also created with Veo 3**, using the following prompt:

```
Can you generate a first-person view video? Starting from the given scene, the viewer walks along the stone path, gets closer to the wooden house seen on the left side, then opens the door of it. While walking, a walking sound (on a stone path) is heard, with a small sound of a fountain from faraway. When opening a door, a bell hanged on top of the door rings clearly (in high pitch).
```

Similar to the pond video, this animation is muted by default. Sound can be enabled using the player controls. A 'Skip' button is provided in the upper-right corner for users who wish to bypass the animation or in case of loading issues. The interior of the house features a different BGM from the garden. **The default track is a calm, looping jazz piece, also generated with Suno v3.5.**

## Diary

The first entry in the diary is an imaginative reflection on the emotions I anticipate feeling in a future where I have completed my garden and settled into a life as a researcher. Visitors can also contribute their own entries. When a new entry is saved, the BGM inside the house dynamically changes to a newly generated piece of music that reflects the emotional tone and atmosphere of the text. **This real-time music generation is powered by the Elevenlabs Eleven Music API.**