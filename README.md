# Forecasting Rossmann Sales · ADS1002 Final Presentation

Interactive slides for the ADS1002 Applied Data Science group project (Monash University): **can historical sales data support a reliable four-week sales plan?** for the top 20% of Rossmann stores (223 of 1,115).

**Live site:** <https://zizi821.github.io/ADS1002-Final-Presentation/>

Presenters: Li Yiming, Lim Ying Yu, Tay Chen Zhe, Huang Qingyue and Yanyu Zhu.

## What you see

| Part | What happens on screen |
|---|---|
| Opening | A dark screen with one drugstore. Click it or press **→**: a 15-second film where the street lamp and the DROGERIE sign light up, the shutter rolls up, the shelves fill and the door sign flips to OPEN. The camera pulls back to 1,115 stores, the top 223 light up red, and they turn into the real weekly sales line (Jan 2013 to Jul 2015) with a question mark over 1–28 August. |
| Team walk-on | Five staff badges drop in. **→** lights up the team while everyone introduces themselves; the next **→** sweeps a shopping cart across the screen into slide 1. |
| Slides 1–10 | The same content as the group PowerPoint, with the interactive charts (weekday toggle, forecast windows, leakage check, July reveal, August scenario planner). |
| Chart animations | Each chart plays once when its slide opens, in the order it is discussed: the store histogram grows left to right and the 114-store bin pulses; the weekly sales line draws, the dashed complete-calendar line follows and the December peaks pop; the weekday toggle morphs every bar (Sunday flashes as it drops to 790 or rises to 10,322); the Customers scatter fills from few to many customers; the promotion bars grow one after the other; the eight models grow in rank order; the July reveal adds the red bars one by one, flashes the historical profile and slides in the table; the August calendar flips in day by day while the total counts up. |
| Presenter transitions | When the presenter changes, two panels in the next presenter's colour slam together with a flash, a screen shake, light rays and products bursting out; a giant number punches in and the name flies in letter by letter ("Next up · 02 · Lim Ying Yu"). It waits for **→**, then the panels split open onto their first slide. **←** cancels it. |
| Curtain call | After slide 10, **→** opens "Thank you" with the team, a QR code to this site and the opening music. **→** turns it to "Questions?", and **→** again goes back to the slides. |

## Presenting

- **→**, **Space**, **Page Down** or a clicker: next. **←** or **Page Up**: back.
- **S**: skip the opening. **I** or the **Opening** button: play the opening again.
- **M** or the **Music** button: music on or off. **K** (or a clicker's blank-screen key, **B** or **.**): pause the animation and music.
- **F**: full screen (the top toolbar hides; **Esc** leaves). Every slide is laid out at the same width and scaled by one shared factor so it fits the screen without scrolling (from about 1280×720 up); only slide 8 with the July results revealed shrinks a little more on small laptops. Phones scroll as usual.
- **N**: presenter notes. The **10:00** button starts a talk timer (about two minutes per presenter).
- The opening track can be chosen at the bottom left of the start screen.
- A link with `?nointro` or `#s-4` (any slide number) opens without the opening.
- Everything is local (fonts, scripts, music), so the page also works offline. Open it through a local web server, for example `python -m http.server`, and visit <http://localhost:8000>.

## Files

| Path | What it is |
|---|---|
| `index.html` | The 10 slides. |
| `app/deck.js` | Slide navigation, charts and interactive pieces. |
| `app/charts.js` | Chart animations (GSAP). |
| `app/stage.js` | Opening film, team walk-on, handover cards and curtain call (GSAP). |
| `app/music.js` | Opening music and the small sound effects. |
| `assets/deck.css`, `assets/stage.css` | Styles. |
| `assets/music/`, `assets/fonts/`, `assets/vendor/` | Music, fonts and third-party scripts (see Credits). |

## Data and scope

Data: the Rossmann training file supplied with the project brief (Kaggle *Rossmann Store Sales*). Sales are dataset units, not currency. August figures are conditional planning scenarios, not accuracy claims, and promotion differences are associations, not causal effects. Student IDs are left out of this public page.

## Credits

- **Music** (one is chosen on the start screen), all by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 (<https://creativecommons.org/licenses/by/4.0/>):
  - "Life of Riley"
  - "Funkorama"
  - "Carefree"
- **Sound effects**: made in the browser with the Web Audio API (no recorded files).
- **Animation**: GSAP 3.13 (<https://gsap.com>), used under its standard no-charge licence.
- **QR code**: qrcode-generator 1.4.4 by Kazuhiko Arase (MIT licence).
- **Fonts**: Newsreader and IBM Plex Sans (SIL Open Font Licence), via Fontsource.
- **Illustrations**: the drugstore, products, badges and cart are drawn in SVG for this project.
