"""Sample actual cover edges; precomputed colors also work in file:// previews."""
from pathlib import Path
from collections import Counter
from PIL import Image
import json
root=Path(__file__).resolve().parents[2]
palette={}
for path in sorted((root/'assets').rglob('*')):
 if path.suffix.lower() not in {'.jpg','.jpeg','.png','.webp'}:continue
 try:
  with Image.open(path) as source:
   image=source.convert('RGBA').resize((96,128))
   pixels=[image.getpixel((x,y)) for y in range(8,120) for x in range(1,5)]
   pixels=[p[:3] for p in pixels if p[3]>224]
   if not pixels:continue
   # Avoid isolated lettering: take the largest neighboring color cluster on the edge.
   cluster=Counter(tuple(c//32 for c in p) for p in pixels).most_common(1)[0][0]
   chosen=[p for p in pixels if all(abs(p[i]//32-cluster[i])<=1 for i in range(3))]
   rgb=[round(sum(p[i] for p in chosen)/len(chosen)) for i in range(3)]
   palette[path.relative_to(root).as_posix()]='#'+''.join(f'{c:02x}' for c in rgb)
 except (OSError,ValueError):continue
out=root/'scripts/cover-edge-palette.js'
out.write_text('/* Generated from the left edge of each local cover. Do not hard-code publication colors. */\nwindow.readingCoverEdgePalette='+json.dumps(palette,ensure_ascii=False,separators=(',',':'))+';\n'+'''window.readingCoverEdgeColor=function(src){
 const raw=String(src||'').split(/[?#]/)[0];
 if(readingCoverEdgePalette[raw])return readingCoverEdgePalette[raw];
 // Remote publication URLs share filenames with their sampled local covers.
 const filename=raw.slice(raw.lastIndexOf('/')+1);
 const matching=Object.entries(readingCoverEdgePalette).filter(([path])=>path.endsWith('/'+filename));
 if(matching.length&&matching.every(([,color])=>color===matching[0][1]))return matching[0][1];
 try{const path=decodeURI(new URL(src,document.baseURI).pathname),start=path.lastIndexOf('/assets/');if(start>=0)return readingCoverEdgePalette[path.slice(start+1)]||'#e6e3dc';}catch{}
 return '#e6e3dc';
};
''')
print('Sampled',len(palette),'local images')
for p in ['assets/source-books/rb-ob-01.webp','assets/source-books/rb-ob-14.webp','assets/claimed-nanfc/nafc202609-z.jpg']:
 print(p,palette.get(p))
