# Unique Solutions — website

Static site built from the company profile PDF (*Unique Solutions Corrected Mail id.pdf*).
No build step, no dependencies — open `index.html` or upload the folder to any host.

## Pages

| File | What's on it |
|---|---|
| `index.html` | Hero image slider (6 slides), the 16-system grid, stats, why-us, brand marquee, service network, CTA |
| `solutions.html` | Full detail for all 16 systems, with a jump-link bar |
| `about.html` | History, vision, mission, company goals, coverage |
| `portfolio.html` | Client list, government and election projects, brand logos |
| `contact.html` | Enquiry form with validation, direct contact details, how a job runs |

### One page per system

Every tile on the home page grid opens that system's own page. Sixteen of them:

| System | File |
|---|---|
| CCTV cameras | `cctv-cameras.html` |
| Access control | `access-control.html` |
| Attendance | `attendance-systems.html` |
| Fire detection | `fire-detection.html` |
| Fire suppression | `fire-suppression.html` |
| Nurse call | `nurse-call.html` |
| Public address | `public-address.html` |
| Telecom & intercom | `telecom-intercom.html` |
| Network & cabling | `network-cabling.html` |
| Interactive panels | `interactive-panels.html` |
| Digital podium | `digital-podium.html` |
| Computers & printers | `computers-printers.html` |
| GPS tracking | `gps-tracking.html` |
| Air curtains | `air-curtains.html` |
| Home automation | `home-automation.html` |
| Solar power | `solar-power.html` |

Each one carries the same blocks in the same order: navy page head with breadcrumb,
the `entry` detail (rail colour, trade label, photo, "want this on your site?" box,
then the spec columns), a prev/next pager plus links to the other fifteen, and a CTA.

`solutions.html` keeps all sixteen on one long scroll as the overview, and each entry
there ends with a `entry__more` link across to its own page. **If you edit a system's
copy, edit it in both places** — the two are separate HTML now.

## The slider

Lives on the home page (`<section class="hero" data-slider>`), driven by `assets/js/site.js`.

- Auto-advances every 6.5 s; pauses on hover, on keyboard focus and when the tab is hidden
- Prev / next buttons, a play-pause toggle, clickable dots, arrow keys and touch swipe
- Honours `prefers-reduced-motion` (no autoplay, no image drift)
- All slides share one CSS grid cell, so the hero never jumps height between slides

**To change a slide:** edit the `<article class="hero__slide">` block — swap the `<img src>`,
the `hero__trade` label, the heading, the `hero__lede` and the button. `data-rail` picks the
accent colour (`watch`, `safety`, `comms`, `power`).

**To add or remove a slide:** add/remove one `<article class="hero__slide">` *and* one
`<button class="hero__dot">` in `.hero__dots`. The script counts them itself.

## The colour rails

Each of the 16 systems carries a coloured rail that says which trade it belongs to:

| Rail | Colour | Trade |
|---|---|---|
| `watch` | cyan | Surveillance & entry |
| `safety` | red | Life safety |
| `comms` | blue | Communication & AV |
| `power` | amber | Power, comfort & IT |

Set with `data-rail="…"` on `.tile`, `.entry` and `.hero__slide`.

## The contact form

There is no server, so submitting opens the visitor's mail app pre-filled to
`sales@uniquesolutionstech.in`. Validation runs first and marks any field that needs fixing.

To post it to a real backend instead, replace the `window.location.href = 'mailto:…'` block
in `assets/js/site.js` with a `fetch()` to your endpoint.

## Editing contact details

Phone numbers, email and the website address appear in the masthead and footer of every page,
plus `contact.html`. Search and replace across all five HTML files:

- `+91 97862 19202` / `+919786219202`
- `+91 82482 75183` / `+918248275183`
- `sales@uniquesolutionstech.in`
- `www.uniquesolutionstech.in`

## Images

`assets/img/` — all extracted from the source PDF.

- `logo.jpg`, `mark.png` — wordmark and the US monogram (used as the favicon)
- `slide-*.jpg` — the six hero slides
- `tile-*.jpg` — the 16 product shots
- `clients-grid.jpg`, `brands-grid.jpg` — logo sheets on the portfolio page

Replace any of them with a file of the same name and the site picks it up.

## Fonts

Barlow Condensed (headings) and IBM Plex Sans (body), loaded from Google Fonts. If the site
must work offline, download both and swap the `<link>` in each page's `<head>` for a local
`@font-face` block.

## Previewing locally

```
npx http-server -p 8080 -c-1
```

then open http://127.0.0.1:8080
