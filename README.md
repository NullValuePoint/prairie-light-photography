# Prairie Light Photography

A fictional photographer portfolio site for "Elena Marsh", a Lincoln, Nebraska photographer. Built as a freelance portfolio piece to demonstrate artistic, motion-rich web design for photography-business clients.

## Concept

Dark, editorial, cinematic. Oversized Fraunces serif typography, warm amber accents on near-black, film-grain overlay, and scroll-driven motion throughout. Deliberately different in tone from clean corporate sites: this one sells *craft*.

## Stack

- Static HTML + CSS + vanilla JS (no build step)
- GSAP 3 + ScrollTrigger via CDN
- Google Fonts: Fraunces (display serif) + Inter (sans)
- Imagery: picsum.photos with fixed seeds (deterministic across loads)

## Sections & interactions

1. **Preloader** — percentage counter tied to real image preloading, curtain wipe reveal
2. **Hero** — oversized "Prairie Light" typography, portrait, staggered clip-path intro
3. **Selected Work** — alternating full-bleed images with scroll parallax drift, captions
4. **Field Notes** — pinned horizontal-scroll filmstrip gallery (native swipe on mobile)
5. **About** — bio, portrait, stat row
6. **Services** — three pricing tiers (portrait $350 / wedding from $2,400 / commercial from $950)
7. **Testimonials** — three fictional client quotes
8. **Contact CTA + footer** — fictional email/phone, plus a fictional-demo disclaimer

Extras: custom cursor (dot + trailing ring, scales on interactive targets), image hover zoom, click-to-open lightbox with keyboard navigation, animated film-grain overlay, marquee strip, `prefers-reduced-motion` support, fully responsive.

## Deploy

Static deploy to Netlify production (see `~/workspace/skills/netlify/SKILL.md`):

```
python3 ~/workspace/skills/netlify/bin/netlify_deploy.py prairie-light-photography ~/workspace/freelance-projects/photo-portfolio/
```

All people, prices, and testimonials are fictional. Photos via picsum.photos.
