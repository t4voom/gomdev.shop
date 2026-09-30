/* ==========================================================================
   gomdev — capturas do portfólio
   Abre o tools/demo.html (sites de demonstração com negócios fictícios) no
   Google Chrome sem janela e salva em assets/portfolio/:
     <slug>-desktop.webp (1600×1000), <slug>-desktop-800.webp (800×500),
     <slug>-mobile.webp (780×1688), <slug>-page.webp (390 × página inteira)
     e <slug>-desktop-page.webp (1280 × página inteira)

   Uso:  node tools/portfolio-shots.js            (todos os projetos)
         node tools/portfolio-shots.js cafe-enxaimel
   Precisa do Google Chrome (ou Edge) instalado. Qualquer versão do Node.
   ========================================================================== */
const { execFileSync } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "assets", "portfolio");
const SLUGS = ["patas-e-cia", "motor-certo", "flor-de-ipe", "navalha-nobre", "cafe-enxaimel"];

const candidates = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((c) => existsSync(c));
if (!chrome) {
  console.error("Não achei o Chrome. Rode com CHROME=<caminho do chrome> node tools/portfolio-shots.js");
  process.exit(1);
}

const url = (slug, view) => pathToFileURL(path.join(__dirname, "demo.html")).href + `?p=${slug}&v=${view}`;
const base = ["--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--allow-file-access-from-files", "--virtual-time-budget=15000"];

function shot(file, target, width, height, scale) {
  execFileSync(chrome, [...base, `--window-size=${width},${height}`, `--force-device-scale-factor=${scale}`, `--screenshot=${path.join(out, file)}`, target], { stdio: "ignore" });
  console.log("  " + file);
}

/* Altura da página inteira no celular (o demo.html escreve em data-h) */
function pageHeight(target, width = 390) {
  const dom = execFileSync(chrome, [...base, `--window-size=${width},844`, "--dump-dom", target], { encoding: "utf8", maxBuffer: 1 << 26 });
  const m = dom.match(/data-h="(\d+)"/);
  return m ? Number(m[1]) : 6000;
}

mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);
for (const slug of only.length ? only : SLUGS) {
  console.log(slug);
  if (!process.env.ONLY_MOBILE) shot(`${slug}-desktop.webp`, url(slug, "desktop"), 1280, 800, 1.25);
  if (!process.env.ONLY_MOBILE) shot(`${slug}-desktop-800.webp`, url(slug, "desktop"), 1280, 800, 0.625);
  shot(`${slug}-mobile.webp`, url(slug, "mobile"), 390, 844, 2);
  shot(`${slug}-page.webp`, url(slug, "mobile"), 390, Math.min(pageHeight(url(slug, "mobile")), 9000), 1);
  if (!process.env.ONLY_MOBILE) shot(`${slug}-desktop-page.webp`, url(slug, "desktop"), 1280, Math.min(pageHeight(url(slug, "desktop"), 1280), 9000), 1);
}
