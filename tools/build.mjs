/* ==========================================================================
   gomdev — gerador das páginas
   Lê js/config.js e escreve os arquivos .html do site (e o sitemap.xml).
   Não precisa instalar nada: só o Node 18+.

   Uso:  node tools/build.mjs
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://gomdev.shop";
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

/* ---------- Config ---------- */
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, "js/config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONFIG;
const PROJECTS = C.portfolio;
const SITES = PROJECTS.filter((p) => p.kind === "site");
const APPS = PROJECTS.filter((p) => p.kind === "app");

/* Projetos com a parte de cima escura (define a cor da barra de status do iPhone) */
const DARK_TOP = new Set(["jc-auto-mecanica", "barbearia-fk", "forja", "forja-trainer", "juliano-entregas", "meu-treino"]);

/* ---------- Utilitários ---------- */
const nbsp = (t) => String(t ?? "").replace(/R\$\s+(?=\d)/g, "R$ ");
const esc = (t) =>
  nbsp(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const money = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const waUrl = (msg) => `https://wa.me/${C.whatsapp.number}?text=${encodeURIComponent(msg)}`;
const fill = (t, vars) => t.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const projectUrl = (p) => `/projetos/${p.slug}`;

/* Tamanho real das capturas de página inteira (para a rolagem automática) */
function webpSize(file) {
  const d = readFileSync(file);
  const x = d.indexOf("VP8X");
  if (x > 0) return { w: 1 + d.readUIntLE(x + 12, 3), h: 1 + d.readUIntLE(x + 15, 3) };
  const k = d.indexOf("VP8 ");
  return { w: d.readUInt16LE(k + 14) & 0x3fff, h: d.readUInt16LE(k + 16) & 0x3fff };
}
const pageShot = (p) => {
  const file = path.join(root, `assets/portfolio/${p.slug}-page.webp`);
  return existsSync(file) ? webpSize(file) : null;
};

/* Link de WhatsApp: href já pronto (funciona sem JS) e data-wa para o main.js
   atualizar o número caso o config mude sem gerar as páginas de novo. */
const wa = (kind = "default", vars = {}) => {
  const msg = fill(C.whatsapp.messages[kind] || C.whatsapp.messages.default, vars);
  const data = Object.entries(vars).map(([k, v]) => ` data-${k}="${esc(v)}"`).join("");
  return `href="${esc(waUrl(msg))}" data-wa="${kind}"${data} target="_blank" rel="noopener"`;
};

/* ---------- Ícones ---------- */
const SPRITE = `<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M12 3.25a8.75 8.75 0 0 0-7.6 13.08L3.25 20.75l4.52-1.12A8.75 8.75 0 1 0 12 3.25Z"/><path d="M9.2 8.1c.25-.5.55-.5.8-.5h.55c.2 0 .45.05.6.45l.72 1.75c.08.2.04.45-.1.62l-.55.66a.4.4 0 0 0-.05.47 7 7 0 0 0 2.7 2.7c.16.1.36.07.48-.06l.66-.55a.6.6 0 0 1 .62-.1l1.75.72c.4.15.45.4.45.6v.55c0 .25 0 .55-.5.8-.6.3-1.5.55-2.45.3a7.9 7.9 0 0 1-5.4-5.4c-.25-.95 0-1.85.3-2.45Z"/></symbol>
<symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9.5 5.5 6.5 6.5-6.5 6.5"/></symbol>
<symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="m14.5 5.5-6.5 6.5 6.5 6.5"/></symbol>
<symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m5.5 9.5 6.5 6.5 6.5-6.5"/></symbol>
<symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17 17 7M8.5 7H17v8.5"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5.5v13M5.5 12h13"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-dash" viewBox="0 0 24 24"><path d="M7 12h10"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.25"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 20.75s-6.25-5.4-6.25-10.5a6.25 6.25 0 0 1 12.5 0c0 5.1-6.25 10.5-6.25 10.5Z"/><circle cx="12" cy="10.25" r="2.25"/></symbol>
<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r=".4"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.75"/><path d="M12 7.5V12l3 2"/></symbol>
<symbol id="i-landing" viewBox="0 0 24 24"><rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.5"/><path d="M3.75 8.75h16.5M7.5 12.5h9M7.5 15.5h5"/></symbol>
<symbol id="i-site" viewBox="0 0 24 24"><rect x="3.25" y="7.25" width="13" height="11" rx="2"/><path d="M7.25 7.25v-1a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-2.5M3.25 10.5h13"/></symbol>
<symbol id="i-store" viewBox="0 0 24 24"><path d="M5.5 8.25h13l-1 11.5a1.5 1.5 0 0 1-1.5 1.25H8a1.5 1.5 0 0 1-1.5-1.25Z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/></symbol>
<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.75" y="5.25" width="16.5" height="15" rx="2.5"/><path d="M3.75 9.75h16.5M8 3.25v4M16 3.25v4M8 13.5h2M14 13.5h2M8 16.5h2"/></symbol>
<symbol id="i-app" viewBox="0 0 24 24"><rect x="6.25" y="2.75" width="11.5" height="18.5" rx="3"/><path d="M9.5 7.5h1.5V9H9.5zM13 7.5h1.5V9H13zM9.5 11h1.5v1.5H9.5zM13 11h1.5v1.5H13zM10.5 18h3"/></symbol>
<symbol id="i-care" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5l-5.3 5.3a1.8 1.8 0 0 0 2.5 2.5l5.3-5.3a4 4 0 0 0 5-5.4l-2.4 2.4-2.1-.5-.5-2.1Z"/></symbol>
<symbol id="i-person" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.75"/><path d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0"/></symbol>
<symbol id="i-speed" viewBox="0 0 24 24"><path d="M4.6 17.75a8.75 8.75 0 1 1 14.8 0"/><path d="m12 13.5 4-4.5"/><circle cx="12" cy="13.5" r="1.25"/></symbol>
<symbol id="i-revisions" viewBox="0 0 24 24"><path d="M19.5 10.5A7.75 7.75 0 0 0 5.6 7.4L4.25 9"/><path d="M4.25 4.75V9H8.5"/><path d="M4.5 13.5a7.75 7.75 0 0 0 13.9 3.1l1.35-1.6"/><path d="M19.75 19.25V15H15.5"/></symbol>
<symbol id="i-support" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.75"/><circle cx="12" cy="12" r="3.5"/><path d="m5.8 5.8 3.7 3.7M14.5 14.5l3.7 3.7M18.2 5.8l-3.7 3.7M9.5 14.5l-3.7 3.7"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 6.25A2.5 2.5 0 0 1 6.5 3.75h11A2.5 2.5 0 0 1 20 6.25v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5v-3.5A1.5 1.5 0 0 1 4 15.25Z"/><path d="M8 8.75h8M8 12h5"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.75"/><path d="M3.25 12h17.5M12 3.25c2.4 2.6 3.6 5.5 3.6 8.75S14.4 18.15 12 20.75C9.6 18.15 8.4 15.25 8.4 12S9.6 5.85 12 3.25Z"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><rect x="6.25" y="2.75" width="11.5" height="18.5" rx="3"/><path d="M10.5 18h3"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.25"/><path d="m15.25 15.25 5 5"/></symbol>
<symbol id="i-pen" viewBox="0 0 24 24"><path d="M4 20l1.2-4.8L15.6 4.8a2.1 2.1 0 0 1 3 0l.6.6a2.1 2.1 0 0 1 0 3L8.8 18.8Z"/><path d="M13.8 6.6l3.6 3.6"/></symbol>
</defs></svg>`;

const LOGO = (cls = "logo") => `<svg class="${cls}" viewBox="0 0 131 34" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="17" r="7"/><path d="M15.5 10V25a7 7 0 0 1-13.06 3.5"/><circle cx="29" cy="17" r="7"/><path d="M42.5 24V14.5a4.5 4.5 0 0 1 9 0V24M51.5 14.5a4.5 4.5 0 0 1 9 0V24"/><circle cx="74" cy="17" r="7"/><path d="M81 2V24"/><path d="M87.5 17h14a7 7 0 1 0-2.05 4.95"/><path d="M108 10l6.5 14L121 10"/></g><circle class="logo__dot" cx="128" cy="23" r="2.5"/></svg>`;

const NAV = [
  ["/portfolio", "Portfólio"],
  ["/servicos", "Serviços"],
  ["/planos", "Planos"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];

/* ---------- Aparelhos ---------- */
const alt = (p, where) => `${where === "phone" ? "Site" : "Página"} ${p.kind === "app" ? "do aplicativo" : "de"} ${p.name} ${where === "phone" ? "no celular" : "no computador"}`;

function laptop(p, { eager = false, sizes = "(min-width: 1068px) 880px, 82vw" } = {}) {
  return `<div class="laptop">
    <div class="laptop__lid"><div class="laptop__screen">
      <img src="/assets/portfolio/${p.slug}-desktop-800.webp" srcset="/assets/portfolio/${p.slug}-desktop-800.webp 800w, /assets/portfolio/${p.slug}-desktop.webp 1600w" sizes="${sizes}" width="1600" height="1000" alt="${esc(alt(p, "laptop"))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </div></div>
    <div class="laptop__base"></div>
  </div>`;
}

function phone(p, { eager = false, scroll = false, cls = "" } = {}) {
  const shot = scroll ? pageShot(p) : null;
  const status = `<span class="phone__status${DARK_TOP.has(p.slug) ? " phone__status--dark" : ""}" aria-hidden="true"><span>9:41</span><span class="phone__bars"></span></span>`;
  if (shot) {
    const h = Math.round((shot.h / shot.w) * 390);
    const end = ((1 - 800 / h) * 100).toFixed(2);
    const dur = Math.max(10, Math.round((h / 844) * 2.6));
    return `<div class="phone phone--scroll ${cls}" style="--scroll-end:-${end}%;--scroll-dur:${dur}s">
      <div class="phone__body"><div class="phone__screen">${status}
        <div class="phone__viewport"><img src="/assets/portfolio/${p.slug}-page.webp" width="${shot.w}" height="${shot.h}" alt="Página inteira de ${esc(p.name)} no celular" loading="lazy" decoding="async"></div>
        <span class="phone__island" aria-hidden="true"></span>
      </div></div></div>`;
  }
  return `<div class="phone ${cls}">
    <div class="phone__body"><div class="phone__screen">${status}
      <div class="phone__viewport"><img src="/assets/portfolio/${p.slug}-mobile.webp" width="780" height="1688" alt="${esc(alt(p, "phone"))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>
      <span class="phone__island" aria-hidden="true"></span>
    </div></div></div>`;
}

/* Laptop + celular sobrepostos, ou só celulares para apps */
function devices(p, { eager = false, sizes } = {}) {
  if (p.device === "phone") {
    return `<div class="devices devices--phones">${phone(p, { eager, cls: "devices__phone" })}</div>`;
  }
  return `<div class="devices">${laptop(p, { eager, sizes })}${phone(p, { eager, cls: "devices__phone" })}</div>`;
}

/* ---------- Pedaços comuns ---------- */
function head({ title, description, url, image = "/assets/og-image.jpg", jsonld = "", noindex = false }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${url}">`}
  <meta name="theme-color" content="#f5f5f7">
  <meta name="format-detection" content="telephone=no">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="gomdev">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}${image}">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/css/style.css">
  <script>document.documentElement.classList.add("js");</script>
  <script src="/js/config.js" defer></script>
  <script src="/js/main.js" defer></script>${jsonld ? `\n  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>`;
}

function globalNav(current) {
  const links = NAV.map(
    ([href, label], i) =>
      `<li style="--i:${i}"><a href="${href}"${current === href ? ' aria-current="page"' : ""}>${label}</a></li>`
  ).join("");
  return `<header class="gnav" id="gnav">
    <nav class="gnav__bar" aria-label="Principal">
      <a class="gnav__logo" href="/" aria-label="gomdev, página inicial">${LOGO()}</a>
      <div class="gnav__menu" id="gnav-menu">
        <ul class="gnav__links">${links}</ul>
        <div class="gnav__menu-cta" style="--i:${NAV.length}">
          <a class="btn btn--primary btn--lg" ${wa()}>${icon("whatsapp")}Fale no WhatsApp</a>
          <p class="gnav__note">${esc(C.whatsapp.responseTime)}</p>
        </div>
      </div>
      <div class="gnav__actions">
        <a class="gnav__icon" ${wa()} aria-label="Conversar no WhatsApp">${icon("whatsapp")}</a>
        <button class="gnav__toggle" type="button" aria-expanded="false" aria-controls="gnav-menu" aria-label="Abrir menu"><span></span><span></span></button>
      </div>
    </nav>
  </header>`;
}

function ribbon() {
  if (!C.ribbon) return "";
  return `<div class="ribbon"><p class="ribbon__text">${esc(C.ribbon)} <a class="link" ${wa()}>Fale comigo</a></p></div>`;
}

/* Sub-barra fixa das páginas internas (título + atalhos + botão) */
function localNav(title, links = [], cta = `<a class="btn btn--primary btn--xs" ${wa()}>Fale comigo</a>`) {
  const items = links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("");
  return `<nav class="lnav" aria-label="${esc(title)}">
    <div class="lnav__bar container">
      <p class="lnav__title">${esc(title)}</p>
      ${items ? `<button class="lnav__toggle" type="button" aria-expanded="false" aria-controls="lnav-links" aria-label="Mostrar atalhos da página">${icon("chevron-down")}</button>
      <ul class="lnav__links" id="lnav-links">${items}</ul>` : ""}
      <div class="lnav__cta">${cta}</div>
    </div>
  </nav>`;
}

function footer(crumb) {
  const col = (title, items) => `<details class="fdir__col" open>
      <summary class="fdir__title">${title}${icon("chevron-down")}</summary>
      <ul>${items.map(([href, label, ext]) => `<li><a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(label)}</a></li>`).join("")}</ul>
    </details>`;
  return `<footer class="footer">
    <div class="container">
      <div class="footer__notes">
        <p>Preços “a partir de” são pontos de partida: o valor final sai na proposta, depois da nossa conversa. Domínio não incluso.</p>
        <p>Os projetos do portfólio pertencem aos respectivos clientes e aparecem aqui como exemplos do meu trabalho.</p>
      </div>
      <nav class="footer__crumbs" aria-label="Você está aqui">
        <a href="/" aria-label="gomdev, página inicial">${LOGO("logo logo--sm")}</a>
        ${crumb ? `${icon("chevron-right")}<span>${esc(crumb)}</span>` : ""}
      </nav>
      <div class="fdir">
        ${col("Explorar", [["/", "Início"], ["/portfolio", "Portfólio"], ["/servicos", "Serviços"], ["/planos", "Planos e preços"], ["/sobre", "Sobre"]])}
        ${col("Sites", SITES.map((p) => [projectUrl(p), p.name]))}
        ${col("Apps e sistemas", APPS.map((p) => [projectUrl(p), p.name]))}
        ${col("Contato", [["/contato", "Fale comigo"], [waUrl(C.whatsapp.messages.default), "WhatsApp", true], [C.instagram.url, `Instagram ${C.instagram.handle}`, true], ["/planos#duvidas", "Perguntas frequentes"]])}
      </div>
      <p class="footer__more">Mais formas de falar comigo: <a class="link" ${wa()}>WhatsApp</a> ou <a class="link" href="${esc(C.instagram.url)}" data-instagram target="_blank" rel="noopener">Instagram</a>.</p>
      <div class="footer__legal">
        <p>Copyright © <span data-year>${YEAR}</span> gomdev. Todos os direitos reservados.</p>
        <p class="footer__region">${icon("pin")}${esc(C.city)}</p>
      </div>
    </div>
  </footer>`;
}

function page({ file, url, title, description, current, crumb, localnav = "", ribbon: showRibbon = false, body, jsonld, image, noindex }) {
  const html = `${head({ title, description, url, image, jsonld, noindex })}
<body>
  ${SPRITE}
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  ${globalNav(current)}
  ${showRibbon ? ribbon() : ""}
  ${localnav}
  <main id="conteudo" tabindex="-1">
${body}
  </main>
  ${footer(crumb)}
</body>
</html>
`;
  const out = path.join(root, file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html.replace(/\n\s*\n\s*\n/g, "\n\n"));
  return url;
}

/* ---------- Blocos reutilizados ---------- */
const kindLabel = (p) => (p.kind === "app" ? "App" : "Site");

function projectCard(p, { lazy = true } = {}) {
  const media = p.device === "phone"
    ? `<div class="pcard__media pcard__media--phone">${phone(p)}</div>`
    : `<div class="pcard__media"><img src="/assets/portfolio/${p.slug}-desktop-800.webp" width="800" height="500" alt="${esc(alt(p, "laptop"))}" ${lazy ? 'loading="lazy"' : ""} decoding="async"></div>`;
  return `<article class="pcard" data-kind="${p.kind}" style="--tint:${p.tint}">
    ${media}
    <div class="pcard__body">
      <p class="pcard__kind">${kindLabel(p)} · ${esc(p.category)}</p>
      <h3 class="pcard__name"><a class="pcard__link" href="${projectUrl(p)}">${esc(p.name)}</a></h3>
      <p class="pcard__tagline">${esc(p.tagline)}</p>
      <span class="pcard__more" aria-hidden="true">Ver projeto${icon("chevron-right")}</span>
    </div>
  </article>`;
}

function shelf(id, title, items, { lead = "" } = {}) {
  return `<section class="section section--shelf" aria-labelledby="${id}-title">
    <div class="container">
      <h2 class="headline" id="${id}-title">${title}</h2>
      ${lead ? `<p class="headline__lead">${lead}</p>` : ""}
    </div>
    <div class="shelf" data-shelf>
      <ul class="shelf__track" id="${id}-track" tabindex="0" aria-label="${esc(title.replace(/<[^>]+>/g, ""))}">
        ${items.map((it) => `<li class="shelf__item">${it}</li>`).join("")}
      </ul>
      <div class="shelf__paddles container">
        <button class="paddle" type="button" data-dir="-1" aria-controls="${id}-track" aria-label="Anterior">${icon("chevron-left")}</button>
        <button class="paddle" type="button" data-dir="1" aria-controls="${id}-track" aria-label="Próximo">${icon("chevron-right")}</button>
      </div>
    </div>
  </section>`;
}

function reasonsShelf() {
  const cards = C.reasons.map(
    (r, i) => `<article class="rcard">
      <span class="rcard__icon">${icon(r.icon)}</span>
      <h3 class="rcard__title">${esc(r.title)}</h3>
      <button class="rcard__open" type="button" data-dialog="reason-${i}" aria-haspopup="dialog" aria-label="Saiba mais: ${esc(r.title)}">${icon("plus")}</button>
    </article>`
  );
  const dialogs = C.reasons.map(
    (r, i) => `<dialog class="modal" id="reason-${i}" aria-labelledby="reason-${i}-title">
      <div class="modal__inner">
        <button class="modal__close" type="button" data-close aria-label="Fechar">${icon("close")}</button>
        <span class="modal__icon">${icon(r.icon)}</span>
        <h3 class="modal__title" id="reason-${i}-title">${esc(r.title)}</h3>
        <p class="modal__text">${esc(r.detail)}</p>
        <a class="btn btn--primary" ${wa()}>${icon("whatsapp")}Fale comigo</a>
      </div>
    </dialog>`
  );
  return shelf("motivos", 'Por que a gomdev. <span class="headline__muted">Os detalhes fazem a diferença.</span>', cards) + dialogs.join("");
}

function chapterNav(active = "") {
  return `<nav class="chapters" aria-label="Tipos de serviço">
    <ul class="chapters__list">
      ${C.services.map((s, i) => `<li><a class="chapters__item" href="/servicos#servico-${i}">${icon(s.icon, "icon chapters__icon")}<span>${esc(s.name)}</span></a></li>`).join("")}
    </ul>
  </nav>`;
}

function ctaBand(title = 'Vamos tirar seu negócio do <span class="text-gradient">papel digital?</span>', lead = "Me chama no WhatsApp. Em poucos minutos você já sabe quanto custa e quando fica pronto.") {
  return `<section class="section cta" data-theme="dark" aria-labelledby="cta-title">
    <div class="glow" aria-hidden="true"></div>
    <div class="container cta__inner reveal">
      <h2 class="cta__title" id="cta-title">${title}</h2>
      <p class="cta__lead">${lead}</p>
      <div class="btn-row"><a class="btn btn--primary btn--lg" ${wa()}>${icon("whatsapp")}Fale no WhatsApp</a><a class="btn btn--ghost btn--lg" href="/planos">Ver planos</a></div>
      <p class="cta__note">${esc(C.whatsapp.responseTime)}</p>
    </div>
  </section>`;
}

const intro = (h1, muted, lead = "") => `<header class="intro container reveal">
      <h1 class="intro__title">${h1} <span class="intro__muted">${muted}</span></h1>
      ${lead ? `<p class="intro__lead">${lead}</p>` : ""}
    </header>`;

/* ==========================================================================
   Páginas
   ========================================================================== */
const urls = [];
const hero = PROJECTS.find((p) => p.featured) || PROJECTS[0];
const [tileA, tileB] = SITES.filter((p) => p !== hero);
const promo = [...SITES.filter((p) => p !== hero && p !== tileA && p !== tileB), ...APPS].slice(0, 4);

/* ---------- Início ---------- */
urls.push(page({
  file: "index.html",
  url: "/",
  title: "gomdev | Criação de sites e apps em Blumenau, SC",
  description: "Sites e aplicativos feitos à mão em Blumenau: rápidos no celular, bonitos e prontos para trazer clientes pelo WhatsApp. Veja o portfólio.",
  ribbon: true,
  jsonld: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/#negocio`,
    name: "gomdev",
    description: "Criação de sites e aplicativos para negócios locais.",
    url: `${SITE}/`,
    logo: `${SITE}/assets/logo.svg`,
    image: `${SITE}/assets/og-image.jpg`,
    telephone: `+${C.whatsapp.number}`,
    sameAs: [C.instagram.url],
    priceRange: `${money(Math.min(...C.plans.map((p) => p.price)))} a ${money(Math.max(...C.plans.map((p) => p.price)))}`,
    founder: { "@type": "Person", name: C.ownerName },
    address: { "@type": "PostalAddress", addressLocality: "Blumenau", addressRegion: "SC", addressCountry: "BR" },
    areaServed: [{ "@type": "City", name: "Blumenau" }, { "@type": "City", name: "Gaspar" }, { "@type": "State", name: "Santa Catarina" }],
  },
  body: `
    <section class="tile tile--hero" aria-labelledby="hero-title">
      <div class="tile__text container">
        <p class="tile__eyebrow hero-in" style="--d:0">Criação de sites e apps · ${esc(C.city)}</p>
        <h1 class="tile__title tile__title--xl hero-in" id="hero-title" style="--d:1">Seu negócio merece um site <span class="text-gradient">à&nbsp;altura.</span></h1>
        <p class="tile__sub hero-in" style="--d:2">Feito à mão, rápido no celular e pronto para trazer clientes pelo WhatsApp.</p>
        <div class="btn-row hero-in" style="--d:3"><a class="btn btn--primary" href="/portfolio">Ver portfólio</a><a class="btn btn--outline" ${wa()}>Fale comigo</a></div>
      </div>
      <figure class="tile__media hero-in" style="--d:4">
        ${devices(hero, { eager: true })}
        <figcaption class="tile__caption"><a href="${projectUrl(hero)}">${esc(hero.name)} · ${esc(hero.city)}</a></figcaption>
      </figure>
    </section>

    ${[tileA, tileB].map((p, i) => `
    <section class="tile ${i === 0 ? "tile--dark" : "tile--gray"}" ${i === 0 ? 'data-theme="dark"' : ""} aria-labelledby="tile-${p.slug}" style="--tint:${p.tint}">
      <div class="tile__text container reveal">
        <p class="tile__eyebrow tile__eyebrow--tint">${esc(p.category)} · ${esc(p.city)}</p>
        <h2 class="tile__title" id="tile-${p.slug}">${esc(p.name)}</h2>
        <p class="tile__sub">${esc(p.tagline)}</p>
        <div class="btn-row"><a class="btn btn--primary" href="${projectUrl(p)}">Ver projeto</a>${p.url ? `<a class="btn btn--outline" href="${esc(p.url)}" target="_blank" rel="noopener">Visitar site</a>` : `<a class="btn btn--outline" ${wa("project", { projeto: p.name })}>Quero um assim</a>`}</div>
      </div>
      <div class="tile__media reveal">${devices(p)}</div>
    </section>`).join("")}

    <section class="promo" aria-label="Mais projetos">
      ${promo.map((p, i) => `
      <article class="promo__tile ${i % 3 === 0 ? "promo__tile--dark" : ""} reveal" ${i % 3 === 0 ? 'data-theme="dark"' : ""} style="--tint:${p.tint}">
        <div class="promo__text">
          <p class="tile__eyebrow tile__eyebrow--tint">${kindLabel(p)} · ${esc(p.category)}</p>
          <h2 class="promo__title">${esc(p.name)}</h2>
          <p class="promo__sub">${esc(p.tagline)}</p>
          <div class="btn-row btn-row--sm"><a class="btn btn--primary btn--sm" href="${projectUrl(p)}">Ver projeto<span class="visually-hidden">: ${esc(p.name)}</span></a><a class="btn btn--outline btn--sm" ${wa("project", { projeto: p.name })}>Quero um assim<span class="visually-hidden">: ${esc(p.name)}</span></a></div>
        </div>
        <div class="promo__media">${p.device === "phone" ? phone(p) : laptop(p, { sizes: "(min-width: 834px) 520px, 90vw" })}</div>
      </article>`).join("")}
    </section>

    ${shelf("portfolio", 'Todo o portfólio. <span class="headline__muted">Sites e apps de verdade.</span>', PROJECTS.map((p) => projectCard(p)))}

    <section class="section section--gray" aria-labelledby="servicos-title">
      <div class="container">
        <h2 class="headline headline--center" id="servicos-title">O que eu faço. <span class="headline__muted">Do primeiro site ao app sob medida.</span></h2>
        ${chapterNav()}
      </div>
    </section>

    ${reasonsShelf()}
    ${ctaBand()}`,
}));

/* ---------- Portfólio ---------- */
urls.push(page({
  file: "portfolio.html",
  url: "/portfolio",
  current: "/portfolio",
  crumb: "Portfólio",
  title: "Portfólio | gomdev",
  description: `Veja ${PROJECTS.length} projetos da gomdev: sites para pet shops, oficina, barbearia e floricultura, e aplicativos de treino e de entregas.`,
  localnav: localNav("Portfólio", [["#sites", "Sites"], ["#apps", "Apps"]]),
  body: `
    ${intro("Portfólio.", "Sites e apps de verdade, para negócios de verdade.", `${SITES.length} sites para negócios de Blumenau e Gaspar e ${APPS.length} aplicativos sob medida. Toque em um projeto para ver os detalhes.`)}
    <div class="container">
      <div class="segmented reveal" role="group" aria-label="Filtrar projetos">
        <button class="segmented__btn" type="button" data-filter="all" aria-pressed="true">Todos <span class="segmented__count">${PROJECTS.length}</span></button>
        <button class="segmented__btn" type="button" data-filter="site" aria-pressed="false">Sites <span class="segmented__count">${SITES.length}</span></button>
        <button class="segmented__btn" type="button" data-filter="app" aria-pressed="false">Apps <span class="segmented__count">${APPS.length}</span></button>
      </div>
    </div>
    <section class="section section--tight" id="sites" aria-labelledby="sites-title" data-group="site">
      <div class="container">
        <h2 class="headline" id="sites-title">Sites. <span class="headline__muted">Para ser encontrado e chamado no WhatsApp.</span></h2>
        <div class="pgrid">${SITES.map((p) => projectCard(p)).join("")}</div>
      </div>
    </section>
    <section class="section section--tight" id="apps" aria-labelledby="apps-title" data-group="app">
      <div class="container">
        <h2 class="headline" id="apps-title">Apps e sistemas. <span class="headline__muted">Ferramentas sob medida para o dia a dia.</span></h2>
        <div class="pgrid">${APPS.map((p) => projectCard(p)).join("")}</div>
      </div>
    </section>
    ${ctaBand('Quer o seu <span class="text-gradient">aqui também?</span>', "Me conta sobre o seu negócio. O próximo projeto do portfólio pode ser o seu.")}`,
}));

/* ---------- Páginas de projeto ---------- */
const oldProjects = existsSync(path.join(root, "projetos")) ? readdirSync(path.join(root, "projetos")) : [];
oldProjects.forEach((f) => f.endsWith(".html") && unlinkSync(path.join(root, "projetos", f)));

PROJECTS.forEach((p, idx) => {
  const others = [1, 2, 3].map((n) => PROJECTS[(idx + n) % PROJECTS.length]);
  const shot = pageShot(p);
  const specs = [
    ["Tipo", p.kind === "app" ? "Aplicativo / sistema web" : "Site para negócio local"],
    ["Segmento", p.category],
    ...(p.city ? [["Cidade", p.city]] : []),
    ["Funciona em", p.device === "phone" ? "Celular (instala como app)" : "Celular, tablet e computador"],
    ["Feito com", "HTML, CSS e JavaScript, sem modelos prontos"],
    ...(p.url ? [["Endereço", `<a class="link" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))}${icon("arrow-up-right")}</a>`]] : []),
  ];
  urls.push(page({
    file: `projetos/${p.slug}.html`,
    url: projectUrl(p),
    current: "/portfolio",
    crumb: p.name,
    title: `${p.name}: ${p.category}${p.city ? ` em ${p.city}` : ""} | Portfólio gomdev`,
    description: `${p.summary} Projeto feito pela gomdev.`,
    image: `/assets/portfolio/${p.slug}-desktop.webp`,
    localnav: localNav(p.name, [["#visao-geral", "Visão geral"], ["#destaques", "Destaques"], ["#ficha", "Ficha técnica"]], `<a class="btn btn--primary btn--xs" ${wa("project", { projeto: p.name })}>Quero um assim</a>`),
    jsonld: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.name,
      description: p.summary,
      creator: { "@id": `${SITE}/#negocio` },
      image: `${SITE}/assets/portfolio/${p.slug}-desktop.webp`,
      ...(p.url ? { url: p.url } : {}),
    },
    body: `
    <section class="phero" id="visao-geral" style="--tint:${p.tint}" aria-labelledby="p-title">
      <div class="container phero__text">
        <p class="phero__eyebrow hero-in" style="--d:0">${kindLabel(p)} · ${esc(p.category)}${p.city ? ` · ${esc(p.city)}` : ""}</p>
        <h1 class="phero__title hero-in" id="p-title" style="--d:1">${esc(p.name)}</h1>
        <p class="phero__tagline hero-in" style="--d:2">${esc(p.tagline)}</p>
        <div class="btn-row hero-in" style="--d:3">${p.url ? `<a class="btn btn--primary" href="${esc(p.url)}" target="_blank" rel="noopener">Visitar ${p.kind === "app" ? "app" : "site"}${icon("arrow-up-right")}</a>` : ""}<a class="btn ${p.url ? "btn--outline" : "btn--primary"}" ${wa("project", { projeto: p.name })}>${icon("whatsapp")}Quero um assim</a></div>
      </div>
      <div class="phero__media hero-in" style="--d:4">${devices(p, { eager: true })}</div>
    </section>

    <section class="section section--gray" id="destaques" aria-labelledby="d-title" style="--tint:${p.tint}">
      <div class="container">
        <h2 class="headline reveal" id="d-title">Destaques. <span class="headline__muted">${esc(p.summary)}</span></h2>
        <div class="bento">
          ${p.device === "phone" ? "" : `<div class="bento__tile bento__tile--wide bento__tile--shot reveal"><img src="/assets/portfolio/${p.slug}-desktop-800.webp" srcset="/assets/portfolio/${p.slug}-desktop-800.webp 800w, /assets/portfolio/${p.slug}-desktop.webp 1600w" sizes="(min-width: 1068px) 780px, 92vw" width="1600" height="1000" alt="${esc(alt(p, "laptop"))}" loading="lazy" decoding="async"></div>`}
          ${p.highlights.map((h, i) => `<div class="bento__tile reveal"><span class="bento__num">${String(i + 1).padStart(2, "0")}</span><p class="bento__text">${esc(h)}</p></div>`).join("")}
        </div>
      </div>
    </section>

    ${shot ? `<section class="section showcase" data-theme="dark" aria-labelledby="s-title">
      <div class="container showcase__inner">
        <div class="showcase__text reveal">
          <h2 class="headline" id="s-title">No celular. <span class="headline__muted">Onde o cliente de verdade está.</span></h2>
          <p class="showcase__lead">Esta é a página inteira de ${esc(p.name)}, rolando sozinha como no celular de quem procura por você.</p>
        </div>
        <div class="showcase__phone reveal">${phone(p, { scroll: true })}</div>
      </div>
    </section>` : ""}

    <section class="section" id="ficha" aria-labelledby="f-title">
      <div class="container container--narrow">
        <h2 class="headline reveal" id="f-title">Ficha técnica.</h2>
        <dl class="specs reveal">${specs.map(([k, v]) => `<div class="specs__row"><dt>${k}</dt><dd>${k === "Endereço" ? v : esc(v)}</dd></div>`).join("")}</dl>
      </div>
    </section>

    ${shelf("outros", 'Mais projetos. <span class="headline__muted">Continue explorando.</span>', others.map((o) => projectCard(o)))}
    ${ctaBand(`Quer um projeto como <span class="text-gradient">${esc(p.name)}?</span>`, "Me conta sobre o seu negócio pelo WhatsApp. A primeira conversa não tem compromisso.")}`,
  }));
});

/* ---------- Serviços ---------- */
const extras = [
  ["globe", "Domínio próprio", "seunegocio.com.br configurado e no seu nome."],
  ["lock", "Cadeado de segurança", "Conexão segura (HTTPS) sem custo extra."],
  ["phone", "Perfeito no celular", "Pensado primeiro para a tela pequena."],
  ["whatsapp", "WhatsApp com mensagem pronta", "O cliente só toca em enviar."],
  ["pin", "Mapa e rota", "Endereço com Google Maps e botão “Como chegar”."],
  ["search", "Aparecer no Google", "Títulos, descrições e dados certos para buscas locais."],
  ["speed", "Carrega rápido", "Nota acima de 90 no teste de velocidade do Google."],
  ["pen", "Textos que vendem", "Ajudo a escrever o que o seu cliente quer ler."],
];
urls.push(page({
  file: "servicos.html",
  url: "/servicos",
  current: "/servicos",
  crumb: "Serviços",
  title: "Serviços: sites, lojas, agendamento e apps | gomdev",
  description: "Página única, site completo, loja virtual, agendamento online, apps sob medida e manutenção. Veja como funciona, do primeiro oi ao site no ar.",
  localnav: localNav("Serviços", [["#servicos", "O que eu faço"], ["#como-funciona", "Como funciona"], ["#incluso", "O que vem junto"]]),
  body: `
    ${intro("Serviços.", "Tudo o que o seu negócio precisa para crescer na internet.")}
    <div class="container">${chapterNav()}</div>

    <section class="section section--tight" id="servicos" aria-labelledby="sv-title">
      <div class="container">
        <h2 class="visually-hidden" id="sv-title">O que eu faço</h2>
        <ul class="sgrid">
          ${C.services.map((s, i) => `<li class="reveal"><article class="scard" id="servico-${i}">
            <span class="scard__icon">${icon(s.icon)}</span>
            <h3 class="scard__title">${esc(s.name)}</h3>
            <p class="scard__text">${esc(s.text)}</p>
            <a class="link link--arrow" ${i === 4 ? `href="/portfolio#apps"` : `href="/planos"`}>${i === 4 ? "Ver apps no portfólio" : "Ver planos"}<span class="visually-hidden">: ${esc(s.name)}</span></a>
          </article></li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section section--gray" id="como-funciona" aria-labelledby="cf-title">
      <div class="container">
        <h2 class="headline headline--center reveal" id="cf-title">Como funciona. <span class="headline__muted">Do primeiro oi ao site no ar.</span></h2>
        <ol class="steps">
          ${C.steps.map((s, i) => `<li class="step reveal">
            <span class="step__num" aria-hidden="true">${i + 1}</span>
            <p class="step__tag">${esc(s.tag)}</p>
            <h3 class="step__title">${esc(s.title)}</h3>
            <p class="step__text">${esc(s.text)}</p>
          </li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="section" id="incluso" aria-labelledby="in-title">
      <div class="container">
        <h2 class="headline headline--center reveal" id="in-title">O que vem junto. <span class="headline__muted">Em todo site, sem custo extra.</span></h2>
        <ul class="features">
          ${extras.map(([ic, t, d]) => `<li class="feature reveal">${icon(ic, "icon feature__icon")}<h3 class="feature__title">${t}</h3><p class="feature__text">${d}</p></li>`).join("")}
        </ul>
      </div>
    </section>
    ${reasonsShelf()}
    ${ctaBand()}`,
}));

/* ---------- Planos ---------- */
const planIcons = ["landing", "site", "store"];
const cell = (v) =>
  v === true ? `${icon("check", "icon compare__yes")}<span class="visually-hidden">Incluso</span>`
  : v === false ? `${icon("dash", "icon compare__no")}<span class="visually-hidden">Não incluso</span>`
  : esc(v);
urls.push(page({
  file: "planos.html",
  url: "/planos",
  current: "/planos",
  crumb: "Planos",
  title: "Planos e preços de sites | gomdev",
  description: `Sites a partir de ${money(C.plans[0].price)}, em até 10x. Compare os planos Essencial, Profissional e Completo e tire suas dúvidas.`,
  localnav: localNav("Planos", [["#planos", "Planos"], ["#comparar", "Comparar"], ["#duvidas", "Dúvidas"]]),
  jsonld: {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Planos de criação de sites",
    itemListElement: C.plans.map((p) => ({ "@type": "Offer", name: `Site ${p.name}`, description: p.tagline, priceSpecification: { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "BRL" } })),
  },
  body: `
    ${intro("Planos.", "Preço claro, sem surpresa no final.", "Escolha um ponto de partida. Depois da nossa conversa, você recebe uma proposta com valor fechado.")}
    <section class="section section--tight" id="planos" aria-label="Lista de planos">
      <div class="container">
        <div class="plans">
          ${C.plans.map((p, i) => `<article class="plan${p.featured ? " plan--featured" : ""} reveal" aria-labelledby="plan-${p.id}">
            ${p.featured && p.badge ? `<p class="plan__badge">${esc(p.badge)}</p>` : ""}
            <span class="plan__icon">${icon(planIcons[i] || "site")}</span>
            <h2 class="plan__name" id="plan-${p.id}">${esc(p.name)}</h2>
            <p class="plan__tagline">${esc(p.tagline)}</p>
            <p class="plan__price"><span class="plan__from">A partir de</span><span class="plan__amount">${esc(money(p.price))}</span><span class="plan__installments">${esc(p.installments)}</span></p>
            <a class="btn btn--primary btn--block" ${wa("plan", { plano: p.name, preco: money(p.price) })}>Quero o ${esc(p.name)}</a>
            <ul class="plan__features">${p.features.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>
            <p class="plan__delivery">${icon("clock")}Pronto em até ${esc(p.delivery)}</p>
          </article>`).join("")}
        </div>
        <p class="plans__note">${esc(C.plansNote)}</p>
      </div>
    </section>

    <section class="section section--gray" id="comparar" aria-labelledby="cmp-title">
      <div class="container">
        <h2 class="headline headline--center reveal" id="cmp-title">Compare os planos.</h2>
        <div class="compare__wrap reveal" tabindex="0" role="region" aria-label="Tabela de comparação (role para o lado no celular)">
          <table class="compare">
            <thead><tr><th scope="col"><span class="visually-hidden">Recurso</span></th>${C.plans.map((p) => `<th scope="col"><span class="compare__plan">${esc(p.name)}</span><span class="compare__price">${esc(money(p.price))}</span></th>`).join("")}</tr></thead>
            <tbody>${C.compare.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${r.values.map((v) => `<td>${cell(v)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section" id="duvidas" aria-labelledby="faq-title">
      <div class="container container--narrow">
        <h2 class="headline headline--center reveal" id="faq-title">Perguntas frequentes.</h2>
        <div class="faq reveal">
          ${C.faq.map((f, i) => `<div class="faq__item">
            <h3 class="faq__q"><button class="faq__btn" type="button" id="faq-btn-${i}" aria-expanded="false" aria-controls="faq-panel-${i}"><span>${esc(f.q)}</span>${icon("plus")}</button></h3>
            <div class="faq__panel" id="faq-panel-${i}" role="region" aria-labelledby="faq-btn-${i}"><div class="faq__inner"><p class="faq__a">${esc(f.a)}</p></div></div>
          </div>`).join("")}
        </div>
        <p class="faq__more">Não encontrou a sua? <a class="link" ${wa()}>Pergunte no WhatsApp</a>.</p>
      </div>
    </section>
    ${ctaBand()}`,
}));

/* ---------- Sobre ---------- */
const cities = [...new Set(SITES.map((p) => p.city.split(",")[0]))];
const statValue = (v) => (v === "{projetos}" ? PROJECTS.length : Number(v));
urls.push(page({
  file: "sobre.html",
  url: "/sobre",
  current: "/sobre",
  crumb: "Sobre",
  title: `Sobre o ${C.ownerName} | gomdev`,
  description: `Sou o ${C.ownerName}, crio sites e aplicativos em Blumenau. Atendimento direto, sem intermediários, do primeiro oi até depois do site no ar.`,
  localnav: localNav("Sobre", [["#historia", "História"], ["#numeros", "Números"], ["#jeito", "Meu jeito"]]),
  body: `
    <section class="about" id="historia" aria-labelledby="about-title">
      <div class="container about__inner">
        <div class="about__mark hero-in" style="--d:0" aria-hidden="true"><span>${esc(C.ownerName[0])}</span></div>
        <p class="tile__eyebrow hero-in" style="--d:1">Sobre a gomdev</p>
        <h1 class="about__title hero-in" id="about-title" style="--d:2">Oi, eu sou o ${esc(C.ownerName)}.</h1>
        <p class="about__lead hero-in" style="--d:3">Crio sites e aplicativos em ${esc(C.city)}. A gomdev é isso: uma pessoa que desenha, programa e publica cada projeto do começo ao fim.</p>
        <div class="about__story reveal">
          <p>Comecei fazendo ferramentas para resolver problemas meus, como um app para acompanhar treinos. Logo vieram os negócios daqui: um hotel para pets, uma oficina, uma barbearia, uma floricultura.</p>
          <p>Em todos eles, a pergunta era a mesma: como fazer o cliente encontrar e chamar no WhatsApp sem complicação? Cada site do portfólio é a minha resposta para essa pergunta, feita sob medida, sem modelo pronto.</p>
          <p>Hoje atendo ${cities.join(" e ")} e região, sempre direto comigo, do primeiro oi até depois do site no ar.</p>
        </div>
      </div>
    </section>

    <section class="section" data-theme="dark" id="numeros" aria-labelledby="n-title">
      <div class="container">
        <h2 class="headline reveal" id="n-title">Em números. <span class="headline__muted">Só o que dá para cumprir.</span></h2>
        <ul class="stats">
          ${C.stats.map((s) => { const v = statValue(s.value); return `<li class="stat reveal"><span class="stat__value" aria-hidden="true"><span class="stat__number" data-count="${v}" style="min-width:${String(v).length}ch">${v}</span><span class="stat__suffix">${esc(s.suffix)}</span></span><span class="visually-hidden">${v}${esc(s.suffix)}</span><span class="stat__label">${esc(s.label)}</span></li>`; }).join("")}
        </ul>
      </div>
    </section>

    <section class="section section--gray" id="jeito" aria-labelledby="j-title">
      <div class="container">
        <h2 class="headline headline--center reveal" id="j-title">Meu jeito de trabalhar.</h2>
        <ul class="values">
          ${C.reasons.map((r) => `<li class="value reveal"><span class="value__icon">${icon(r.icon)}</span><h3 class="value__title">${esc(r.title)}</h3><p class="value__text">${esc(r.detail)}</p></li>`).join("")}
        </ul>
      </div>
    </section>
    ${ctaBand("Vamos tomar um café <span class=\"text-gradient\">(ou conversar no WhatsApp)?</span>", "Me conta sobre o seu negócio. A primeira conversa não tem compromisso.")}`,
}));

/* ---------- Contato ---------- */
const kinds = ["Pet shop", "Restaurante ou café", "Loja", "Clínica ou consultório", "Oficina ou serviço", "Salão ou barbearia", "Outro"];
const needs = ["Site novo", "Refazer meu site", "Loja virtual", "Agendamento", "Aplicativo"];
urls.push(page({
  file: "contato.html",
  url: "/contato",
  current: "/contato",
  crumb: "Contato",
  title: "Contato | gomdev",
  description: "Fale com o Gustavo pelo WhatsApp e receba uma proposta com valor fechado. Criação de sites e apps em Blumenau, SC.",
  localnav: localNav("Contato"),
  body: `
    ${intro("Vamos conversar.", "Conte sobre o seu negócio e receba uma proposta.", "Preencha o que quiser abaixo. Ao enviar, o WhatsApp abre com a sua mensagem pronta.")}
    <section class="section section--tight" aria-label="Formulário de contato">
      <div class="container contact">
        <form class="cform reveal" id="contact-form" novalidate>
          <div class="field">
            <input class="field__input" id="f-name" name="nome" type="text" autocomplete="name" placeholder=" " required>
            <label class="field__label" for="f-name">Seu nome</label>
            <p class="field__error" id="f-name-error" hidden>Diga pelo menos o seu nome.</p>
          </div>
          <div class="field">
            <input class="field__input" id="f-business" name="negocio" type="text" autocomplete="organization" placeholder=" ">
            <label class="field__label" for="f-business">Nome do negócio (opcional)</label>
          </div>
          <div class="field field--select">
            <select class="field__input" id="f-kind" name="tipo">
              <option value="">Selecione</option>
              ${kinds.map((k) => `<option>${k}</option>`).join("")}
            </select>
            <label class="field__label field__label--static" for="f-kind">Tipo de negócio</label>
            ${icon("chevron-down", "icon field__chevron")}
          </div>
          <fieldset class="chips">
            <legend class="chips__legend">Do que você precisa?</legend>
            ${needs.map((n, i) => `<label class="chip"><input type="checkbox" name="precisa" value="${n}"${i === 0 ? " checked" : ""}><span>${n}</span></label>`).join("")}
          </fieldset>
          <div class="field">
            <textarea class="field__input field__input--area" id="f-msg" name="mensagem" rows="4" placeholder=" "></textarea>
            <label class="field__label" for="f-msg">Mensagem (opcional)</label>
          </div>
          <button class="btn btn--primary btn--lg btn--block" type="submit">${icon("whatsapp")}Enviar pelo WhatsApp</button>
          <p class="cform__note">${esc(C.whatsapp.responseTime)} Seus dados vão só na mensagem, não ficam salvos aqui.</p>
        </form>

        <aside class="contact__side" aria-label="Outras formas de contato">
          <a class="ccard reveal" ${wa()}>
            <span class="ccard__icon ccard__icon--wa">${icon("whatsapp")}</span>
            <span class="ccard__body"><span class="ccard__title">WhatsApp</span><span class="ccard__text">O jeito mais rápido. Texto ou áudio.</span></span>
            ${icon("chevron-right", "icon ccard__chev")}
          </a>
          <a class="ccard reveal" href="${esc(C.instagram.url)}" data-instagram target="_blank" rel="noopener">
            <span class="ccard__icon ccard__icon--ig">${icon("instagram")}</span>
            <span class="ccard__body"><span class="ccard__title">Instagram</span><span class="ccard__text" data-cfg="instagram.handle">${esc(C.instagram.handle)}</span></span>
            ${icon("chevron-right", "icon ccard__chev")}
          </a>
          <div class="ccard reveal">
            <span class="ccard__icon">${icon("pin")}</span>
            <span class="ccard__body"><span class="ccard__title">${esc(C.city)}</span><span class="ccard__text">Atendo ${cities.join(", ")} e região. Online para todo o Brasil.</span></span>
          </div>
          <a class="ccard reveal" href="/planos#duvidas">
            <span class="ccard__icon">${icon("chat")}</span>
            <span class="ccard__body"><span class="ccard__title">Perguntas frequentes</span><span class="ccard__text">Prazo, domínio, pagamento e mais.</span></span>
            ${icon("chevron-right", "icon ccard__chev")}
          </a>
        </aside>
      </div>
    </section>`,
}));

/* ---------- 404 ---------- */
page({
  file: "404.html",
  url: "/404",
  title: "Página não encontrada | gomdev",
  description: "Esta página não existe. Volte ao início para conhecer os sites da gomdev.",
  noindex: true,
  body: `
    <section class="notfound" aria-labelledby="nf-title">
      <div class="container">
        <p class="tile__eyebrow">Erro 404</p>
        <h1 class="tile__title tile__title--xl" id="nf-title">Essa página saiu do <span class="text-gradient">ar.</span></h1>
        <p class="tile__sub">O endereço pode ter mudado ou nunca ter existido. O resto do site continua aqui.</p>
        <div class="btn-row"><a class="btn btn--primary" href="/">Voltar ao início</a><a class="btn btn--outline" href="/portfolio">Ver portfólio</a></div>
      </div>
    </section>`,
});

/* ---------- Sitemap ---------- */
writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><priority>${u === "/" ? "1.0" : u.startsWith("/projetos") ? "0.6" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`
);

console.log(`Páginas geradas: ${urls.length + 1} (incluindo 404) e sitemap.xml.`);
