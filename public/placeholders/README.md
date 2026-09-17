# Placeholder images

These twelve SVGs (`dog-1.svg` to `dog-6.svg`, `cat-1.svg` to `cat-6.svg`) stand in for animal photos until real ones are imported from PetRescue or uploaded in the Studio. The mock adapter (`src/lib/mock/animals.ts`) cycles through them and labels each with alt text that says it is a placeholder, so nobody mistakes one for a photo of the animal.

Each is 1200 x 900, a soft two-stop gradient drawn from the site's warm neutrals (`#f4f0ec`, `#faf8f6`, `#f9dcda`, `#fdf0ef`, `#e5e0dd`) with a paw-print silhouette in `#b3b0ae` at 35% opacity, placed off-centre. No text, so nothing to translate or read aloud beyond the `<title>`.

Delete the directory once every listing has a real photo. Nothing outside the mock data refers to these files.
