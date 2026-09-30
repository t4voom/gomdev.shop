/* Gera as imagens em PNG/JPG a partir dos modelos em tools/:
     assets/og-image.jpg, assets/apple-touch-icon.png,
     assets/icon-192.png, assets/icon-512.png e favicon.ico
   Opcional: só é preciso rodar se você mudar o título ou o logo.
   Uso: npx playwright@1 --version (para garantir que existe) e depois
        node tools/generate-images.mjs */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const page = (file, query = "") => pathToFileURL(path.join(here, file)).href + query;

const browser = await chromium.launch();

async function shot(url, width, height, options = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const tab = await context.newPage();
  await tab.goto(url, { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.waitForTimeout(200);
  const buffer = await tab.screenshot({ clip: { x: 0, y: 0, width, height }, ...options });
  await context.close();
  return buffer;
}

/* Imagem de compartilhamento (WhatsApp, Instagram, Facebook, LinkedIn) */
writeFileSync(
  path.join(root, "assets/og-image.jpg"),
  await shot(page("og-image.html"), 1200, 630, { type: "jpeg", quality: 88 })
);

/* Ícones quadrados (o iOS e o Android arredondam sozinhos) */
for (const [file, size] of [["assets/apple-touch-icon.png", 180], ["assets/icon-192.png", 192], ["assets/icon-512.png", 512]]) {
  writeFileSync(path.join(root, file), await shot(page("icon.html", `?size=${size}`), size, size));
}

/* favicon.ico com PNGs de 16, 32 e 48 px (cantos arredondados, fundo transparente) */
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  pngs.push(await shot(page("icon.html", `?size=${size}&rounded=1`), size, size, { omitBackground: true }));
}
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: ícone
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[i], 0); // largura
  entry.writeUInt8(sizes[i], 1); // altura
  entry.writeUInt8(0, 2); // paleta
  entry.writeUInt8(0, 3); // reservado
  entry.writeUInt16LE(1, 4); // planos
  entry.writeUInt16LE(32, 6); // bits por pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});
writeFileSync(path.join(root, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));

await browser.close();
console.log("Imagens geradas.");
