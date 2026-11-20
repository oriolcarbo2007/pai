require(["esri/WebScene", "esri/Map", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic"],
function (WebScene, EsriMap, SceneView, GraphicsLayer, Graphic) {

  /* ---------------------------------------------------------------
     CONFIGURACIÓ
  --------------------------------------------------------------- */
  var SCENE_ITEM_ID = "ec29cf29463f4f70957b0f94a0befb57"; // Escena Base 3D Campus UAB

  // POSICIONS PROVISIONALS. Obre la pàgina amb #editar al final de la URL
  // per situar cada element (facultats, pàrquings, bars) al seu lloc real.
  var CENTRE = { lat: 41.4990, lon: 2.1093 };
  function at(dx, dy) { // metres cap a l'est i cap al nord des del centre
    return { lon: +(CENTRE.lon + dx / 83400).toFixed(6), lat: +(CENTRE.lat + dy / 111000).toFixed(6) };
  }

  /* Tipus d'edificació: etiqueta del filtre, color, mida i dibuix de la icona */
  var TYPES = {
    faculty: { label: "Facultats i escoles", color: "#0b7a4b", size: 38,
      glyph: '<path d="M4 21V6l8-3 8 3v15"/><path d="M2 21h20"/><path d="M8.5 9h1.5M14 9h1.5M8.5 13h1.5M14 13h1.5"/><path d="M10.5 21v-4h3v4"/>' },
    parking: { label: "Pàrquings", kind: "Pàrquing", color: "#2f5d9e", size: 32,
      glyph: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>' },
    bar: { label: "Bars i cafeteries", kind: "Bar", color: "#c2410c", size: 32,
      glyph: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>' }
  };

  var ITEMS = [];
  function add(type, id, name, dx, dy, kind) {
    ITEMS.push({ id: id, type: type, name: name, kind: kind || TYPES[type].kind, desc: "", pos: at(dx, dy) });
  }

  // Facultats
  add("faculty", "ciencies",    "Facultat de Ciències",                            -240,  120, "Facultat");
  add("faculty", "biociencies", "Facultat de Biociències",                         -150,  120, "Facultat");
  add("faculty", "medicina",    "Facultat de Medicina",                             -40,  120, "Facultat");
  add("faculty", "veterinaria", "Facultat de Veterinària",                           80,  120, "Facultat");
  add("faculty", "enginyeria",  "Escola d'Enginyeria",                              190,  120, "Escola");
  add("faculty", "filosofia",   "Facultat de Filosofia i Lletres",                 -240, -110, "Facultat");
  add("faculty", "psicologia",  "Facultat de Psicologia",                          -150, -110, "Facultat");
  add("faculty", "educacio",    "Facultat de Ciències de l'Educació",               -50, -110, "Facultat");
  add("faculty", "traduccio",   "Facultat de Traducció i d'Interpretació",           60, -110, "Facultat");
  add("faculty", "comunicacio", "Facultat de Ciències de la Comunicació",           170, -110, "Facultat");
  add("faculty", "dret",        "Facultat de Dret",                                -330,    0, "Facultat");
  add("faculty", "economia",    "Facultat d'Economia i Empresa",                    300,  100, "Facultat");
  add("faculty", "politiques",  "Facultat de Ciències Polítiques i de Sociologia", 300, -100, "Facultat");

  // Pàrquings (posicions i noms provisionals)
  add("parking", "pk-nord",    "Pàrquing Nord",    0,    230);
  add("parking", "pk-sud",     "Pàrquing Sud",     0,   -230);
  add("parking", "pk-est",     "Pàrquing Est",     400,    0);
  add("parking", "pk-oest",    "Pàrquing Oest",   -430,    0);
  add("parking", "pk-central", "Pàrquing Central", 120,   10);

  // Bars i cafeteries (posicions i noms provisionals)
  add("bar", "bar-ciencies",   "Bar de Ciències",    -195,   80);
  add("bar", "bar-medicina",   "Bar de Medicina",       5,   80);
  add("bar", "bar-enginyeria", "Bar d'Enginyeria",    150,   80);
  add("bar", "bar-lletres",    "Bar de Lletres",     -195,  -75);
  add("bar", "bar-comunicacio","Bar de Comunicació",  130,  -75);
  add("bar", "bar-placa",      "Cafeteria de la Plaça", 0,     0);

  /* ---------------------------------------------------------------
     Icones d'edifici (SVG), una per tipus
  --------------------------------------------------------------- */
  function iconFor(t) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
      '<circle cx="32" cy="32" r="29" fill="' + t.color + '" stroke="#ffffff" stroke-width="4"/>' +
      '<g transform="translate(14 14) scale(1.5)" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      t.glyph + '</g></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  var layer = new GraphicsLayer({ elevationInfo: { mode: "relative-to-scene" } });
  var byId = {};

  ITEMS.forEach(function (f) {
    var t = TYPES[f.type];
    if (!t.href) t.href = iconFor(t);
    var g = new Graphic({
      geometry: { type: "point", longitude: f.pos.lon, latitude: f.pos.lat, z: 0 },
      symbol: {
        type: "point-3d",
        symbolLayers: [{ type: "icon", resource: { href: t.href }, size: t.size, anchor: "bottom" }],
        verticalOffset: { screenLength: 46, maxWorldLength: 250, minWorldLength: 12 },
        callout: { type: "line", size: 1.5, color: t.color, border: { color: [255, 255, 255] } }
      },
      attributes: { id: f.id }
    });
    layer.add(g);
    byId[f.id] = { f: f, g: g };
  });

  /* ---------------------------------------------------------------
     Vista 3D: escena original d'OpenData UAB (amb mapa base de reserva)
  --------------------------------------------------------------- */
  var view;
  var tip = document.getElementById("tip");
  var warn = document.getElementById("warn");
  var editMode = location.hash === "#editar";
  window.addEventListener("hashchange", function () { location.reload(); });

  function start(map, isFallback) {
    var opts = { container: "view", map: map, qualityProfile: "medium" };
    if (isFallback) {
      opts.camera = { position: { longitude: CENTRE.lon, latitude: CENTRE.lat - 0.007, z: 900 }, tilt: 62, heading: 0 };
      warn.hidden = false;
      warn.textContent = "No s'ha pogut carregar l'escena 3D de la UAB; es mostra un mapa base de reserva.";
    }
    view = new SceneView(opts);
    map.add(layer);
    view.when(function () { wire(); });
  }

  var scene = new WebScene({ portalItem: { id: SCENE_ITEM_ID } });
  scene.load().then(function () { start(scene, false); })
    .catch(function () { start(new EsriMap({ basemap: "satellite", ground: "world-elevation" }), true); });

  /* ---------------------------------------------------------------
     Desplegable en passar el ratolí (o tocar en mòbil)
  --------------------------------------------------------------- */
  function showTip(f, x, y) {
    var kind = document.getElementById("tip-kind");
    kind.textContent = f.kind;
    kind.style.color = TYPES[f.type].color;
    document.getElementById("tip-name").textContent = f.name;
    document.getElementById("tip-desc").textContent = f.desc || "";
    tip.hidden = false;
    var w = 260, h = tip.offsetHeight || 170;
    var vw = window.innerWidth, vh = window.innerHeight;
    var left = Math.min(Math.max(x - w / 2, 10), vw - w - 10);
    var top = y + 22;
    if (top + h > vh - 10) top = Math.max(10, y - h - 50);
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideTip() { tip.hidden = true; }

  function hitItem(e) {
    return view.hitTest(e, { include: layer }).then(function (r) {
      var hit = r.results.filter(function (x) { return x.graphic && x.graphic.layer === layer; })[0];
      return hit ? byId[hit.graphic.attributes.id].f : null;
    });
  }

  var pinned = false;
  function wire() {
    view.on("pointer-move", function (e) {
      if (editMode || pinned) return;
      hitItem(e).then(function (f) {
        if (f) { view.container.style.cursor = "pointer"; showTip(f, e.x, e.y); }
        else { view.container.style.cursor = "default"; hideTip(); }
      });
    });
    view.on("click", function (e) {
      if (editMode) { place(e); return; }
      hitItem(e).then(function (f) {
        if (f) { pinned = true; showTip(f, e.x, e.y); }
        else { pinned = false; hideTip(); }
      });
    });
  }

  /* ---------------------------------------------------------------
     Filtre d'edificacions (panell dret)
  --------------------------------------------------------------- */
  var shown = {}, boxes = {};
  var filterEl = document.getElementById("filter");
  var filterList = document.getElementById("filter-list");
  if (window.innerWidth < 700) filterEl.open = false;

  Object.keys(TYPES).forEach(function (k) {
    var t = TYPES[k];
    var n = ITEMS.filter(function (f) { return f.type === k; }).length;
    var row = document.createElement("label");
    row.className = "frow";
    row.innerHTML = '<input type="checkbox" checked><span class="dot"></span><span class="fname"></span><span class="fcount">' + n + '</span>';
    var box = row.querySelector("input");
    box.style.accentColor = t.color;
    row.querySelector(".dot").style.background = t.color;
    row.querySelector(".fname").textContent = t.label;
    box.addEventListener("change", function () { shown[k] = box.checked; applyFilter(); });
    filterList.appendChild(row);
    shown[k] = true;
    boxes[k] = box;
  });

  function applyFilter() {
    ITEMS.forEach(function (f) { byId[f.id].g.visible = shown[f.type]; });
    pinned = false;
    hideTip();
  }
  function setAll(v) {
    Object.keys(boxes).forEach(function (k) { boxes[k].checked = v; shown[k] = v; });
    applyFilter();
  }
  document.getElementById("f-all").addEventListener("click", function () { setAll(true); });
  document.getElementById("f-none").addEventListener("click", function () { setAll(false); });

  /* ---------------------------------------------------------------
     Mode edició (#editar): situar cada element fent clic al mapa
  --------------------------------------------------------------- */
  if (editMode) {
    var panel = document.getElementById("edit");
    var sel = document.getElementById("edit-select");
    var out = document.getElementById("edit-out");
    panel.hidden = false;
    Object.keys(TYPES).forEach(function (k) {
      var og = document.createElement("optgroup");
      og.label = TYPES[k].label;
      ITEMS.forEach(function (f) {
        if (f.type !== k) return;
        var o = document.createElement("option"); o.value = f.id; o.textContent = f.name; og.appendChild(o);
      });
      sel.appendChild(og);
    });
    document.getElementById("edit-copy").addEventListener("click", function () {
      out.select();
      try { navigator.clipboard.writeText(out.value); } catch (err) { document.execCommand("copy"); }
    });
  }
  function refreshOut() {
    var rows = ITEMS.map(function (f) {
      return '{ id: "' + f.id + '", lon: ' + f.pos.lon + ", lat: " + f.pos.lat + " }";
    });
    document.getElementById("edit-out").value = rows.join(",\n");
  }
  function place(e) {
    var p = view.toMap(e);
    if (!p) return;
    var id = document.getElementById("edit-select").value;
    var item = byId[id];
    item.f.pos = { lon: +p.longitude.toFixed(6), lat: +p.latitude.toFixed(6) };
    item.g.geometry = { type: "point", longitude: item.f.pos.lon, latitude: item.f.pos.lat, z: 0 };
    refreshOut();
  }
  if (editMode) refreshOut();
});
