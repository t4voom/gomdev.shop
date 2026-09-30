/* ==========================================================================
   gomdev — interações
   Lê os valores de js/config.js (window.SITE_CONFIG), monta as partes
   configuráveis da página e cuida de navegação, animações e acordeão.
   Sem dependências.
   ========================================================================== */
(() => {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Utilitários ---------- */
  const $ = (selector, context = doc) => context.querySelector(selector);
  const $$ = (selector, context = doc) => Array.from(context.querySelectorAll(selector));

  /* Mantém "R$" colado ao número para o preço nunca quebrar de linha */
  const keepPriceTogether = (text) => String(text ?? "").replace(/R\$\s+(?=\d)/g, "R$\u00a0");

  const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (value) => keepPriceTogether(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

  /* Busca um valor no config por caminho, ex.: "whatsapp.responseTime" */
  const getPath = (path) =>
    path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), CFG);

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

  /* Troca {chave} pelo valor correspondente */
  const fillTemplate = (text, vars) =>
    String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));

  const whatsappNumber = () => String(getPath("whatsapp.number") || "").replace(/\D/g, "");

  const whatsappUrl = (message) => {
    const query = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${whatsappNumber()}${query}`;
  };

  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* Um único listener de rolagem, sincronizado com os quadros de animação */
  const scrollTasks = [];
  let scrollQueued = false;
  const runScrollTasks = () => {
    scrollQueued = false;
    const y = window.scrollY;
    scrollTasks.forEach((task) => task(y));
  };
  const onScroll = (task) => scrollTasks.push(task);
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(runScrollTasks);
      }
    },
    { passive: true }
  );

  /* ---------- Conteúdo vindo do config ---------- */
  function renderPlans() {
    const container = $('[data-render="plans"]');
    if (!container || !Array.isArray(CFG.plans)) return;

    container.innerHTML = CFG.plans
      .map((plan) => {
        const featured = Boolean(plan.featured);
        const price = formatPrice(plan.price);
        const titleId = `plano-${esc(plan.id)}`;
        const features = (plan.features || [])
          .map((feature) => `<li>${icon("check")}<span>${esc(feature)}</span></li>`)
          .join("");

        return `
          <div class="reveal">
            <article class="plan${featured ? " plan--featured" : ""}"${featured ? ' data-theme="dark"' : ""} aria-labelledby="${titleId}">
              ${featured && plan.badge ? `<p class="plan__badge">${esc(plan.badge)}</p>` : ""}
              <h3 class="plan__name" id="${titleId}">${esc(plan.name)}</h3>
              <p class="plan__tagline">${esc(plan.tagline)}</p>
              <p class="plan__price">
                <span class="plan__from">a partir de</span>
                <span class="plan__amount">${esc(price)}</span>
                ${plan.installments ? `<span class="plan__installments">${esc(plan.installments)}</span>` : ""}
              </p>
              <a class="btn btn--block ${featured ? "btn--primary" : "btn--outline"}" href="#contato"
                 data-wa="plan" data-plan="${esc(plan.name)}" data-price="${esc(price)}">Quero o ${esc(plan.name)}</a>
              <ul class="plan__features">${features}</ul>
            </article>
          </div>`;
      })
      .join("");
  }

  function renderStats() {
    const list = $('[data-render="stats"]');
    if (!list || !Array.isArray(CFG.stats)) return;

    list.innerHTML = CFG.stats
      .map((stat) => {
        const value = Number(stat.value) || 0;
        const digits = String(value).length;
        const suffix = stat.suffix || "";
        return `
          <li class="stat reveal">
            <span class="stat__value" aria-hidden="true"><span class="stat__number" data-count="${value}" style="min-width:${digits}ch">${value}</span><span class="stat__suffix">${esc(suffix)}</span></span>
            <span class="visually-hidden">${value}${esc(suffix)}</span>
            <span class="stat__label">${esc(stat.label)}</span>
          </li>`;
      })
      .join("");
  }

  function renderGuarantees() {
    const list = $('[data-render="guarantees"]');
    if (!list || !Array.isArray(CFG.guarantees)) return;

    const icons = { revisions: "revisions", speed: "speed", support: "support" };
    list.innerHTML = CFG.guarantees
      .map(
        (item) => `
          <li class="reveal">
            <article class="guarantee card">
              <span class="guarantee__icon" aria-hidden="true">${icon(icons[item.icon] || "check")}</span>
              <h3 class="card__title">${esc(item.title)}</h3>
              <p class="card__text">${esc(item.text)}</p>
            </article>
          </li>`
      )
      .join("");
  }

  function renderFaq() {
    const box = $('[data-render="faq"]');
    if (!box || !Array.isArray(CFG.faq)) return;

    box.innerHTML = CFG.faq
      .map(
        (item, i) => `
          <div class="faq__item">
            <h3 class="faq__q">
              <button class="faq__btn" type="button" id="faq-btn-${i}" aria-expanded="false" aria-controls="faq-panel-${i}">
                <span>${esc(item.q)}</span>${icon("plus")}
              </button>
            </h3>
            <div class="faq__panel" id="faq-panel-${i}" role="region" aria-labelledby="faq-btn-${i}">
              <div class="faq__panel-inner"><p class="faq__answer">${esc(item.a)}</p></div>
            </div>
          </div>`
      )
      .join("");

    box.addEventListener("click", (event) => {
      const button = event.target.closest(".faq__btn");
      if (!button) return;
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      button.closest(".faq__item").classList.toggle("is-open", open);
    });
  }

  /* Elementos com data-cfg="caminho" recebem o texto do config */
  function bindText() {
    $$("[data-cfg]").forEach((el) => {
      const value = getPath(el.dataset.cfg);
      if (value === undefined || value === null || value === "") {
        if (!el.textContent.trim()) el.hidden = true;
        return;
      }
      el.textContent = keepPriceTogether(value);
    });
  }

  /* Todos os links com data-wa viram links de WhatsApp com mensagem pronta */
  function bindWhatsApp() {
    const messages = getPath("whatsapp.messages") || {};
    $$("[data-wa]").forEach((link) => {
      const template = messages[link.dataset.wa] || messages.default || "";
      const message = fillTemplate(template, {
        plano: link.dataset.plan || "",
        preco: link.dataset.price || "",
        projeto: link.dataset.project || "",
      });
      link.href = whatsappUrl(message);
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  function bindInstagram() {
    const url = getPath("instagram.url");
    $$("[data-instagram]").forEach((link) => {
      if (!url) {
        link.closest("li")?.remove();
        return;
      }
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  function setYear() {
    const year = String(new Date().getFullYear());
    $$("[data-year]").forEach((el) => {
      el.textContent = year;
    });
  }

  /* Completa o JSON-LD com telefone, Instagram e preços do config */
  function enrichStructuredData() {
    const script = $("#jsonld");
    if (!script) return;
    try {
      const data = JSON.parse(script.textContent);
      const number = whatsappNumber();
      const instagram = getPath("instagram.url");
      const plans = Array.isArray(CFG.plans) ? CFG.plans : [];
      const prices = plans.map((plan) => Number(plan.price)).filter(Number.isFinite);

      if (number) data.telephone = `+${number}`;
      if (instagram) data.sameAs = [instagram];
      if (prices.length) {
        data.priceRange = `${formatPrice(Math.min(...prices))} a ${formatPrice(Math.max(...prices))}`;
      }
      data.makesOffer = plans.map((plan) => ({
        "@type": "Offer",
        name: `Site ${plan.name}`,
        description: plan.tagline,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: Number(plan.price),
          priceCurrency: "BRL",
        },
      }));
      script.textContent = JSON.stringify(data);
    } catch (error) {
      /* JSON-LD inválido: mantém o original */
    }
  }

  /* ---------- Navegação ---------- */
  function initNav() {
    const nav = $("#nav");
    if (!nav) return;
    const toggle = $(".nav__toggle", nav);
    const menu = $("#nav-menu");
    const desktop = window.matchMedia("(min-width: 834px)");
    const sections = $$("main > section[data-theme], footer[data-theme]");
    const outside = [$("main"), $(".footer"), $(".wa-float")].filter(Boolean);

    /* Cor da barra acompanha a seção que está passando por baixo dela */
    const updateTheme = (y) => {
      nav.classList.toggle("is-scrolled", y > 4);
      if (nav.classList.contains("is-open")) return;
      const probe = nav.offsetHeight / 2;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probe && rect.bottom > probe;
      });
      if (current && nav.dataset.theme !== current.dataset.theme) {
        nav.dataset.theme = current.dataset.theme;
      }
    };
    onScroll(updateTheme);
    updateTheme(window.scrollY);

    const isOpen = () => nav.classList.contains("is-open");

    const setOpen = (open, { restoreFocus = true } = {}) => {
      nav.classList.toggle("is-open", open);
      root.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      outside.forEach((el) => {
        el.inert = open;
      });
      if (open) {
        const firstLink = $("a", menu);
        if (firstLink) setTimeout(() => firstLink.focus({ preventScroll: true }), 60);
      } else {
        if (restoreFocus) toggle.focus();
        updateTheme(window.scrollY);
      }
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    /* Fecha ao escolher um link (a rolagem até a seção continua normal) */
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a") && isOpen()) setOpen(false, { restoreFocus: false });
    });

    doc.addEventListener("keydown", (event) => {
      if (!isOpen()) return;
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      /* Mantém o foco do teclado dentro do menu aberto */
      if (event.key === "Tab") {
        const focusable = $$("a[href], button:not([disabled])", nav).filter(
          (el) => el.getClientRects().length > 0
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    desktop.addEventListener("change", (event) => {
      if (event.matches && isOpen()) setOpen(false, { restoreFocus: false });
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        /* Itens que aparecem juntos entram em cascata */
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, index) => {
            entry.target.style.setProperty("--reveal-delay", `${index * 90}ms`);
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Números animados ---------- */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length || !("IntersectionObserver" in window) || reduceMotion.matches) return;

    const animate = (el) => {
      const target = Number(el.dataset.count) || 0;
      const duration = 1500;
      let start = null;
      const frame = (now) => {
        if (start === null) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          setTimeout(() => animate(entry.target), 250);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => {
      el.textContent = "0";
      observer.observe(el);
    });
  }

  /* ---------- Parallax leve no fundo do hero ---------- */
  function initParallax() {
    const hero = $(".hero");
    const layer = $(".hero__bg");
    if (!hero || !layer || reduceMotion.matches) return;

    onScroll((y) => {
      if (y > hero.offsetHeight) return;
      layer.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0)`;
    });
  }

  /* ---------- Botão flutuante do WhatsApp ---------- */
  function initFloatingButton() {
    const button = $(".wa-float");
    if (!button) return;
    let pastHero = false;
    let nearEnd = false;
    const render = () => button.classList.toggle("is-visible", pastHero && !nearEnd);

    onScroll((y) => {
      pastHero = y > window.innerHeight * 0.6;
      render();
    });

    /* Some perto do CTA final e do rodapé, onde já há botões de contato */
    const ends = [$("#contato"), $(".footer")].filter(Boolean);
    if ("IntersectionObserver" in window && ends.length) {
      const visible = new Set();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        nearEnd = visible.size > 0;
        render();
      });
      ends.forEach((el) => observer.observe(el));
    }
  }

  /* ---------- Início ---------- */
  renderPlans();
  renderStats();
  renderGuarantees();
  renderFaq();
  bindText();
  bindWhatsApp();
  bindInstagram();
  setYear();
  enrichStructuredData();
  initNav();
  initReveal();
  initCounters();
  initParallax();
  initFloatingButton();
})();
