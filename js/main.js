/* ==========================================================================
   gomdev — interações (sem dependências)
   O HTML já vem pronto do tools/build.mjs; aqui ficam só os comportamentos
   e a atualização dos links de WhatsApp/Instagram a partir do js/config.js.
   ========================================================================== */
(() => {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const hasIO = "IntersectionObserver" in window;

  /* ---------- WhatsApp e Instagram sempre com os dados do config ---------- */
  const number = String(CFG.whatsapp?.number || "").replace(/\D/g, "");
  const messages = CFG.whatsapp?.messages || {};
  const fill = (t, vars) => String(t).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const waUrl = (msg) => `https://wa.me/${number}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

  function bindLinks() {
    if (number) {
      $$("[data-wa]").forEach((a) => {
        const template = messages[a.dataset.wa] || messages.default || "";
        a.href = waUrl(fill(template, { projeto: a.dataset.projeto || "" }));
      });
    }
    const ig = CFG.instagram?.url;
    if (ig) $$("[data-instagram]").forEach((a) => (a.href = ig));
    $$("[data-cfg]").forEach((el) => {
      const value = el.dataset.cfg.split(".").reduce((o, k) => (o == null ? o : o[k]), CFG);
      if (value) el.textContent = value;
    });
    const year = String(new Date().getFullYear());
    $$("[data-year]").forEach((el) => (el.textContent = year));
  }

  /* ---------- Menu global (celular) ---------- */
  function initGlobalNav() {
    const nav = $("#gnav");
    const toggle = $(".gnav__toggle", nav);
    const menu = $("#gnav-menu");
    if (!nav || !toggle) return;
    const outside = [$("main"), $(".footer"), $(".lnav"), $(".ribbon")].filter(Boolean);
    const isOpen = () => nav.classList.contains("is-open");

    const setOpen = (open, restore = true) => {
      nav.classList.toggle("is-open", open);
      root.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      outside.forEach((el) => (el.inert = open));
      if (open) setTimeout(() => $("a", menu)?.focus({ preventScroll: true }), 60);
      else if (restore) toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));
    menu.addEventListener("click", (e) => e.target.closest("a") && isOpen() && setOpen(false, false));
    doc.addEventListener("keydown", (e) => {
      if (!isOpen()) return;
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      /* Mantém o foco dentro do menu aberto */
      const items = $$("a[href], button", nav).filter((el) => el.getClientRects().length);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia("(min-width: 834px)").addEventListener("change", (e) => e.matches && isOpen() && setOpen(false, false));
  }

  /* ---------- Sub-barra: atalhos no celular ---------- */
  function initLocalNav() {
    const lnav = $(".lnav");
    const toggle = $(".lnav__toggle", lnav || doc);
    if (!lnav || !toggle) return;
    const close = () => { lnav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const open = !lnav.classList.contains("is-open");
      lnav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $(".lnav__links", lnav).addEventListener("click", (e) => e.target.closest("a") && close());
    doc.addEventListener("keydown", (e) => e.key === "Escape" && lnav.classList.contains("is-open") && (close(), toggle.focus()));
    doc.addEventListener("click", (e) => !lnav.contains(e.target) && close());
  }

  /* ---------- Revelação ao rolar ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!hasIO || reduceMotion) return items.forEach((el) => el.classList.add("is-visible"));
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty("--reveal-delay", `${i * 80}ms`);
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- iPhone rolando a página inteira só quando visível ---------- */
  function initScrollingPhones() {
    const phones = $$(".phone--scroll");
    if (!phones.length || !hasIO || reduceMotion) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("is-playing", e.isIntersecting));
    }, { threshold: 0.35 });
    phones.forEach((p) => io.observe(p));
  }

  /* ---------- Números animados ---------- */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length || !hasIO || reduceMotion) return;
    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      let start = null;
      const frame = (now) => {
        start ??= now;
        const t = Math.min((now - start) / 1500, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        setTimeout(() => run(e.target), 250);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = "0"; io.observe(el); });
  }

  /* ---------- Vitrine horizontal com setas ---------- */
  function initShelves() {
    $$("[data-shelf]").forEach((shelf) => {
      const track = $(".shelf__track", shelf);
      const [prev, next] = $$(".paddle", shelf);
      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
        $(".shelf__paddles", shelf).hidden = max <= 0;
      };
      const step = () => {
        const item = $(".shelf__item", track);
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return item ? (item.offsetWidth + gap) * Math.max(1, Math.floor(track.clientWidth / (item.offsetWidth + gap)) - 0) : track.clientWidth;
      };
      [prev, next].forEach((btn) =>
        btn.addEventListener("click", () => track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" }))
      );
      track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* ---------- Janelas de detalhes (<dialog>) ---------- */
  function initDialogs() {
    $$("[data-dialog]").forEach((btn) => {
      const dialog = doc.getElementById(btn.dataset.dialog);
      if (!dialog || typeof dialog.showModal !== "function") return;
      btn.addEventListener("click", () => {
        dialog.showModal();
        root.classList.add("is-locked");
      });
      dialog.addEventListener("close", () => {
        root.classList.remove("is-locked");
        btn.focus();
      });
      /* Fecha ao tocar fora da janela */
      dialog.addEventListener("click", (e) => (e.target === dialog || e.target.closest("[data-close]")) && dialog.close());
    });
  }

  /* ---------- Acordeão de dúvidas ---------- */
  function initFaq() {
    $$(".faq__btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        btn.closest(".faq__item").classList.toggle("is-open", open);
      })
    );
  }

  /* ---------- Rodapé: listas abertas no computador, fechadas no celular ---------- */
  function initFooter() {
    const cols = $$(".fdir__col");
    if (!cols.length) return;
    const mq = window.matchMedia("(min-width: 834px)");
    const apply = () => cols.forEach((c) => (c.open = mq.matches));
    apply();
    mq.addEventListener("change", apply);
  }

  /* ---------- Formulário de contato → WhatsApp ---------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    const name = $("#f-name", form);
    const error = $("#f-name-error", form);
    const setError = (show) => {
      name.closest(".field").classList.toggle("is-invalid", show);
      name.setAttribute("aria-invalid", String(show));
      if (show) name.setAttribute("aria-describedby", "f-name-error");
      else name.removeAttribute("aria-describedby");
      error.hidden = !show;
    };
    name.addEventListener("input", () => name.value.trim() && setError(false));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = String(data.get("nome") || "").trim();
      if (!nome) {
        setError(true);
        name.focus();
        return;
      }
      const negocio = String(data.get("negocio") || "").trim();
      const tipo = String(data.get("tipo") || "").trim();
      const precisa = data.getAll("precisa").join(", ");
      const mensagem = String(data.get("mensagem") || "").trim();
      const lines = [
        `Olá, ${CFG.ownerName || "Gustavo"}! Meu nome é ${nome}${negocio ? `, do ${negocio}` : ""}.`,
        tipo && `Tipo de negócio: ${tipo}.`,
        precisa && `Preciso de: ${precisa}.`,
        mensagem,
      ].filter(Boolean);
      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    });
  }

  bindLinks();
  initGlobalNav();
  initLocalNav();
  initReveal();
  initScrollingPhones();
  initCounters();
  initShelves();
  initDialogs();
  initFaq();
  initFooter();
  initContactForm();
})();
