/* ==========================================================================
   YOSE BARBER — admin.js
   Panel de administración. Carga la web en un iframe (index.html?preview=1),
   recibe de ella la lista de textos, imágenes y bloques editables, y le envía
   la configuración en vivo. El resultado se descarga como site-config.js.
   ========================================================================== */

(function () {
  "use strict";

  var DRAFT_KEY = "yose_admin_draft_v1";

  var frame = document.getElementById("frame");
  var frameWrap = document.getElementById("frame-wrap");
  var bodyEl = document.getElementById("panel-body");
  var tabsEl = document.getElementById("tabs");
  var statusEl = document.getElementById("status");

  var S = null;          // configuración en edición
  var PUBLISHED = null;  // configuración que tiene la web publicada
  var META = null;       // textos / imágenes / bloques detectados en la web
  var DEFAULTS = null;
  var FONTS = null;
  var LABELS = null;
  var tab = "contacto";
  var booted = false;

  /* ---------------- utilidades ---------------- */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(base, over) {
    var out = clone(base);
    if (!isObj(over)) return out;
    Object.keys(over).forEach(function (k) {
      if (isObj(over[k]) && isObj(out[k])) out[k] = merge(out[k], over[k]);
      else if (over[k] !== undefined && over[k] !== null) out[k] = over[k];
    });
    return out;
  }
  function fixSections(cfg) {
    var seen = {}, list = [];
    (cfg.sections || []).forEach(function (s) {
      if (s && LABELS[s.id] && !seen[s.id]) { seen[s.id] = 1; list.push({ id: s.id, visible: s.visible !== false }); }
    });
    DEFAULTS.sections.forEach(function (s) { if (!seen[s.id]) list.push({ id: s.id, visible: true }); });
    cfg.sections = list;
    return cfg;
  }

  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else if (k === "disabled") el.disabled = !!v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (v !== false && v !== null && v !== undefined) el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }

  function status(msg, kind) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (kind ? " is-" + kind : "");
  }

  /* ---------------- sincronización con la web ---------------- */
  var sendT, saveT;
  function send() {
    if (frame.contentWindow) frame.contentWindow.postMessage({ type: "yose:config", config: S }, "*");
  }
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(S)); }
    catch (e) { status("Borrador no guardado (archivo muy pesado)", "warn"); }
  }
  function changed() {
    status("Cambios sin descargar", "warn");
    clearTimeout(sendT); sendT = setTimeout(send, 60);
    clearTimeout(saveT); saveT = setTimeout(saveDraft, 400);
  }
  function goto(id) {
    if (frame.contentWindow) frame.contentWindow.postMessage({ type: "yose:goto", id: id }, "*");
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.type !== "yose:ready") return;
    META = d.meta; DEFAULTS = d.defaults; FONTS = d.fonts; LABELS = d.sectionLabels;
    PUBLISHED = d.published;
    if (!booted) {
      booted = true;
      var draft = null;
      try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (err) { draft = null; }
      if (isObj(draft)) { S = fixSections(merge(DEFAULTS, draft)); status("Borrador restaurado", "warn"); }
      else { S = clone(PUBLISHED); status("Sin cambios", "ok"); }
      renderTabs();
      renderPanel();
    }
    send();
  });

  /* ---------------- pestañas ---------------- */
  var TABS = [
    ["contacto", "Contacto"], ["secciones", "Secciones"], ["textos", "Textos"], ["imagenes", "Imágenes"],
    ["tema", "Tema"], ["fuentes", "Tipografía"], ["diseno", "Diseño"], ["resenas", "Reseñas y barrios"],
    ["seo", "SEO"], ["publicar", "Publicar"]
  ];
  var RENDER = {};

  function renderTabs() {
    tabsEl.innerHTML = "";
    TABS.forEach(function (t) {
      tabsEl.appendChild(h("button", {
        type: "button", role: "tab", class: t[0] === tab ? "is-active" : "", text: t[1],
        onclick: function () { tab = t[0]; renderTabs(); renderPanel(); }
      }));
    });
  }
  function renderPanel() {
    var top = bodyEl.scrollTop;
    bodyEl.innerHTML = "";
    bodyEl.appendChild(RENDER[tab]());
    bodyEl.scrollTop = top;
  }

  /* ---------------- campos reutilizables ---------------- */
  function textField(label, value, onInput, opts) {
    opts = opts || {};
    var input = opts.multiline
      ? h("textarea", { rows: opts.rows || 3, value: value, placeholder: opts.placeholder || "" })
      : h("input", { type: opts.type || "text", value: value, placeholder: opts.placeholder || "", inputmode: opts.inputmode || null });
    input.addEventListener("input", function () { onInput(input.value, input); });
    var field = h("label", { class: "field" }, h("span", {}, label), input);
    if (opts.hint) field.appendChild(h("small", { class: "hint", text: opts.hint }));
    return field;
  }
  function rangeField(label, value, min, max, step, unit, onInput) {
    var out = h("output", { text: value + unit });
    var input = h("input", { type: "range", min: min, max: max, step: step, value: value });
    input.addEventListener("input", function () { out.textContent = input.value + unit; onInput(Number(input.value)); });
    return h("label", { class: "field" }, h("span", {}, label), h("div", { class: "range" }, input, out));
  }
  function checkField(label, checked, onChange) {
    var input = h("input", { type: "checkbox", checked: checked });
    input.addEventListener("change", function () { onChange(input.checked); });
    return h("label", { class: "check" }, input, h("span", { text: label }));
  }
  function selectField(label, options, value, onChange) {
    var sel = h("select", {}, options.map(function (o) {
      var val = Array.isArray(o) ? o[0] : o, text = Array.isArray(o) ? o[1] : o;
      var opt = h("option", { value: val, text: text });
      if (String(val) === String(value)) opt.selected = true;
      return opt;
    }));
    sel.addEventListener("change", function () { onChange(sel.value); });
    return h("label", { class: "field" }, h("span", {}, label), sel);
  }

  /* ============================  CONTACTO  ============================ */
  RENDER.contacto = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Contacto y mensajes" }));
    root.appendChild(h("p", { class: "lead", text: "El número se usa en todos los botones de agendamiento." }));

    var hint = h("small", { class: "hint" });
    function checkNumber() {
      var n = S.contact.whatsapp;
      if (!/^\d+$/.test(n)) { hint.className = "hint warn"; hint.textContent = "Usa solo dígitos: 55 + DDD + número."; return; }
      if (n.slice(0, 2) !== "55") { hint.className = "hint warn"; hint.textContent = "Para Brasil debe empezar con 55."; return; }
      if (n.length === 12 && n.charAt(4) === "9") {
        hint.className = "hint warn";
        hint.textContent = "Tiene 12 dígitos: los celulares de Brasil suelen tener 9 dígitos después del DDD. Pruébalo con el botón.";
        return;
      }
      if (n.length < 12 || n.length > 13) { hint.className = "hint warn"; hint.textContent = "Longitud inusual (" + n.length + " dígitos). Verifica el número."; return; }
      hint.className = "hint"; hint.textContent = "Formato correcto (" + n.length + " dígitos).";
    }
    var wa = textField("WhatsApp (código de país + DDD + número)", S.contact.whatsapp, function (v) {
      S.contact.whatsapp = v.replace(/\D/g, ""); checkNumber(); changed();
    }, { type: "tel", inputmode: "numeric", placeholder: "5541999999999" });
    wa.appendChild(hint);
    root.appendChild(wa);
    checkNumber();
    root.appendChild(h("button", {
      type: "button", class: "btn btn--sm", text: "Probar enlace de WhatsApp",
      onclick: function () { window.open("https://wa.me/" + S.contact.whatsapp + "?text=" + encodeURIComponent("Teste"), "_blank", "noopener"); }
    }));

    root.appendChild(h("h3", { text: "Redes" }));
    root.appendChild(textField("Instagram (enlace completo)", S.contact.instagram, function (v) { S.contact.instagram = v; changed(); },
      { type: "url", placeholder: "https://www.instagram.com/usuario" }));

    root.appendChild(h("h3", { text: "Mensajes automáticos de WhatsApp" }));
    var names = { "geral": "Botón general", "corte": "Corte Masculino", "barba": "Barba Modelada", "corte-barba": "Corte + Barba", "disponibilidade": "Consultar disponibilidad" };
    Object.keys(names).forEach(function (k) {
      root.appendChild(textField(names[k], S.messages[k], function (v) { S.messages[k] = v; changed(); }, { multiline: true, rows: 3 }));
    });
    return root;
  };

  /* ============================  SECCIONES  ============================ */
  RENDER.secciones = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Orden y posición de las secciones" }));
    root.appendChild(h("p", { class: "lead", text: "Sube o baja cada sección y ocúltala si no la quieres. El menú se reordena solo. Recomendado: dejar “Inicio” primero." }));

    var ul = h("ul", { class: "seclist" });
    S.sections.forEach(function (s, i) {
      function move(d) {
        var j = i + d;
        if (j < 0 || j >= S.sections.length) return;
        var t = S.sections[i]; S.sections[i] = S.sections[j]; S.sections[j] = t;
        changed(); renderPanel(); goto(S.sections[j].id);
      }
      var vis = h("input", { type: "checkbox", checked: s.visible, title: "Visible" });
      vis.addEventListener("change", function () { s.visible = vis.checked; changed(); renderPanel(); });
      ul.appendChild(h("li", { class: s.visible ? "" : "is-hidden" },
        vis,
        h("span", { class: "name", text: LABELS[s.id] }),
        h("button", { type: "button", class: "iconbtn", title: "Ver en la vista previa", text: "◎", onclick: function () { goto(s.id); } }),
        h("button", { type: "button", class: "iconbtn", title: "Subir", text: "▲", disabled: i === 0, onclick: function () { move(-1); } }),
        h("button", { type: "button", class: "iconbtn", title: "Bajar", text: "▼", disabled: i === S.sections.length - 1, onclick: function () { move(1); } })
      ));
    });
    root.appendChild(ul);

    root.appendChild(h("h3", { text: "Elementos individuales" }));
    root.appendChild(h("p", { class: "lead", text: "Marca lo que debe mostrarse. Por ejemplo, oculta un servicio o una foto de la galería." }));
    var groups = {};
    Object.keys(META.blocks).forEach(function (k) {
      var b = META.blocks[k];
      (groups[b.group] = groups[b.group] || []).push(k);
    });
    Object.keys(groups).forEach(function (g) {
      var inner = h("div", { class: "inner" });
      groups[g].forEach(function (k) {
        inner.appendChild(checkField(META.blocks[k].label, S.hidden.indexOf(k) === -1, function (on) {
          var idx = S.hidden.indexOf(k);
          if (on && idx > -1) S.hidden.splice(idx, 1);
          if (!on && idx === -1) S.hidden.push(k);
          changed();
        }));
      });
      root.appendChild(h("details", {}, h("summary", { text: g }), inner));
    });
    return root;
  };

  /* ============================  TEXTOS  ============================ */
  RENDER.textos = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Textos de la web" }));
    root.appendChild(h("p", { class: "lead", text: "Edita cualquier texto visible (en portugués). Si dejas un campo vacío, vuelve al texto original." }));

    var groups = {};
    Object.keys(META.texts).forEach(function (k) {
      var g = META.texts[k].group;
      (groups[g] = groups[g] || []).push(k);
    });
    var order = ["Encabezado y menú"].concat(S.sections.map(function (s) { return LABELS[s.id]; }), ["Pie de página", "Barra fija móvil"]);
    var idByLabel = {};
    Object.keys(LABELS).forEach(function (id) { idByLabel[LABELS[id]] = id; });

    order.forEach(function (g) {
      if (!groups[g]) return;
      var inner = h("div", { class: "inner" });
      groups[g].forEach(function (k) {
        var m = META.texts[k];
        var val = S.texts[k] !== undefined ? S.texts[k] : m.value;
        var long = (m.value || "").length > 70;
        var f = textField(m.label, val, function (v) {
          if (v === "" || v === m.value) delete S.texts[k]; else S.texts[k] = v;
          changed();
        }, { multiline: long, rows: 4, placeholder: m.value });
        var reset = h("button", {
          type: "button", class: "iconbtn", title: "Restaurar texto original", text: "↺",
          onclick: function () { delete S.texts[k]; var inp = f.querySelector("input,textarea"); inp.value = m.value; changed(); }
        });
        f.firstChild.appendChild(reset);
        inner.appendChild(f);
      });
      var det = h("details", {}, h("summary", { text: g }), inner);
      det.addEventListener("toggle", function () { if (det.open && idByLabel[g]) goto(idByLabel[g]); });
      root.appendChild(det);
    });
    return root;
  };

  /* ============================  IMÁGENES  ============================ */
  function setImg(k, field, v) {
    var o = S.images[k] || {};
    if (v) o[field] = v; else delete o[field];
    if (Object.keys(o).length) S.images[k] = o; else delete S.images[k];
    changed();
  }
  function fileToDataUrl(file, max, cb) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = r.result;
    };
    r.onerror = function () { cb(null); };
    r.readAsDataURL(file);
  }

  RENDER.imagenes = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Imágenes" }));
    root.appendChild(h("p", { class: "lead", text: "Pega un enlace o una ruta del hosting (por ejemplo img/hero.jpg), o sube un archivo. Lo más liviano es subir las fotos al hosting y usar la ruta." }));

    Object.keys(META.images).forEach(function (k) {
      var m = META.images[k];
      var cur = S.images[k] || {};
      var thumb = h("img", { class: "thumb", src: cur.src || m.src, alt: "" });
      var urlHint = h("small", { class: "hint" });
      function size() {
        var s = (S.images[k] && S.images[k].src) || "";
        if (s.indexOf("data:") === 0) { urlHint.className = "hint warn"; urlHint.textContent = "Imagen incrustada: " + Math.round(s.length * 0.75 / 1024) + " KB dentro de site-config.js."; }
        else { urlHint.className = "hint"; urlHint.textContent = ""; }
      }
      var url = h("input", { type: "text", value: (cur.src && cur.src.indexOf("data:") !== 0) ? cur.src : "", placeholder: cur.src && cur.src.indexOf("data:") === 0 ? "(archivo subido)" : m.src });
      url.addEventListener("input", function () { setImg(k, "src", url.value.trim()); thumb.src = url.value.trim() || m.src; size(); });
      var alt = h("input", { type: "text", value: cur.alt || "", placeholder: m.alt });
      alt.addEventListener("input", function () { setImg(k, "alt", alt.value); });

      var file = h("input", { type: "file", accept: "image/*", hidden: true });
      file.addEventListener("change", function () {
        if (!file.files[0]) return;
        status("Procesando imagen…");
        fileToDataUrl(file.files[0], 1600, function (data) {
          if (!data) { status("No se pudo leer la imagen", "warn"); return; }
          setImg(k, "src", data); renderPanel();
        });
      });

      var card = h("div", { class: "imgcard" }, thumb,
        h("div", {},
          h("div", { class: "small muted", text: m.group + " · " + m.label }),
          h("label", { class: "field" }, h("span", {}, "Enlace o ruta"), url, urlHint),
          h("label", { class: "field" }, h("span", {}, "Texto alternativo (accesibilidad y SEO)"), alt),
          h("div", { class: "actions" },
            h("button", { type: "button", class: "btn btn--sm", text: "Subir archivo", onclick: function () { file.click(); } }),
            h("button", { type: "button", class: "btn btn--sm", text: "Restaurar original", onclick: function () { delete S.images[k]; changed(); renderPanel(); } }),
            file)
        ));
      size();
      root.appendChild(card);
    });
    return root;
  };

  /* ============================  TEMA  ============================ */
  var COLOR_LABELS = [
    ["black1", "Fondo principal"], ["black2", "Fondo secundario"], ["card", "Tarjetas"], ["surface", "Superficies"],
    ["gold", "Acento principal"], ["goldLight", "Acento claro"], ["goldDark", "Acento oscuro"],
    ["white", "Texto principal"], ["gray", "Texto secundario"], ["border", "Bordes"]
  ];
  var PRESETS = [
    { name: "Dorado clásico", dot: "#D6A64B", c: { gold: "#D6A64B", goldLight: "#F1C875", goldDark: "#A87929", black1: "#080808", black2: "#101010", card: "#171717", surface: "#202020", white: "#F5F5F5", gray: "#A5A5A5", border: "#303030" } },
    { name: "Plata", dot: "#C9CED6", c: { gold: "#C9CED6", goldLight: "#E9EDF3", goldDark: "#8D95A1", black1: "#080808", black2: "#101010", card: "#171717", surface: "#202020", white: "#F5F5F5", gray: "#A5A5A5", border: "#303030" } },
    { name: "Cobre", dot: "#C27A4A", c: { gold: "#C27A4A", goldLight: "#E3A074", goldDark: "#8E5128", black1: "#080808", black2: "#101010", card: "#171717", surface: "#202020", white: "#F5F5F5", gray: "#A5A5A5", border: "#303030" } },
    { name: "Champán", dot: "#CDB88A", c: { gold: "#CDB88A", goldLight: "#E8D9B5", goldDark: "#9B8658", black1: "#080808", black2: "#101010", card: "#171717", surface: "#202020", white: "#F5F5F5", gray: "#A5A5A5", border: "#303030" } },
    { name: "Claro (beige y dorado)", dot: "#B07D26", c: { gold: "#B07D26", goldLight: "#C99440", goldDark: "#8A5F16", black1: "#F6F3EC", black2: "#EFEAE0", card: "#FFFFFF", surface: "#E8E2D5", white: "#161616", gray: "#5A5A5A", border: "#D8D1C0" } }
  ];

  RENDER.tema = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Tema y colores" }));
    root.appendChild(h("p", { class: "lead", text: "Elige un tema listo o ajusta cada color. El diseño original es negro con dorado." }));

    var presets = h("div", { class: "presets" });
    PRESETS.forEach(function (p) {
      presets.appendChild(h("button", {
        type: "button", class: "preset", onclick: function () {
          Object.keys(p.c).forEach(function (k) { S.theme.colors[k] = p.c[k]; });
          changed(); renderPanel();
        }
      }, h("i", { style: "background:" + p.dot }), p.name));
    });
    root.appendChild(presets);

    var grid = h("div", { class: "colors" });
    COLOR_LABELS.forEach(function (c) {
      var key = c[0];
      var picker = h("input", { type: "color", value: S.theme.colors[key] });
      var hex = h("input", { type: "text", value: S.theme.colors[key], maxlength: 7, "aria-label": c[1] + " (hex)" });
      picker.addEventListener("input", function () { hex.value = picker.value.toUpperCase(); S.theme.colors[key] = picker.value.toUpperCase(); changed(); });
      hex.addEventListener("input", function () {
        if (/^#[0-9a-f]{6}$/i.test(hex.value)) { picker.value = hex.value; S.theme.colors[key] = hex.value.toUpperCase(); changed(); }
      });
      grid.appendChild(h("div", { class: "color" }, picker, h("div", { class: "meta" }, h("b", { text: c[1] }), hex)));
    });
    root.appendChild(grid);

    root.appendChild(h("h3", { text: "Bordes redondeados" }));
    root.appendChild(rangeField("Radio de tarjetas y fotos", S.theme.radius, 0, 40, 1, " px", function (v) { S.theme.radius = v; changed(); }));
    root.appendChild(h("button", {
      type: "button", class: "btn btn--sm", text: "Restaurar tema original",
      onclick: function () { S.theme = clone(DEFAULTS.theme); changed(); renderPanel(); }
    }));
    return root;
  };

  /* ============================  TIPOGRAFÍA  ============================ */
  RENDER.fuentes = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Tipografía" }));
    root.appendChild(h("p", { class: "lead", text: "Fuentes de Google Fonts. Los cambios se ven en la vista previa (requiere conexión a internet)." }));
    root.appendChild(selectField("Fuente de títulos", FONTS.title, S.fonts.title, function (v) { S.fonts.title = v; changed(); }));
    root.appendChild(selectField("Fuente de textos", FONTS.text, S.fonts.text, function (v) { S.fonts.text = v; changed(); }));
    root.appendChild(h("h3", { text: "Tamaños" }));
    root.appendChild(rangeField("Tamaño general del texto", S.fonts.baseScale, 80, 130, 1, " %", function (v) { S.fonts.baseScale = v; changed(); }));
    root.appendChild(rangeField("Tamaño de los títulos", S.fonts.titleScale, 60, 140, 1, " %", function (v) { S.fonts.titleScale = v; changed(); }));
    root.appendChild(h("button", {
      type: "button", class: "btn btn--sm", text: "Restaurar tipografía original",
      onclick: function () { S.fonts = clone(DEFAULTS.fonts); changed(); renderPanel(); }
    }));
    return root;
  };

  /* ============================  DISEÑO  ============================ */
  RENDER.diseno = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Diseño y posición" }));
    root.appendChild(h("p", { class: "lead", text: "La posición de las fotos se aplica en pantallas grandes; en el celular la foto va siempre debajo del texto." }));
    var sides = [["right", "Derecha"], ["left", "Izquierda"]];
    root.appendChild(selectField("Foto del hero (portada)", sides, S.layout.heroImage, function (v) { S.layout.heroImage = v; changed(); }));
    root.appendChild(selectField("Foto de “Sobre Yose”", sides, S.layout.aboutImage, function (v) { S.layout.aboutImage = v; changed(); }));
    root.appendChild(rangeField("Espacio entre secciones", S.layout.spacing, 50, 160, 5, " %", function (v) { S.layout.spacing = v; changed(); }));
    root.appendChild(rangeField("Ancho máximo del contenido", S.layout.container, 960, 1440, 20, " px", function (v) { S.layout.container = v; changed(); }));
    root.appendChild(h("h3", { text: "Elementos fijos" }));
    root.appendChild(checkField("Mostrar botón “Agendar Agora” en el encabezado (escritorio)", S.layout.headerCta, function (v) { S.layout.headerCta = v; changed(); }));
    root.appendChild(checkField("Mostrar barra fija inferior en el celular", S.layout.mobileBar, function (v) { S.layout.mobileBar = v; changed(); }));
    root.appendChild(h("button", {
      type: "button", class: "btn btn--sm", text: "Restaurar diseño original",
      onclick: function () { S.layout = clone(DEFAULTS.layout); changed(); renderPanel(); }
    }));
    return root;
  };

  /* ============================  RESEÑAS Y BARRIOS  ============================ */
  RENDER.resenas = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "Reseñas de clientes" }));
    root.appendChild(h("div", { class: "notice", text: "Agrega únicamente reseñas reales. Si no hay ninguna, la web muestra un mensaje elegante en su lugar. La calificación solo debe usarse si está verificada." }));

    S.reviews.forEach(function (r, i) {
      var rating = selectField("Calificación (opcional)", [["", "Sin calificación"], [5, "5 estrellas"], [4, "4 estrellas"], [3, "3 estrellas"], [2, "2 estrellas"], [1, "1 estrella"]], r.rating || "", function (v) {
        if (v === "") delete r.rating; else r.rating = Number(v); changed();
      });
      root.appendChild(h("div", { class: "review" },
        textField("Nombre del cliente", r.name || "", function (v) { r.name = v; changed(); }),
        textField("Comentario", r.text || "", function (v) { r.text = v; changed(); }, { multiline: true, rows: 3 }),
        rating,
        h("button", { type: "button", class: "btn btn--sm btn--danger", text: "Eliminar reseña", onclick: function () { S.reviews.splice(i, 1); changed(); renderPanel(); } })
      ));
    });
    root.appendChild(h("button", {
      type: "button", class: "btn", text: "+ Agregar reseña",
      onclick: function () { S.reviews.push({ name: "", text: "" }); changed(); renderPanel(); goto("avaliacoes"); }
    }));

    root.appendChild(h("h2", { text: "Barrios atendidos", style: "margin-top:28px" }));
    root.appendChild(h("div", { class: "notice", text: "Escribe un barrio por línea, solo los que Yose confirmó. Si está vacío, la web invita a consultar la disponibilidad por WhatsApp." }));
    root.appendChild(textField("Barrios (uno por línea)", S.neighborhoods.join("\n"), function (v) {
      S.neighborhoods = v.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); changed();
    }, { multiline: true, rows: 6, placeholder: "Batel\nÁgua Verde" }));
    return root;
  };

  /* ============================  SEO  ============================ */
  RENDER.seo = function () {
    var root = h("div");
    root.appendChild(h("h2", { text: "SEO (Google)" }));
    root.appendChild(h("p", { class: "lead", text: "Título y descripción que aparecen en los resultados de búsqueda." }));
    root.appendChild(textField("Título de la página (ideal: hasta 60 caracteres)", S.seo.title, function (v, el) {
      S.seo.title = v; changed();
      el.parentNode.querySelector(".hint").textContent = v.length + " caracteres";
    }, { hint: S.seo.title.length + " caracteres" }));
    root.appendChild(textField("Descripción (ideal: hasta 160 caracteres)", S.seo.description, function (v, el) {
      S.seo.description = v; changed();
      el.parentNode.querySelector(".hint").textContent = v.length + " caracteres";
    }, { multiline: true, rows: 4, hint: S.seo.description.length + " caracteres" }));
    return root;
  };

  /* ============================  PUBLICAR  ============================ */
  function exportText() {
    return "/* YOSE BARBER — site-config.js · generado por el panel admin el " + new Date().toLocaleString("es-ES") + " */\n" +
      "window.YOSE_CONFIG = " + JSON.stringify(S, null, 2) + ";\n";
  }
  function download() {
    var blob = new Blob([exportText()], { type: "text/javascript;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site-config.js";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    status("Archivo descargado", "ok");
  }

  RENDER.publicar = function () {
    var root = h("div");
    var kb = Math.round(exportText().length / 1024);
    root.appendChild(h("h2", { text: "Publicar los cambios" }));
    root.appendChild(h("div", { class: "notice", text: "Los cambios que haces aquí solo se ven en este panel hasta que subas el archivo generado. El visitante nunca puede modificar la web desde este panel." }));
    root.appendChild(h("ol", { class: "steps" },
      h("li", {}, h("b", { text: "Descarga " }), h("code", { text: "site-config.js" }), " con el botón dorado."),
      h("li", {}, h("b", { text: "Reemplaza " }), "el archivo del mismo nombre en tu hosting, junto a ", h("code", { text: "index.html" }), "."),
      h("li", {}, h("b", { text: "Recarga " }), "la web con Ctrl+F5 para ver los cambios.")
    ));
    root.appendChild(h("p", { class: "muted small", text: "Tamaño actual del archivo: " + kb + " KB" + (kb > 500 ? " — hay imágenes incrustadas; es más liviano subirlas al hosting y usar su ruta." : ".") }));
    root.appendChild(h("div", { class: "row" },
      h("button", { type: "button", class: "btn btn--gold", text: "Descargar site-config.js", onclick: download }),
      h("button", {
        type: "button", class: "btn", text: "Copiar contenido",
        onclick: function () {
          if (navigator.clipboard) navigator.clipboard.writeText(exportText()).then(function () { status("Copiado", "ok"); }, function () { status("No se pudo copiar", "warn"); });
        }
      })
    ));
    root.appendChild(h("h3", { text: "Notas" }));
    root.appendChild(h("ul", { class: "steps" },
      h("li", { text: "El borrador se guarda automáticamente en este navegador. “Restaurar publicado” vuelve a la versión que tiene la web ahora." }),
      h("li", { text: "Para entregar o respaldar el trabajo, guarda también una copia de site-config.js." }),
      h("li", { text: "Si no quieres que admin.html esté disponible en el sitio público, no lo subas al hosting y úsalo solo desde tu computadora." })
    ));
    return root;
  };

  /* ---------------- barra superior ---------------- */
  document.getElementById("btn-download").addEventListener("click", download);

  document.getElementById("btn-reset").addEventListener("click", function () {
    if (!PUBLISHED || !confirm("¿Descartar los cambios y volver a la versión publicada?")) return;
    S = clone(PUBLISHED);
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* sin acceso a localStorage */ }
    send(); renderPanel(); status("Versión publicada restaurada", "ok");
  });

  var fileImport = document.getElementById("file-import");
  document.getElementById("btn-import").addEventListener("click", function () { fileImport.click(); });
  fileImport.addEventListener("change", function () {
    var f = fileImport.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var t = String(r.result);
        var obj = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
        S = fixSections(merge(DEFAULTS, obj));
        changed(); renderPanel(); status("Configuración importada", "warn");
      } catch (e) { status("Archivo no válido", "warn"); alert("No se pudo leer el archivo. Debe ser un site-config.js generado por este panel."); }
      fileImport.value = "";
    };
    r.readAsText(f);
  });

  var devices = document.querySelectorAll("[data-device]");
  Array.prototype.forEach.call(devices, function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(devices, function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      frameWrap.style.width = b.getAttribute("data-device");
    });
  });

  document.getElementById("fab").addEventListener("click", function () {
    var on = document.body.classList.toggle("show-preview");
    this.textContent = on ? "Volver al panel" : "Vista previa";
  });

  window.addEventListener("beforeunload", function (e) {
    if (statusEl.classList.contains("is-warn") && statusEl.textContent === "Cambios sin descargar") { e.preventDefault(); e.returnValue = ""; }
  });
})();
