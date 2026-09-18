// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-received-the-best-poster-award-at-ksmpc-2025-for-can-emotion-concepts-be-reflected-well-in-text-to-music-generation-models",
          title: 'Received the Best Poster Award at KSMPC 2025 for “Can Emotion Concepts be...',
          description: "",
          section: "News",},{id: "news-my-first-paper-aimoclips-is-accepted-to-hcmir25",
          title: 'My first paper AImoclips is accepted to HCMIR25!',
          description: "",
          section: "News",},{id: "news-starting-my-m-s-at-kaist-ct-maclab",
          title: 'Starting my M.S. at KAIST CT, MACLab!',
          description: "",
          section: "News",},{id: "news-our-paper-umato-was-published-in-ieee-transactions-on-visualization-amp-amp-computer-graphics",
          title: 'Our paper UMATO was published in IEEE Transactions on Visualization &amp;amp;amp; Computer Graphics....',
          description: "",
          section: "News",},{id: "news-presented-the-influence-of-album-arts-on-the-perception-of-musical-emotion-at-the-63th-conference-of-korean-society-for-cognitive-and-biological-psychology",
          title: 'Presented “The Influence of Album Arts on the Perception of Musical Emotion” at...',
          description: "",
          section: "News",},{id: "projects-aimoclips-a-benchmark-for-evaluating-emotion-conveyance-in-text-to-music-generation",
          title: 'AImoclips: A Benchmark for Evaluating Emotion Conveyance in Text-to-Music Generation',
          description: "Gyehun Go, Satbyul Han, Ahyeon Choi, Eunjin Choi, Juhan Nam and Jeong Mi Park",
          section: "Projects",handler: () => {
              window.location.href = "/projects/aimoclips.html";
            },},{id: "projects-sonicmetro-an-audible-subway-map-powered-by-webchuck",
          title: 'SonicMetro: An Audible Subway Map Powered by WebChucK',
          description: "Gyehun Go",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sonicmetro.html";
            },},{
        id: 'social-address',
        title: 'Address',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%72%6F%74%61%74%69%6F%6E@%6B%61%69%73%74.%61%63.%6B%72", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/HunRotation", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/gyehun-go-5b190b353", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
