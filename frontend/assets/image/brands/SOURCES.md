# Materials & Brands logos

Hofmann, Sheffer, and ENDOW logos were downloaded from the companies' official
websites on 2026-11-05. Their original PNGs are kept here; lossless WebP copies
(maximum 432px wide, no upscaling) are served from
`frontend/static/images/brands/`. These three logos were not generated or redrawn.
No standalone official SVG was exposed by these pages. Alumetal uses the
user-supplied image and edited derivative documented below.

| Brand | Official page | Original asset |
| --- | --- | --- |
| هافمن / Hofmann | https://hofmannprofile.com/ | https://hofmannprofile.com/images/logo1.png |
| شفر / Sheffer | https://shefferprofile.com/ | https://shefferprofile.com/wp-content/uploads/2024/01/sheffer-logo.png |
| ENDOW / اندو | https://endoow.com/ (redirected from https://www.endow.com.tr/) | https://endoow.com/wp-content/uploads/2025/06/endow-logo.png |

- Hofmann: the official Persian page and header wordmark identify the UPVC
  manufacturer as «هافمن». Searches did not verify «هافن» as an alternative name
  for this company. The implementation follows the task's explicit «هافمن»;
  it does not claim the two names are interchangeable.
- Sheffer: the official site identifies itself as a UPVC and aluminium profile
  manufacturer and uses this exact logo in its header.
- ENDOW: the official site identifies its products as PVC door and window
  accessories. Its white/cyan wordmark needs the navy backing used in the
  template; the asset's original colors and transparency are preserved.
- آلومتال: the user supplied `images.jpeg` on 2026-11-05 and requested removing
  the wordmark below the symbol, improving image quality, and replacing the text
  fallback. The original is preserved as `alumetal-original.jpeg` (498 × 241).
  The built-in ImageGen tool produced `alumetal-logo.png` (1942 × 809) with a
  transparent background and no lettering; this is an AI-restored derivative,
  not an independently verified official vector asset. The website serves a
  lossless 432 × 180 WebP copy, with the shared logo sizing rules.
  See `alumetal-edit-prompt.txt` for the exact edit prompt.
