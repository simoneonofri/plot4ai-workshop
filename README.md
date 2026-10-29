# PLOT4ai Card Browser

A simple image browser of the original PLOT4ai cards: thumbnails, click to enlarge, front/back toggle, zoom, previous/next, category filter and search by card name. Keyboard: left/right arrows to browse, F to flip, Escape to close. Responsive layout, no build step, no dependencies for running the site.

## Run

From this folder, run `npm start` (requires Python 3), then open <http://127.0.0.1:4173>. Serve over HTTP rather than opening index.html directly. No hosting is configured. The repository is private.

## Original artwork and attribution

All 138 cards (276 faces) are rasterized directly from `plot4ai-A6.pdf` in [PLOT4ai PDF release 43](https://github.com/PLOT4ai/plot4ai-library/releases/tag/pdf-release-43). Each A6 page already contains one complete card face; no artwork, text, footer or border is cut off. The first six pages contain introductory material and are not threat cards. Cards occupy pages 7–282 in front/back pairs.

Cards by [PLOT4ai and its contributors](https://plot4.ai/), licensed **CC BY-SA 4.0**; full license in `LICENSE`. This adaptation converts PDF pages into WebP images, generates thumbnails and adds navigation. Card artwork and wording are retained. This is an independent adaptation, with no endorsement implied. [LINDDUN GO Card Browser](https://downloads.linddun.org/linddun-go/cardbrowser/v241203/index.html) is the functional reference; no LINDDUN source or artwork is included.

`cards.json` records each card’s category, front/back images, original PDF page numbers and source PDF SHA-256. `deck.json` is the unchanged, machine-readable upstream deck at revision `5f4b43e36d372ab7160e4ada7f81b4848c42056f`. Full-size images are rendered at 3× PDF resolution (216 dpi); thumbnails are 260 pixels wide. The browser uses only local assets and makes no external requests unless a source link is followed. The earlier workshop/table UI has been replaced by this image browser; its source remains in Git history.

## Regenerate images

Download `plot4ai-A6.pdf` from release 43 into `tmp/pdf-browser/`. With Python, PyMuPDF and Pillow installed, run:

```sh
python3 scripts/extract_cards.py tmp/pdf-browser/plot4ai-A6.pdf
```

The extraction checks every front/back page against the corresponding card label before writing the manifest. The original PDF and verification renders stay locally in ignored `tmp/`. Generated card assets and the manifest are tracked.

Run `npm test` with Node 18+ for manifest, source-page mapping and image completeness checks. Test notes and screenshots are local only under `tmp/pdf-browser/`.
