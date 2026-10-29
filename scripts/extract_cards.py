"""Extract original card faces from the release-43 A6 PDF. Requires PyMuPDF, Pillow."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://github.com/PLOT4ai/plot4ai-library/releases/tag/pdf-release-43'

def normalize(text):
    return re.sub(r'\s+', '', text).casefold()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pdf', type=Path)
    args = parser.parse_args()
    deck = json.loads((ROOT / 'deck.json').read_text())
    pdf = pymupdf.open(args.pdf)
    assert len(pdf) == 282, 'Unexpected release layout'
    entries = []
    for group in deck:
        for position, card in enumerate(group['cards'], 1):
            index = len(entries)
            front_page = 6 + index * 2
            card_id = f"{group['id']}-{position}"
            for side, page_index in [('front', front_page), ('back', front_page + 1)]:
                page = pdf[page_index]
                assert normalize(card['label']) in normalize(page.get_text()), (card_id, side, 'Label mismatch')
                # A6 release pages are already edge-to-edge individual card faces.
                pix = page.get_pixmap(matrix=pymupdf.Matrix(3, 3), alpha=False)
                img = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
                target = ROOT / 'assets/cards' / f'{card_id}-{side}.webp'
                target.parent.mkdir(parents=True, exist_ok=True)
                img.save(target, 'WEBP', quality=93, method=6)
                if side == 'front':
                    img.thumbnail((260, 380), Image.Resampling.LANCZOS)
                    thumb = ROOT / 'assets/thumbs' / f'{card_id}.webp'
                    thumb.parent.mkdir(parents=True, exist_ok=True)
                    img.save(thumb, 'WEBP', quality=85, method=6)
            entries.append({'id': card_id, 'label': card['label'], 'category': group['category'], 'colour': group['colour'], 'front': f'assets/cards/{card_id}-front.webp', 'back': f'assets/cards/{card_id}-back.webp', 'thumbnail': f'assets/thumbs/{card_id}.webp', 'pages': [front_page + 1, front_page + 2]})
    manifest = {'source': SOURCE, 'pdf': 'plot4ai-A6.pdf', 'pdfSha256': hashlib.sha256(args.pdf.read_bytes()).hexdigest(), 'release': 'pdf-release-43', 'cards': entries}
    (ROOT / 'cards.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    html_path = ROOT / 'index.html'
    if html_path.exists():
        embedded = json.dumps(manifest, ensure_ascii=False, separators=(',', ':')).replace('<', r'\u003c')
        html = html_path.read_text()
        html = re.sub(r'(<script type="application/json" id="card-data">).*?(</script>)', lambda m: m[1] + embedded + m[2], html, flags=re.S)
        html_path.write_text(html)
    print(f'Extracted {len(entries)} cards: 276 full-size faces and 138 thumbnails')

if __name__ == '__main__':
    main()
