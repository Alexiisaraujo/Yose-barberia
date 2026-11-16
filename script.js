/* ==========================================================================
   YOSE BARBER — script.js
   JavaScript puro, sin dependencias.

   La web se controla con un objeto de configuración (site-config.js, generado
   por el panel admin). Los valores por defecto están en DEFAULTS; cualquier
   dato ausente en site-config.js usa el valor por defecto.
   ========================================================================== */

(function () {
  "use strict";

  /* =====================  VALORES POR DEFECTO  ===================== */

  var DEFAULTS = {
    version: 1,
    contact: {
      // Código de país + DDD + número, solo dígitos.
      whatsapp: "55DDDNUMERO",
      instagram: "https://www.instagram.com/"
    },
    messages: {
      "geral": "Olá, Yose! Gostaria de agendar um horário para atendimento a domicílio. Poderia me informar a disponibilidade?",
      "corte": "Olá, Yose! Tenho interesse em agendar um Corte Masculino. Quais horários estão disponíveis?",
      "barba": "Olá, Yose! Gostaria de agendar um serviço de barba. Poderia me informar a disponibilidade?",
      "corte-barba": "Olá, Yose! Gostaria de agendar Corte + Barba. Quais horários estão disponíveis?",
      "disponibilidade": "Olá, Yose! Gostaria de saber se você atende no meu endereço. Poderia me informar a disponibilidade?"
    },
    seo: {
      title: "Yose Barber | Barbeiro a Domicílio em Curitiba",
      description: "Atendimento profissional de barbearia a domicílio em Curitiba. Agende seu corte masculino e barba diretamente pelo WhatsApp."
    },
    // Orden y visibilidad de las secciones (entre el header y el footer).
    sections: [
      { id: "hero", visible: true },
      { id: "servicos", visible: true },
      { id: "sobre", visible: true },
      { id: "galeria", visible: true },
      { id: "porque", visible: true },
      { id: "avaliacoes", visible: true },
      { id: "onde", visible: true },
      { id: "cta", visible: true }
    ],
    hidden: [],       // claves data-block ocultas
    texts: {},        // { "hero.lead": "Nuevo texto" }
    images: {},       // { "hero": { src: "...", alt: "..." } }
    reviews: [],      // [{ name, text, rating? }]  — solo reseñas reales
    neighborhoods: [],// ["Batel", "Água Verde"]    — solo confirmados
    theme: {
      colors: {
        black1: "#080808", black2: "#101010", card: "#171717", surface: "#202020",
        gold: "#D6A64B", goldLight: "#F1C875", goldDark: "#A87929",
        white: "#F5F5F5", gray: "#A5A5A5", border: "#303030"
      },
      radius: 16
    },
    fonts: { title: "Montserrat", text: "Inter", baseScale: 100, titleScale: 100 },
    layout: { heroImage: "right", aboutImage: "right", spacing: 100, container: 1180, mobileBar: true, headerCta: true }
  };

  var SECTION_LABELS = {
    hero: "Inicio (hero)", servicos: "Servicios", sobre: "Sobre Yose", galeria: "Galería",
    porque: "Por qué elegir", avaliacoes: "Reseñas", onde: "Zona de atención", cta: "Llamada final"
  };

  // Fuentes disponibles (Google Fonts) y los pesos que se cargan de cada una.
  var FONT_SPECS = {
    "Montserrat": "wght@700;800;900", "Playfair Display": "wght@700;800;900", "Oswald": "wght@500;600;700",
    "Poppins": "wght@600;700;800", "Raleway": "wght@700;800;900", "Cinzel": "wght@600;700;800",
    "Cormorant Garamond": "wght@600;700", "Barlow Condensed": "wght@600;700;800", "Bebas Neue": "", "Anton": "",
    "Inter": "wght@400;500;600", "Roboto": "wght@400;500;700", "Open Sans": "wght@400;500;600",
    "Lato": "wght@400;700", "DM Sans": "wght@400;500;600", "Nunito Sans": "wght@400;600;700",
    "Source Sans 3": "wght@400;500;600", "Manrope": "wght@400;500;600"
  };
  var FONT_LIST = {
    title: ["Montserrat", "Playfair Display", "Oswald", "Poppins", "Raleway", "Cinzel", "Cormorant Garamond", "Barlow Condensed", "Bebas Neue", "Anton"],
    text: ["Inter", "Roboto", "Open Sans", "Lato", "DM Sans", "Nunito Sans", "Source Sans 3", "Manrope", "Poppins"]
  };

  var FALLBACK_IMAGE = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=70";
  var COLOR_VARS = {
    black1: "--black-1", black2: "--black-2", card: "--black-card", surface: "--black-surface",
    gold: "--gold", goldLight: "--gold-light", goldDark: "--gold-dark",
    white: "--white", gray: "--gray", border: "--border"
  };

  /* ===========================  UTILIDADES  =========================== */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function merge(base, over) {
    var out = clone(base);
    if (!isObj(over)) return out;
    Object.keys(over).forEach(function (k) {
      if (isObj(over[k]) && isObj(out[k])) out[k] = merge(out[k], over[k]);
      else if (over[k] !== undefined && over[k] !== null) out[k] = over[k];
    });
    return out;
  }
  function num(v, min, max, fallback) {
    v = Number(v);
    return isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
  }

  document.documentElement.classList.add("js");

  var current = clone(DEFAULTS); // configuración aplicada actualmente

  /* ===========================  CONFIGURACIÓN  =========================== */

  function normalize(raw) {
    var cfg = merge(DEFAULTS, raw);

    // Secciones: respetar el orden recibido y añadir las que falten.
    var seen = {}, list = [];
    (Array.isArray(raw && raw.sections) ? raw.sections : []).forEach(function (s) {
      if (s && SECTION_LABELS[s.id] && !seen[s.id]) { seen[s.id] = 1; list.push({ id: s.id, visible: s.visible !== false }); }
    });
    DEFAULTS.sections.forEach(function (s) { if (!seen[s.id]) list.push({ id: s.id, visible: true }); });
    cfg.sections = list;

    if (!Array.isArray(cfg.hidden)) cfg.hidden = [];
    if (!isObj(cfg.texts)) cfg.texts = {};
    if (!isObj(cfg.images)) cfg.images = {};
    if (!Array.isArray(cfg.reviews)) cfg.reviews = [];
    if (!Array.isArray(cfg.neighborhoods)) cfg.neighborhoods = [];

    Object.keys(COLOR_VARS).forEach(function (k) {
      if (!/^#[0-9a-f]{6}$/i.test(cfg.theme.colors[k])) cfg.theme.colors[k] = DEFAULTS.theme.colors[k];
    });
    cfg.theme.radius = num(cfg.theme.radius, 0, 40, 16);

    if (!FONT_SPECS.hasOwnProperty(cfg.fonts.title)) cfg.fonts.title = DEFAULTS.fonts.title;
    if (!FONT_SPECS.hasOwnProperty(cfg.fonts.text)) cfg.fonts.text = DEFAULTS.fonts.text;
    cfg.fonts.baseScale = num(cfg.fonts.baseScale, 80, 130, 100);
    cfg.fonts.titleScale = num(cfg.fonts.titleScale, 60, 140, 100);

    cfg.layout.heroImage = cfg.layout.heroImage === "left" ? "left" : "right";
    cfg.layout.aboutImage = cfg.layout.aboutImage === "left" ? "left" : "right";
    cfg.layout.spacing = num(cfg.layout.spacing, 50, 160, 100);
    cfg.layout.container = num(cfg.layout.container, 960, 1440, 1180);
    cfg.layout.mobileBar = cfg.layout.mobileBar !== false;
    cfg.layout.headerCta = cfg.layout.headerCta !== false;
    return cfg;
  }

  /* ---------- Tema y tipografía ---------- */
  function applyTheme(cfg) {
    var root = document.documentElement;
    Object.keys(COLOR_VARS).forEach(function (k) { root.style.setProperty(COLOR_VARS[k], cfg.theme.colors[k]); });
    root.style.setProperty("--radius", cfg.theme.radius + "px");
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", cfg.theme.colors.black1);
  }

  function familyParam(name) {
    var spec = FONT_SPECS[name];
    return "family=" + name.replace(/ /g, "+") + (spec ? ":" + spec : "");
  }
  function applyFonts(cfg) {
    var root = document.documentElement;
    var t = cfg.fonts.title, x = cfg.fonts.text;
    var link = document.getElementById("yose-fonts");
    if (t === DEFAULTS.fonts.title && x === DEFAULTS.fonts.text) {
      if (link) link.parentNode.removeChild(link);
    } else {
      var fams = t === x ? [t] : [t, x];
      var url = "https://fonts.googleapis.com/css2?" + fams.map(familyParam).join("&") + "&display=swap";
      if (!link) {
        link = document.createElement("link");
        link.id = "yose-fonts";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      if (link.getAttribute("href") !== url) link.setAttribute("href", url);
    }
    root.style.setProperty("--font-title", '"' + t + '", system-ui, sans-serif');
    root.style.setProperty("--font-text", '"' + x + '", system-ui, sans-serif');
    root.style.setProperty("--base-scale", String(cfg.fonts.baseScale));
    root.style.setProperty("--title-scale", String(cfg.fonts.titleScale / 100));
  }

  /* ---------- Diseño ---------- */
  function applyLayout(cfg) {
    var root = document.documentElement;
    root.style.setProperty("--sec-mult", String(cfg.layout.spacing / 100));
    root.style.setProperty("--container", cfg.layout.container + "px");
    document.body.classList.toggle("layout-hero-left", cfg.layout.heroImage === "left");
    document.body.classList.toggle("layout-about-left", cfg.layout.aboutImage === "left");
    document.body.classList.toggle("no-bar", !cfg.layout.mobileBar);
    document.body.classList.toggle("no-header-cta", !cfg.layout.headerCta);
  }

  /* ---------- Textos ---------- */
  function applyTexts(cfg) {
    $$("[data-t]").forEach(function (el) {
      if (el.dataset.orig === undefined) el.dataset.orig = el.textContent;
      var v = cfg.texts[el.dataset.t];
      el.textContent = (typeof v === "string" && v.length) ? v : el.dataset.orig;
    });
  }

  /* ---------- Imágenes ---------- */
  function applyImages(cfg) {
    $$("[data-img]").forEach(function (img) {
      if (img.dataset.o === undefined) {
        img.dataset.o = img.getAttribute("src") || "";
        img.dataset.oSet = img.getAttribute("srcset") || "";
        img.dataset.oAlt = img.getAttribute("alt") || "";
      }
      var o = cfg.images[img.dataset.img];
      o = isObj(o) ? o : {};
      var src = o.src || img.dataset.o;
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      if (o.src) img.removeAttribute("srcset");
      else if (img.dataset.oSet) img.setAttribute("srcset", img.dataset.oSet);
      img.setAttribute("alt", o.alt || img.dataset.oAlt);

      var btn = img.closest(".gallery__item");
      if (btn) {
        if (btn.dataset.o === undefined) btn.dataset.o = btn.getAttribute("data-full") || "";
        btn.setAttribute("data-full", o.src || btn.dataset.o);
      }
    });
  }

  /* ---------- Bloques ocultos ---------- */
  function applyBlocks(cfg) {
    $$("[data-block]").forEach(function (el) {
      el.classList.toggle("is-off", cfg.hidden.indexOf(el.dataset.block) > -1);
    });
  }

  /* ---------- Orden y visibilidad de secciones ---------- */
  function applySections(cfg) {
    var main = $("#conteudo");
    var index = {}, visible = {};
    cfg.sections.forEach(function (s, i) {
      index[s.id] = i;
      visible[s.id] = s.visible;
      var el = $('[data-section="' + s.id + '"]', main);
      if (el) { main.appendChild(el); el.classList.toggle("is-off", !s.visible); }
    });

    // Fondos alternados (claro/oscuro) según el orden resultante.
    var n = 0;
    $$("[data-section].section", main).forEach(function (el) {
      if (el.classList.contains("is-off")) return;
      el.classList.toggle("section--alt", n % 2 === 1);
      n++;
    });

    // Enlaces del menú: ocultar los de secciones ocultas y ordenar como la página.
    $$("[data-navlist]").forEach(function (ul) {
      var items = $$("li[data-nav]", ul);
      items.sort(function (a, b) { return index[a.dataset.nav] - index[b.dataset.nav]; });
      items.forEach(function (li) {
        ul.appendChild(li);
        li.classList.toggle("is-off", !visible[li.dataset.nav]);
      });
    });
  }

  /* ---------- WhatsApp e Instagram ---------- */
  function whatsappUrl(key, cfg) {
    var number = String(cfg.contact.whatsapp || "").replace(/\D/g, "");
    var message = cfg.messages[key] || cfg.messages.geral;
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }
  function applyContact(cfg) {
    $$("[data-wa]").forEach(function (el) {
      el.setAttribute("href", whatsappUrl(el.getAttribute("data-wa"), cfg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    var ig = $("#instagram-link");
    if (ig) ig.setAttribute("href", cfg.contact.instagram || DEFAULTS.contact.instagram);
  }

  /* ---------- SEO ---------- */
  function applySeo(cfg) {
    document.title = cfg.seo.title;
    var d = $('meta[name="description"]'); if (d) d.setAttribute("content", cfg.seo.description);
    var ot = $('meta[property="og:title"]'); if (ot) ot.setAttribute("content", cfg.seo.title);
    var od = $('meta[property="og:description"]'); if (od) od.setAttribute("content", cfg.seo.description);
  }

  /* ---------- Reseñas reales y barrios ---------- */
  function applyReviews(cfg) {
    var list = $("#reviews-list");
    var empty = $("#reviews-empty");
    if (!list) return;
    list.innerHTML = "";
    var reviews = cfg.reviews.filter(function (r) { return r && r.name && r.text; });
    reviews.forEach(function (r) {
      var card = document.createElement("figure");
      card.className = "review";
      card.style.margin = "0";
      var rating = Number(r.rating);
      if (rating >= 1 && rating <= 5) {
        var stars = document.createElement("div");
        stars.className = "review__stars";
        stars.setAttribute("aria-label", "Nota " + rating + " de 5");
        stars.textContent = new Array(Math.round(rating) + 1).join("★");
        card.appendChild(stars);
      }
      var quote = document.createElement("blockquote");
      quote.style.margin = "0";
      var p = document.createElement("p");
      p.textContent = r.text; // textContent: evita inyección de HTML
      quote.appendChild(p);
      card.appendChild(quote);
      var caption = document.createElement("figcaption");
      var cite = document.createElement("cite");
      cite.textContent = r.name;
      caption.appendChild(cite);
      card.appendChild(caption);
      list.appendChild(card);
    });
    list.hidden = !reviews.length;
    if (empty) empty.hidden = reviews.length > 0;
  }

  function applyNeighborhoods(cfg) {
    var list = $("#neighborhoods");
    var note = $("#neighborhoods-empty");
    if (!list) return;
    list.innerHTML = "";
    var names = cfg.neighborhoods.filter(function (n) { return typeof n === "string" && n.trim(); });
    names.forEach(function (name) {
      var li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
    list.hidden = !names.length;
    if (note) note.hidden = names.length > 0;
  }

  /* ---------- Aplicación completa (idempotente) ---------- */
  function applyConfig(raw) {
    var cfg = normalize(raw || {});
    current = cfg;
    applyTheme(cfg);
    applyFonts(cfg);
    applyLayout(cfg);
    applyTexts(cfg);
    applyImages(cfg);
    applyBlocks(cfg);
    applySections(cfg);
    applyContact(cfg);
    applySeo(cfg);
    applyReviews(cfg);
    applyNeighborhoods(cfg);
    return cfg;
  }

  /* ===========================  COMPORTAMIENTO  =========================== */

  function initMenu() {
    var toggle = $("#menu-toggle");
    var menu = $("#menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.classList.toggle("is-open", open);
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setOpen(false); });
  }

  function initHeader() {
    var header = $(".site-header");
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 10); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!("IntersectionObserver" in window)) return;
    var links = $$('.nav a[href^="#"]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          map[entry.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      io.observe(el);
    });
  }

  // Imagen alternativa si alguna foto no carga.
  function initImageFallback() {
    $$("img").forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.getAttribute("src") !== FALLBACK_IMAGE) {
          img.removeAttribute("srcset");
          img.setAttribute("src", FALLBACK_IMAGE);
        }
      });
    });
  }

  // Galería con visualización ampliada (lee las fotos visibles al abrir).
  function initLightbox() {
    var box = $("#lightbox");
    var imgEl = $(".lightbox__img", box);
    if (!box) return;
    var items = [], index = 0, lastFocus = null;

    function show(i) {
      index = (i + items.length) % items.length;
      var btn = items[index];
      var thumb = $("img", btn);
      imgEl.src = btn.getAttribute("data-full") || thumb.src;
      imgEl.alt = thumb.alt;
    }
    function open(btn) {
      items = $$(".gallery > li:not(.is-off) .gallery__item");
      lastFocus = document.activeElement;
      show(Math.max(0, items.indexOf(btn)));
      box.hidden = false;
      document.body.style.overflow = "hidden";
      $(".lightbox__close", box).focus();
    }
    function close() {
      box.hidden = true;
      imgEl.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".gallery__item");
      if (btn) open(btn);
    });
    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__prev", box).addEventListener("click", function () { show(index - 1); });
    $(".lightbox__next", box).addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    imgEl.addEventListener("error", function () {
      var thumb = items[index] && $("img", items[index]);
      if (thumb && imgEl.getAttribute("src") !== thumb.src) imgEl.src = thumb.src;
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  function initYear() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ===========================  MODO VISTA PREVIA  ===========================
     El panel admin carga esta página en un iframe con ?preview=1 y le envía la
     configuración en vivo mediante postMessage. Nada de esto afecta a los
     visitantes normales.                                                      */

  function groupOf(el) {
    var s = el.closest("[data-section]");
    if (s) return SECTION_LABELS[s.dataset.section];
    if (el.closest(".site-header")) return "Encabezado y menú";
    if (el.closest(".site-footer")) return "Pie de página";
    if (el.closest(".mobile-bar")) return "Barra fija móvil";
    return "Otros";
  }

  function describe() {
    var texts = {}, images = {}, blocks = {};
    $$("[data-t]").forEach(function (el) {
      var k = el.dataset.t;
      if (!texts[k]) texts[k] = { label: el.dataset.l || k, group: groupOf(el), value: el.dataset.orig };
    });
    $$("[data-img]").forEach(function (img) {
      images[img.dataset.img] = { label: img.dataset.l || img.dataset.img, group: groupOf(img), src: img.dataset.o, alt: img.dataset.oAlt };
    });
    $$("[data-block]").forEach(function (el) {
      blocks[el.dataset.block] = { label: el.dataset.l || el.dataset.block, group: groupOf(el) };
    });
    return { texts: texts, images: images, blocks: blocks };
  }

  function initPreview(published) {
    if (!/[?&]preview=1/.test(location.search) || window.parent === window) return;

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "yose:config") applyConfig(d.config);
      if (d.type === "yose:goto") {
        var el = $('[data-section="' + d.id + '"]');
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    window.parent.postMessage({
      type: "yose:ready",
      meta: describe(),
      defaults: DEFAULTS,
      published: published,
      fonts: FONT_LIST,
      sectionLabels: SECTION_LABELS
    }, "*");
  }

  /* ===========================  INICIO  =========================== */

  function init() {
    var published = applyConfig(window.YOSE_CONFIG);
    initMenu();
    initHeader();
    initImageFallback();
    initLightbox();
    initYear();
    initReveal();
    initPreview(published);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
