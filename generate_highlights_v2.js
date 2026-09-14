const fs = require('fs');
const path = require('path');

const assetsDir = "C:/Users/MR AHMED/Downloads/the flower parts_Game/assets";
const sourceFiles = [
  { src: "3_anther.svg", dst: "3_Anther_Highlight.svg", id: "anther" },
  { src: "4_Filament.svg", dst: "4_Filament_Highlight.svg", id: "filament" },
  { src: "5_Stigma.svg", dst: "5_Stigma_Highlight.svg", id: "stigma" },
  { src: "6_Style.svg", dst: "6_Style_Highlight.svg", id: "style" },
  { src: "7_Ovary.svg", dst: "7_Ovary_Highlight.svg", id: "ovary" },
  { src: "8_ovule.svg", dst: "8_Ovule_Highlight.svg", id: "ovule" },
  { src: "9_Sepal.svg", dst: "9_Sepal_Highlight.svg", id: "sepal" },
  { src: "10_Petal.svg", dst: "10_Petal_Highlight.svg", id: "petal" },
];

const highlightStyle = 'fill:#ffd54f;stroke-width:2;fill-opacity:1;stroke-dasharray:none;opacity:0.85;stroke:#ffffff;stroke-opacity:0';
const transform = 'translate(-170.25663,-250.29612)';

function extractPaths(content) {
  const paths = [];
  const regex = /<path[^>]*d="([^"]*)"[^>]*\/?>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

function generateHighlight(paths, docname) {
  const pathElements = paths.map((d, i) => 
    `      <path\n         id="path${paths.length - i}"\n         style="${highlightStyle}"\n         d="${d}" />`
  ).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="210mm"
   height="297mm"
   viewBox="0 0 210 297"
   version="1.1"
   id="svg1"
   xml:space="preserve"
   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"
   sodipodi:docname="${docname}"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview
     id="namedview1"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="mm"
     showborder="true"
     inkscape:zoom="0.63999997"
     inkscape:cx="388.28127"
     inkscape:cy="532.03127"
     inkscape:window-width="1366"
     inkscape:window-height="697"
     inkscape:window-x="-8"
     inkscape:window-y="-8"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1"
     showguides="false"
     showgrid="false" /><defs
     id="defs1" /><g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1"><g
       id="g1"
       transform="${transform}">${pathElements}
</g></g></svg>`;
}

for (const file of sourceFiles) {
  const srcPath = path.join(assetsDir, file.src);
  const dstPath = path.join(assetsDir, file.dst);
  
  const content = fs.readFileSync(srcPath, 'utf8');
  const paths = extractPaths(content);
  
  console.log(`${file.src}: Found ${paths.length} paths`);
  
  const highlight = generateHighlight(paths, file.dst);
  fs.writeFileSync(dstPath, highlight);
  console.log(`  -> Written to ${file.dst}`);
}

console.log("\nAll highlight files generated!");
