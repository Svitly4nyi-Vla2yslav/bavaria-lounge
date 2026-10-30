"""Build the offline review HTML and the SABSUS source archive, without network access."""
from pathlib import Path
import base64
import html as html_module
import json
import os
import re
import zipfile

root = Path(__file__).resolve().parent
output = root.parent / 'deliverables'
output.mkdir(exist_ok=True)
html = (root / 'pages/index.html').read_text(encoding='utf-8')
reservation_api_base = os.environ.get('BAVARIA_RESERVATION_API_URL', '')
root_html = html.replace('{{assets.base}}', 'assets')
root_html = root_html.replace('{{reservation.apiBase}}', html_module.escape(reservation_api_base, quote=True))
# CSS custom-property URLs are resolved where the external stylesheet uses
# them, so they must be relative to assets/style.css rather than index.html.
# Normal src/href attributes remain rooted at the repository's assets folder.
root_html = re.sub(
    r"(--(?:smoke-texture|crest-mask):url\(['\"]?)assets/",
    r"\1",
    root_html,
)
(root / 'index.html').write_text(root_html, encoding='utf-8')
css = (root / 'assets/style.css').read_text(encoding='utf-8')
css = re.sub(r'@import url\([^\n]+\);\n', '', css, count=1)
js = '\n'.join((root / path).read_text(encoding='utf-8') for path in ['assets/motion.js', 'assets/booking.js', 'assets/menu.js', 'assets/app.js'])
assets = {
    file.relative_to(root / 'assets').as_posix(): 'data:image/webp;base64,' + base64.b64encode(file.read_bytes()).decode()
    for file in (root / 'assets').rglob('*.webp')
}
html = re.sub(r'  <link rel="preload"[^>]+>\n', '', html)
html = html.replace('{{reservation.apiBase}}', html_module.escape(reservation_api_base, quote=True))
html = re.sub(r'  <link rel="stylesheet" href="{{assets.base}}/style\.css(?:\?[^"]*)?">', lambda _: '<style>' + css + '</style>', html)
html = re.sub(r'  <script src="\{\{assets.base\}\}/(?:motion|booking|menu|app)\.js(?:\?[^"\n]*)?" defer></script>', '', html)
pdf_path = root / 'assets/menu/bavaria-menu.pdf'
if pdf_path.is_file():
    html = html.replace('{{assets.base}}/menu/bavaria-menu.pdf', 'data:application/pdf;base64,' + base64.b64encode(pdf_path.read_bytes()).decode())
for name, data in assets.items():
    html = html.replace('{{assets.base}}/' + name, data)
config = 'window.BAVARIA_ASSET_BASE="assets/";window.BAVARIA_EMBEDDED_ASSETS=' + json.dumps(assets) + ';'
html = html.replace('</body>', '<script>' + config + '\n' + js + '</script></body>')
preview = output / 'Bavaria_Readable_Gold.html'
preview.write_text(html, encoding='utf-8')
with zipfile.ZipFile(root / 'sabsus-source.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for dirname in ['assets', 'pages', 'templates']:
        for file in sorted((root / dirname).rglob('*')):
            if file.is_file():
                archive.write(file, file.relative_to(root))
    archive.write(root / 'site.json', 'site.json')
with zipfile.ZipFile(output / 'Bavaria_Premium_Source.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob('*')):
        if file.is_file() and '__pycache__' not in file.parts:
            archive.write(file, Path('Bavaria') / file.relative_to(root))
    archive.write(preview, preview.name)
print(json.dumps({'preview': str(preview), 'package': str(output / 'Bavaria_Premium_Source.zip')}))

