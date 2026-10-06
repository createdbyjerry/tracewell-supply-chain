/* Tracewell — natural gas supply chain prototype. Vanilla JS, no build step. */
(() => {
  // ---------- Icons ----------
  const ICONS = {
    upstream: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M12 3 7.5 21M12 3l4.5 18M9 15h6M10.4 9h3.2M5 21h14"/></svg>',
    midstream: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M3 9h3v6H3zM18 9h3v6h-3zM6 10.5h12M6 13.5h12"/></svg>',
    downstream: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M3 21V11l5 3v-3l5 3V8h3V4h3v17zM7 18h2M12 18h2"/></svg>',
    retail: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  };
  const UI = {
    close: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    co2: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/></svg>',
    flask: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5-10V3M7.5 15h9"/></svg>',
    gauge: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M4 18a8 8 0 1 1 16 0M12 18l4-5"/></svg>',
    flame: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-3.6-3-6-4-10.3-2 1.8-3 3.6-3 5.8-1-.6-1.8-1.6-2-2.8C7.5 9.3 5.5 11.8 5.5 15c0 3.5 2.5 6 6.5 6z"/></svg>',
    path: '<svg class="twsc-i" viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h7a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h7"/></svg>',
    waves: '<svg class="twsc-i" viewBox="0 0 24 24"><path d="M3 9c2 0 2-1.5 4.5-1.5S9.5 9 12 9s2.5-1.5 4.5-1.5S19 9 21 9M3 15c2 0 2-1.5 4.5-1.5S9.5 15 12 15s2.5-1.5 4.5-1.5S19 15 21 15"/></svg>',
    empty: '<svg class="twsc-i" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 11l7.4-3.8M8.3 13l7.4 3.8"/></svg>',
  };

  // ---------- Data ----------
  const well = (label) => ({ label, category: 'Upstream', iconType: 'upstream', ciScore: '0.0008', throughput: '130,000', unit: 'mcfd', methaneIntensity: '0.018%', coProducedCo2: '1.9%', status: 'Active' });
  const stage = (label, category, iconType, ciScore, throughput, unit) => ({ label, category, iconType, ciScore, throughput, unit, status: 'Active' });

  function buildTwin() {
    const nodes = [], edges = [];
    const wellIds = ['W1', 'W2', 'W3', 'W4', 'W5'];
    wellIds.forEach((id, i) => nodes.push({ id, type: 'custom', data: well(`Well Pad ${i + 1}`), x: 50, y: i * 150 }));
    nodes.push({ id: 'CDP', type: 'custom', data: stage('CDP', 'Midstream', 'midstream', '13.4', '6,000', 'MMcf/d'), x: 400, y: 300 });
    wellIds.forEach(w => edges.push({ source: w, target: 'CDP' }));
    nodes.push({ id: 'PlantA', type: 'custom', data: stage('Processing Plant A', 'Downstream', 'downstream', '49.2', '5,800', 'MMcf/d'), x: 750, y: 300 });
    edges.push({ source: 'CDP', target: 'PlantA' });
    nodes.push({ id: 'PlantB', type: 'custom', data: stage('Processing Plant B', 'Downstream', 'downstream', '43.6', '5,600', 'MMcf/d'), x: 1100, y: 300 });
    edges.push({ source: 'PlantA', target: 'PlantB' });
    nodes.push({ id: 'Pipeline', type: 'custom', data: stage('Interstate Pipeline', 'Midstream', 'midstream', '8.9', '5,500', 'MMcf/d'), x: 1450, y: 300 });
    edges.push({ source: 'PlantB', target: 'Pipeline' });
    ['G1', 'G2', 'G3', 'G4', 'G5'].forEach((id, i) => {
      nodes.push({ id, type: 'custom', x: 1800, y: i * 150, data: {
        label: `Genset ${i + 1}`, category: 'End Use', iconType: 'retail', ciScore: '0.41', throughput: '3,360', unit: 'MWh',
        gasUsed: '25,808', gasUsedUnit: 'mmbtu', status: 'Active', sourceWells: wellIds.map((_, k) => `Well Pad ${k + 1}`) } });
      edges.push({ source: 'Pipeline', target: id });
    });
    return { name: 'Well pad to data center', nodes, edges };
  }

  function buildWellPad() {
    const nodes = [], edges = [];
    const wells = ['Well1', 'Well2', 'Well3', 'Well4'], seps = ['Sep1', 'Sep2', 'Sep3', 'Sep4'];
    const sepCi = ['5.6', '6.1', '5.3', '6.8'];
    wells.forEach((id, i) => nodes.push({ id, type: 'custom', data: well(`Well ${i + 1}`), x: 50, y: i * 200 }));
    seps.forEach((id, i) => {
      nodes.push({ id, type: 'custom', data: stage(`Separator ${i + 1}`, 'Processing', 'midstream', sepCi[i], '450', 'MMcf/d'), x: 400, y: i * 200 });
      edges.push({ source: wells[i], target: id });
      if (i < seps.length - 1) edges.push({ source: id, target: seps[i + 1], sourceHandle: 'bottom', targetHandle: 'top', label: 'water' });
    });
    nodes.push({ id: 'IsolatedSep', type: 'custom', data: stage('Separator', 'Processing', 'midstream', '4.2', '100', 'MMcf/d'), x: 400, y: 800 });
    edges.push({ source: 'Sep4', target: 'IsolatedSep', sourceHandle: 'bottom', targetHandle: 'top', label: 'water' });
    nodes.push({ id: 'Cooler', type: 'custom', data: stage('Cooler', 'Cooling', 'downstream', '15.5', '1,800', 'MMcf/d'), x: 800, y: 300 });
    seps.forEach(s => edges.push({ source: s, target: 'Cooler' }));
    nodes.push({ id: 'WaterTank', type: 'circle', data: { label: 'Water Tank', category: 'Storage' }, x: 1100, y: 1000 });
    edges.push({ source: 'IsolatedSep', target: 'WaterTank', sourceHandle: 'bottom', targetHandle: 'top' });
    nodes.push({ id: 'ProducedWaterTerminal', type: 'blank', data: { label: '' }, x: 1400, y: 1035 });
    edges.push({ source: 'WaterTank', target: 'ProducedWaterTerminal', sourceHandle: 'right', targetHandle: 'left', label: 'Produced Water' });
    nodes.push({ id: 'SalesMeterLP', type: 'circle', data: { label: 'Sales Meter', category: 'Metering' }, x: 1100, y: 800 });
    edges.push({ source: 'IsolatedSep', target: 'SalesMeterLP', sourceHandle: 'right', targetHandle: 'left' });
    nodes.push({ id: 'LPSalesTerminal', type: 'blank', data: { label: '' }, x: 1400, y: 835 });
    edges.push({ source: 'SalesMeterLP', target: 'LPSalesTerminal', sourceHandle: 'right', targetHandle: 'left', label: 'Low Pressure Sales Line' });
    nodes.push({ id: 'SalesMeterHP', type: 'circle', data: { label: 'Sales Meter', category: 'Metering' }, x: 1100, y: 300 });
    edges.push({ source: 'Cooler', target: 'SalesMeterHP', sourceHandle: 'right', targetHandle: 'left' });
    nodes.push({ id: 'HPSalesTerminal', type: 'blank', data: { label: '' }, x: 1400, y: 335 });
    edges.push({ source: 'SalesMeterHP', target: 'HPSalesTerminal', sourceHandle: 'right', targetHandle: 'left', label: 'High Pressure Sales Line' });
    return { name: 'Well pad flow', nodes, edges };
  }

  const FLOWS = { twin: buildTwin(), wellpad: buildWellPad() };
  let flow = FLOWS.twin;
  let viewKey = 'twin';
  let selectedId = null;
  const T = { x: 0, y: 0, k: 1 };

  // ---------- Data sources ----------
  // Where each stage's data comes from and how often it refreshes.
  // Replace minutesAgo with a real timestamp (lastPulled: '2026-09-30T14:00:00Z') when wiring live feeds.
  const DATA_SOURCES = {
    'Upstream':   { name: 'Well pad SCADA telemetry', via: 'Operator production historian', everyMin: 60, minutesAgo: 18 },
    'Midstream':  { name: 'Midstream meter and nomination data', via: 'Pipeline operator EDI feed', everyMin: 1440, minutesAgo: 410 },
    'Downstream': { name: 'Processing plant emissions report', via: 'Plant environmental system', everyMin: 1440, minutesAgo: 655 },
    'Processing': { name: 'Separator SCADA telemetry', via: 'Facility control system', everyMin: 60, minutesAgo: 22 },
    'Cooling':    { name: 'Compressor and cooler telemetry', via: 'Facility control system', everyMin: 60, minutesAgo: 22 },
    'Metering':   { name: 'Custody transfer meter readings', via: 'Electronic flow meter export', everyMin: 15, minutesAgo: 6 },
    'Storage':    { name: 'Tank gauge readings', via: 'Automatic tank gauging', everyMin: 240, minutesAgo: 95 },
    'End Use':    { name: 'Genset fuel and output meters', via: 'Data center building management system', everyMin: 60, minutesAgo: 9 },
  };
  const LOADED_AT = Date.now();
  function sourceTimes(src) {
    const last = src.lastPulled ? new Date(src.lastPulled).getTime() : LOADED_AT - src.minutesAgo * 60000;
    let next = last + src.everyMin * 60000;
    while (next < Date.now()) next += src.everyMin * 60000;
    return { last, next };
  }
  const fmtWhen = t => new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  function fmtRel(t) {
    const m = Math.round((t - Date.now()) / 60000), a = Math.abs(m);
    const txt = a < 1 ? 'now' : a < 60 ? `${a} min` : a < 1440 ? `${Math.floor(a / 60)} hr ${a % 60 ? (a % 60) + ' min' : ''}`.trim() : `${Math.round(a / 1440)} days`;
    return txt === 'now' ? 'just now' : m < 0 ? `${txt} ago` : `in ${txt}`;
  }
  const fmtEvery = n => n < 60 ? `every ${n} min` : n < 1440 ? (n === 60 ? 'hourly' : `every ${n / 60} hr`) : n === 1440 ? 'daily' : `every ${n / 1440} days`;
  function sourceBox(title, name, via, last, next, every) {
    return `<div class="twsc-source" aria-label="${esc(title)}"><h3><svg class="twsc-i" viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>${esc(title)}</h3><dl>
      <div><dt>Pulled from</dt><dd>${esc(name)}<small>${esc(via)}</small></dd></div>
      <div><dt>Last pulled</dt><dd>${fmtWhen(last)}<small>${fmtRel(last)}</small></dd></div>
      <div><dt>Next update</dt><dd class="twsc-due">${fmtWhen(next)}<small>${fmtRel(next)}${every ? `, refreshes ${esc(every)}` : ''}</small></dd></div>
    </dl></div>`;
  }

  const ciUnit = d => d.category === 'End Use' ? 'MT/MWh' : d.category === 'Upstream' ? 'MT/mcf' : 'gCO2e/MJ';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const root = document.getElementById('twsc-root');
  if (!root) { console.warn('[twsc] No #twsc-root element found on this page.'); return; }
  // Inject the widget markup when the host page only provides an empty #twsc-root (e.g. a Webflow embed).
  if (!root.querySelector('.twsc-app')) root.innerHTML = `
<div class="twsc-app">
  <header class="twsc-topbar">
    <div class="twsc-brand"><small>Tracewell</small><strong>Natural gas supply chain</strong></div>
    <nav class="twsc-tabs" role="tablist" aria-label="Views">
      <button class="twsc-tab" role="tab" data-view="twin" aria-selected="true">Well pad to data center</button>
      <button class="twsc-tab" role="tab" data-view="wellpad" aria-selected="false">Well pad flow</button>
    </nav>
    <button class="twsc-theme" id="twsc-themeToggle" type="button" role="switch" aria-checked="false" aria-label="Dark theme">
      <span class="twsc-theme-thumb" aria-hidden="true"></span>
      <svg class="twsc-i twsc-theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg class="twsc-i twsc-theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>
    </button>
  </header>

  <div class="twsc-main" id="twsc-flowView">
    <aside class="twsc-inspector twsc-is-empty" id="twsc-inspector" aria-label="Node inspector" aria-live="polite"></aside>
    <button class="twsc-panel-toggle" id="twsc-panelToggle" type="button" aria-controls="twsc-inspector" aria-expanded="true" aria-label="Collapse side panel" title="Collapse side panel">
      <svg class="twsc-i twsc-pt-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
      <svg class="twsc-i twsc-pt-panel" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></svg>
    </button>

    <section class="twsc-canvas" id="twsc-canvas" aria-label="Supply chain graph">
      <div class="twsc-world" id="twsc-world">
        <svg class="twsc-edges" id="twsc-edges" aria-hidden="true"></svg>
        <div id="twsc-labels"></div>
        <div id="twsc-nodes"></div>
      </div>
      <p class="twsc-hint twsc-ui" id="twsc-hint">Select any stage to trace where its gas came from and where it goes. Drag to pan, scroll to zoom.</p>
      <div class="twsc-controls twsc-ui" role="group" aria-label="Zoom controls">
        <button id="twsc-zoomIn" title="Zoom in" aria-label="Zoom in"><svg class="twsc-i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
        <button id="twsc-zoomOut" title="Zoom out" aria-label="Zoom out"><svg class="twsc-i" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
        <button id="twsc-fitBtn" title="Fit view" aria-label="Fit view"><svg class="twsc-i" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
      </div>
      <div class="twsc-minimap twsc-ui" id="twsc-minimap" aria-hidden="true"><svg id="twsc-miniSvg"></svg></div>
    </section>
  </div>

</div>`;
  const $ = s => root.querySelector(s);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme ----------
  // Light by default. The visitor's choice is remembered in localStorage (shared with design-system.html).
  // A host page can also preset data-theme="dark" on #twsc-root; a saved choice still wins.
  const THEME_KEY = 'twsc-theme';
  const themeToggle = $('#twsc-themeToggle');
  const isTheme = t => t === 'light' || t === 'dark';
  function savedTheme() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }
  function applyTheme(t) {
    root.dataset.theme = t;
    if (!themeToggle) return; // host supplied its own markup without the toggle
    themeToggle.setAttribute('aria-checked', String(t === 'dark'));
    themeToggle.title = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }
  const saved = savedTheme();
  applyTheme(isTheme(saved) ? saved : isTheme(root.dataset.theme) ? root.dataset.theme : 'light');
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked: theme still applies for this visit */ }
  });

  // ---------- Side panel collapse ----------
  // Expanded by default. The visitor's choice is remembered like the theme (key twsc-panel).
  const PANEL_KEY = 'twsc-panel';
  const app = $('.twsc-app'), panelToggle = $('#twsc-panelToggle');
  const isMobile = () => matchMedia('(max-width: 900px)').matches;
  function setPanel(open, remember) {
    app.classList.toggle('twsc-panel-collapsed', !open);
    if (panelToggle) {
      panelToggle.setAttribute('aria-expanded', String(open));
      const label = open ? 'Collapse side panel' : 'Expand side panel';
      panelToggle.setAttribute('aria-label', label); panelToggle.title = label;
    }
    if (remember) { try { localStorage.setItem(PANEL_KEY, open ? 'open' : 'collapsed'); } catch { /* storage blocked */ } }
  }
  const panelOpen = () => !app.classList.contains('twsc-panel-collapsed');
  let savedPanel = null; try { savedPanel = localStorage.getItem(PANEL_KEY); } catch { /* storage blocked */ }
  setPanel(savedPanel !== 'collapsed', false);
  panelToggle?.addEventListener('click', () => setPanel(!panelOpen(), true));

  const canvas = $('#twsc-canvas'), world = $('#twsc-world'), edgesSvg = $('#twsc-edges'), labelsEl = $('#twsc-labels'), nodesEl = $('#twsc-nodes');
  const inspector = $('#twsc-inspector');
  const SVGNS = 'http://www.w3.org/2000/svg';

  const nodeById = id => flow.nodes.find(n => n.id === id);

  // ---------- Graph render ----------
  function renderGraph() {
    nodesEl.innerHTML = ''; labelsEl.innerHTML = ''; edgesSvg.innerHTML = '';
    for (const n of flow.nodes) {
      const el = document.createElement('div');
      el.className = 'twsc-node twsc-node-' + n.type;
      el.dataset.id = n.id;
      if (n.type === 'custom') {
        el.innerHTML = `<span class="twsc-handle twsc-h-left"></span><span class="twsc-handle twsc-h-top"></span>
          <div class="twsc-nc-icon">${ICONS[n.data.iconType] || ICONS.downstream}</div>
          <div><div class="twsc-nc-cat">${esc(n.data.category)}</div><div class="twsc-nc-label">${esc(n.data.label)}</div></div>
          <span class="twsc-handle twsc-h-right"></span><span class="twsc-handle twsc-h-bottom"></span>`;
      } else if (n.type === 'circle') {
        el.innerHTML = `<span class="twsc-handle twsc-h-top"></span><span class="twsc-handle twsc-h-left"></span>${esc(n.data.label)}<span class="twsc-handle twsc-h-bottom"></span><span class="twsc-handle twsc-h-right"></span>`;
      }
      if (n.type !== 'blank') {
        el.tabIndex = 0; el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `${n.data.label}, ${n.data.category}`);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n.id); } });
      }
      el.style.left = n.x + 'px'; el.style.top = n.y + 'px';
      n.el = el;
      nodesEl.appendChild(el);
    }
    for (const n of flow.nodes) { n.w = n.el.offsetWidth; n.h = n.el.offsetHeight; }
    for (const e of flow.edges) {
      e.el = document.createElementNS(SVGNS, 'path');
      edgesSvg.appendChild(e.el);
      if (e.label) { e.labelEl = document.createElement('div'); e.labelEl.className = 'twsc-elabel'; e.labelEl.textContent = e.label; labelsEl.appendChild(e.labelEl); }
      else e.labelEl = null;
    }
    updateEdges();
    applyHighlight();
  }

  function handlePoint(n, side) {
    switch (side) {
      case 'left': return { x: n.x, y: n.y + n.h / 2 };
      case 'right': return { x: n.x + n.w, y: n.y + n.h / 2 };
      case 'top': return { x: n.x + n.w / 2, y: n.y };
      default: return { x: n.x + n.w / 2, y: n.y + n.h };
    }
  }

  function stepPoints(s, sp, t, tp) {
    const off = 20;
    if (sp === 'right' && tp === 'left') {
      if (Math.abs(s.y - t.y) < 0.5) return [s, t];
      if (t.x >= s.x + 2 * off) { const mx = (s.x + t.x) / 2; return [s, { x: mx, y: s.y }, { x: mx, y: t.y }, t]; }
      const my = (s.y + t.y) / 2;
      return [s, { x: s.x + off, y: s.y }, { x: s.x + off, y: my }, { x: t.x - off, y: my }, { x: t.x - off, y: t.y }, t];
    }
    if (sp === 'bottom' && tp === 'top') {
      if (Math.abs(s.x - t.x) < 0.5) return [s, t];
      if (t.y >= s.y + 2 * off) { const my = (s.y + t.y) / 2; return [s, { x: s.x, y: my }, { x: t.x, y: my }, t]; }
      const mx = (s.x + t.x) / 2;
      return [s, { x: s.x, y: s.y + off }, { x: mx, y: s.y + off }, { x: mx, y: t.y - off }, { x: t.x, y: t.y - off }, t];
    }
    if (sp === 'right' && tp === 'top') return [s, { x: t.x, y: s.y }, t];
    if (sp === 'bottom' && tp === 'left') return [s, { x: s.x, y: t.y }, t];
    const mx = (s.x + t.x) / 2;
    return [s, { x: mx, y: s.y }, { x: mx, y: t.y }, t];
  }

  function roundedPath(pts, r = 8) {
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      const d1 = Math.hypot(p1.x - p0.x, p1.y - p0.y), d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (d1 < 0.01 || d2 < 0.01) { d += ` L${p1.x},${p1.y}`; continue; }
      const rr = Math.min(r, d1 / 2, d2 / 2);
      const a = { x: p1.x + (p0.x - p1.x) / d1 * rr, y: p1.y + (p0.y - p1.y) / d1 * rr };
      const b = { x: p1.x + (p2.x - p1.x) / d2 * rr, y: p1.y + (p2.y - p1.y) / d2 * rr };
      d += ` L${a.x},${a.y} Q${p1.x},${p1.y} ${b.x},${b.y}`;
    }
    const last = pts[pts.length - 1];
    return d + ` L${last.x},${last.y}`;
  }

  function updateEdges(onlyNodeId) {
    for (const e of flow.edges) {
      if (onlyNodeId && e.source !== onlyNodeId && e.target !== onlyNodeId) continue;
      const s = nodeById(e.source), t = nodeById(e.target);
      const sp = e.sourceHandle || (s.type === 'circle' ? 'bottom' : 'right');
      const tp = e.targetHandle || (t.type === 'circle' ? 'top' : 'left');
      const pts = stepPoints(handlePoint(s, sp), sp, handlePoint(t, tp), tp);
      e.el.setAttribute('d', roundedPath(pts));
      if (e.labelEl) {
        const len = e.el.getTotalLength();
        const m = e.el.getPointAtLength(len / 2);
        e.labelEl.style.left = m.x + 'px'; e.labelEl.style.top = m.y + 'px';
      }
    }
  }

  // ---------- Lineage ----------
  function walk(startId, dir) {
    const out = new Set(), queue = [startId];
    while (queue.length) {
      const cur = queue.shift();
      for (const e of flow.edges) {
        const next = dir === 'up' ? (e.target === cur ? e.source : null) : (e.source === cur ? e.target : null);
        if (next && !out.has(next) && next !== startId) { out.add(next); queue.push(next); }
      }
    }
    return out;
  }
  function depthOrder(ids) {
    // order by longest distance from any root so the list reads source → sink
    const depth = {};
    const d = id => {
      if (depth[id] != null) return depth[id];
      depth[id] = 0;
      const parents = flow.edges.filter(e => e.target === id).map(e => e.source);
      depth[id] = parents.length ? 1 + Math.max(...parents.map(d)) : 0;
      return depth[id];
    };
    return [...ids].sort((a, b) => d(a) - d(b) || nodeById(a).y - nodeById(b).y);
  }

  function applyHighlight() {
    if (!selectedId) {
      flow.nodes.forEach(n => n.el.classList.remove('twsc-dim', 'twsc-selected'));
      flow.edges.forEach(e => { e.el.setAttribute('class', 'twsc-edge twsc-animated'); e.labelEl && e.labelEl.classList.remove('twsc-dim'); });
      return;
    }
    const up = walk(selectedId, 'up'), down = walk(selectedId, 'down');
    const lit = new Set([selectedId, ...up, ...down]);
    flow.nodes.forEach(n => { n.el.classList.toggle('twsc-selected', n.id === selectedId); n.el.classList.toggle('twsc-dim', !lit.has(n.id)); });
    flow.edges.forEach(e => {
      const upEdge = up.has(e.source) && (e.target === selectedId || up.has(e.target));
      const downEdge = (e.source === selectedId || down.has(e.source)) && down.has(e.target);
      const on = upEdge || downEdge;
      e.el.setAttribute('class', on ? 'twsc-edge twsc-animated twsc-lit' : 'twsc-edge twsc-dim');
      e.labelEl && e.labelEl.classList.toggle('twsc-dim', !on);
    });
  }

  // ---------- Inspector ----------
  function statBlock(icon, title, value, unit, hero) {
    return `<div class="twsc-section"><div class="twsc-stat-head">${icon}${esc(title)}</div>
      <div class="twsc-stat${hero ? ' twsc-hero' : ''}"><b>${esc(value)}</b>${unit ? `<span>${esc(unit)}</span>` : ''}</div></div>`;
  }
  function pathList(ids) {
    return `<ul class="twsc-path-list">${ids.map(id => {
      const n = nodeById(id), d = n.data;
      const ci = d.ciScore ? `${esc(d.ciScore)} ${esc(ciUnit(d))}` : 'No CI data';
      return `<li><button data-goto="${esc(id)}"><span class="twsc-pl-name">${esc(d.label)}<small>${esc(d.category)}</small></span><span class="twsc-pl-ci">${ci}</span></button></li>`;
    }).join('')}</ul>`;
  }

  function renderInspector() {
    const n = selectedId && nodeById(selectedId);
    inspector.classList.toggle('twsc-is-empty', !n);
    if (!n) {
      inspector.dataset.for = '';
      const cats = [...new Set(flow.nodes.filter(x => x.type !== 'blank').map(x => x.data.category))].filter(c => DATA_SOURCES[c]);
      const times = cats.map(c => sourceTimes(DATA_SOURCES[c]));
      const last = Math.max(...times.map(t => t.last)), next = Math.min(...times.map(t => t.next));
      inspector.innerHTML = `<div class="twsc-insp-rest"><div class="twsc-insp-empty">${UI.empty}<p>Select a node to inspect its carbon data.</p></div>
        ${sourceBox('Data sources for this view', `${cats.length} feeds`, cats.map(c => DATA_SOURCES[c].name).join(', '), last, next)}</div>`;
      return;
    }
    const d = n.data;
    const up = depthOrder([...walk(n.id, 'up')].filter(id => nodeById(id).type !== 'blank'));
    const down = depthOrder([...walk(n.id, 'down')].filter(id => nodeById(id).type !== 'blank'));
    let h = `<button class="twsc-insp-close" id="twsc-inspClose" aria-label="Close inspector">${UI.close}</button>
      <div class="twsc-insp"><p class="twsc-insp-kicker">Node inspector</p><h2>${esc(d.label)}</h2><p class="twsc-insp-cat">${esc(d.category)}</p><div class="twsc-rule"></div>`;
    if (d.sourceWells) {
      h += `<div class="twsc-section twsc-trace"><div class="twsc-stat-head" style="color:var(--twsc-primary)">${UI.waves}Traceability: source</div>
        <p>This product's natural gas is traced back to:</p>
        <div class="twsc-chips">${d.sourceWells.map(w => { const wn = flow.nodes.find(x => x.data.label === w); return `<button class="twsc-chip" ${wn ? `data-goto="${esc(wn.id)}"` : ''}>${esc(w)}</button>`; }).join('')}</div></div>`;
    }
    if (d.ciScore) h += statBlock(UI.co2, 'Carbon intensity (CI) score', d.ciScore, ciUnit(d), true);
    else h += `<div class="twsc-section"><div class="twsc-stat-head">${UI.co2}Carbon intensity (CI) score</div><p class="twsc-note">No carbon data is recorded at this point yet. Its emissions are carried by the stages upstream of it.</p></div>`;
    if (d.methaneIntensity || d.coProducedCo2) {
      h += `<div class="twsc-section twsc-stat-pair">
        ${d.methaneIntensity ? `<div><div class="twsc-stat-head">${UI.flask}Methane intensity</div><div class="twsc-stat"><b>${esc(d.methaneIntensity)}</b></div></div>` : ''}
        ${d.coProducedCo2 ? `<div><div class="twsc-stat-head">${UI.flask}Co-produced CO2</div><div class="twsc-stat"><b>${esc(d.coProducedCo2)}</b></div></div>` : ''}</div>`;
    }
    if (d.throughput) h += statBlock(UI.gauge, d.category === 'End Use' ? 'Daily output' : 'Daily throughput', d.throughput, d.unit);
    if (d.gasUsed) h += statBlock(UI.flame, 'Natural gas used', d.gasUsed, d.gasUsedUnit);
    if (d.status) h += `<div class="twsc-section"><div class="twsc-stat-head">Operational status</div><span class="twsc-status">${esc(d.status)}</span></div>`;
    if (up.length) h += `<div class="twsc-section"><div class="twsc-stat-head">${UI.path}Upstream path (${up.length})</div>${pathList(up)}</div>`;
    if (down.length) h += `<div class="twsc-section"><div class="twsc-stat-head">${UI.path}Downstream path (${down.length})</div>${pathList(down)}</div>`;
    const src = DATA_SOURCES[d.category];
    if (src) { const t = sourceTimes(src); h += sourceBox('Data source', src.name, src.via, t.last, t.next, fmtEvery(src.everyMin)); }
    h += `</div>`;
    const keepScroll = inspector.dataset.for === n.id ? inspector.scrollTop : 0;
    inspector.innerHTML = h;
    inspector.dataset.for = n.id;
    inspector.scrollTop = keepScroll;
  }
  inspector.addEventListener('click', e => {
    if (e.target.closest('#twsc-inspClose')) return select(null);
    const g = e.target.closest('[data-goto]');
    if (g) { select(g.dataset.goto); centerOn(g.dataset.goto); }
  });

  function select(id) {
    selectedId = id;
    if (id && !panelOpen()) setPanel(true, false); // inspecting a node brings the panel back
    applyHighlight();
    renderInspector();
    $('#twsc-hint').hidden = !!id;
  }

  // ---------- Viewport ----------
  function applyT() {
    world.style.transform = `translate(${T.x}px, ${T.y}px) scale(${T.k})`;
    canvas.style.backgroundSize = `${20 * T.k}px ${20 * T.k}px`;
    canvas.style.backgroundPosition = `${T.x}px ${T.y}px`;
    renderMinimap();
  }
  function bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const n of flow.nodes) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + n.w); y1 = Math.max(y1, n.y + n.h); }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function animateTo(target, dur = 450) {
    if (reduceMotion || !dur) { Object.assign(T, target); return applyT(); }
    const from = { ...T }, t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      T.x = from.x + (target.x - from.x) * e; T.y = from.y + (target.y - from.y) * e; T.k = from.k + (target.k - from.k) * e;
      applyT();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  // The part of the canvas not covered by the floating app bar and side panel.
  function viewArea() {
    const r = canvas.getBoundingClientRect();
    const bar = $('.twsc-topbar').getBoundingClientRect();
    const top = Math.max(0, bar.bottom - r.top);
    let left = 0;
    if (!isMobile() && panelOpen()) left = Math.max(0, inspector.getBoundingClientRect().right - r.left);
    return { x: left, y: top, w: r.width - left, h: r.height - top };
  }
  function fit(dur) {
    const a = viewArea(), b = bounds(), pad = 0.07;
    const k = clamp(Math.min(a.w / (b.w * (1 + 2 * pad)), a.h / (b.h * (1 + 2 * pad))), 0.15, 1.5);
    animateTo({ k, x: a.x + a.w / 2 - (b.x + b.w / 2) * k, y: a.y + a.h / 2 - (b.y + b.h / 2) * k }, dur);
  }
  function centerOn(id) {
    const n = nodeById(id), a = viewArea();
    const k = Math.max(T.k, 0.7);
    animateTo({ k, x: a.x + a.w / 2 - (n.x + n.w / 2) * k, y: a.y + a.h / 2 - (n.y + n.h / 2) * k });
  }
  function zoomAt(px, py, k) {
    k = clamp(k, 0.15, 2.5);
    const wx = (px - T.x) / T.k, wy = (py - T.y) / T.k;
    T.k = k; T.x = px - wx * k; T.y = py - wy * k; applyT();
  }
  function zoomCenter(f) {
    const r = canvas.getBoundingClientRect(), px = r.width / 2, py = r.height / 2;
    const k = clamp(T.k * f, 0.15, 2.5), wx = (px - T.x) / T.k, wy = (py - T.y) / T.k;
    animateTo({ k, x: px - wx * k, y: py - wy * k }, 200);
  }
  $('#twsc-zoomIn').onclick = () => zoomCenter(1.25);
  $('#twsc-zoomOut').onclick = () => zoomCenter(0.8);
  $('#twsc-fitBtn').onclick = () => fit(700);

  canvas.addEventListener('wheel', e => {
    if (e.target.closest('.twsc-minimap')) return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, T.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
  }, { passive: false });

  // Pointer: pan, node drag, pinch
  const pointers = new Map();
  let gesture = null;
  canvas.addEventListener('pointerdown', e => {
    if (e.target.closest('.twsc-ui')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      gesture = { type: 'pinch', dist: Math.hypot(a.x - b.x, a.y - b.y), k: T.k };
      return;
    }
    const nodeEl = e.target.closest('.twsc-node');
    if (nodeEl && !nodeEl.classList.contains('twsc-node-blank')) {
      const n = nodeById(nodeEl.dataset.id);
      gesture = { type: 'node', n, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y, moved: false };
    } else {
      gesture = { type: 'pan', sx: e.clientX, sy: e.clientY, ox: T.x, oy: T.y, moved: false };
    }
  });
  canvas.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gesture) return;
    if (gesture.type === 'pinch' && pointers.size === 2) {
      const [a, b] = [...pointers.values()], r = canvas.getBoundingClientRect();
      zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, gesture.k * Math.hypot(a.x - b.x, a.y - b.y) / gesture.dist);
      return;
    }
    const dx = e.clientX - gesture.sx, dy = e.clientY - gesture.sy;
    if (!gesture.moved && Math.hypot(dx, dy) < 4) return;
    gesture.moved = true;
    if (gesture.type === 'node') {
      const n = gesture.n;
      n.x = gesture.ox + dx / T.k; n.y = gesture.oy + dy / T.k;
      n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px';
      updateEdges(n.id); renderMinimap();
    } else if (gesture.type === 'pan') {
      canvas.classList.add('twsc-panning');
      T.x = gesture.ox + dx; T.y = gesture.oy + dy; applyT();
    }
  });
  const endPointer = e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    canvas.classList.remove('twsc-panning');
    if (!gesture) return;
    if (e.type === 'pointerup' && !gesture.moved) {
      if (gesture.type === 'node') select(gesture.n.id);
      else if (gesture.type === 'pan') select(null);
    }
    gesture = null;
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);

  // ---------- Minimap ----------
  const mini = $('#twsc-miniSvg');
  function renderMinimap() {
    if (!flow.nodes[0] || flow.nodes[0].w == null) return;
    const r = canvas.getBoundingClientRect(), b = bounds();
    const vx = -T.x / T.k, vy = -T.y / T.k, vw = r.width / T.k, vh = r.height / T.k;
    const x0 = Math.min(b.x, vx), y0 = Math.min(b.y, vy), x1 = Math.max(b.x + b.w, vx + vw), y1 = Math.max(b.y + b.h, vy + vh);
    const pad = 40, W = x1 - x0 + pad * 2, H = y1 - y0 + pad * 2;
    mini.setAttribute('viewBox', `${x0 - pad} ${y0 - pad} ${W} ${H}`);
    const sw = W / 200;
    let s = '';
    for (const n of flow.nodes) {
      if (n.type === 'blank') continue;
      const isSel = n.id === selectedId;
      s += n.type === 'circle'
        ? `<circle cx="${n.x + n.w / 2}" cy="${n.y + n.h / 2}" r="${n.w / 2}" style="fill:var(--twsc-surface-2);stroke:var(--twsc-border);stroke-width:${sw * 1.5}px"/>`
        : `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${8}" style="fill:${isSel ? 'var(--twsc-primary)' : 'var(--twsc-surface)'};stroke:var(--twsc-primary);stroke-width:${sw * 1.5}px"/>`;
    }
    const big = `M${x0 - pad * 10},${y0 - pad * 10}h${W * 3}v${H * 3}h${-W * 3}z`;
    s += `<path d="${big} M${vx},${vy}h${vw}v${vh}h${-vw}z" style="fill:var(--twsc-mask);fill-rule:evenodd"/>`;
    s += `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" style="fill:none;stroke:var(--twsc-faint);stroke-width:${sw}px"/>`;
    mini.innerHTML = s;
  }
  let miniDrag = false;
  const miniMove = e => {
    const pt = mini.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const w = pt.matrixTransform(mini.getScreenCTM().inverse()), r = canvas.getBoundingClientRect();
    T.x = r.width / 2 - w.x * T.k; T.y = r.height / 2 - w.y * T.k; applyT();
  };
  $('#twsc-minimap').addEventListener('pointerdown', e => { miniDrag = true; e.currentTarget.setPointerCapture(e.pointerId); miniMove(e); });
  $('#twsc-minimap').addEventListener('pointermove', e => { if (miniDrag) miniMove(e); });
  $('#twsc-minimap').addEventListener('pointerup', () => { miniDrag = false; });

  // ---------- Views ----------
  function setView(key) {
    root.querySelectorAll('.twsc-tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.view === key)));
    viewKey = key; flow = FLOWS[key];
    const el0 = flow.nodes[0].el;
    if (!el0 || !el0.isConnected) { selectedId = null; renderGraph(); renderInspector(); $('#twsc-hint').hidden = false; fit(0); }
    else requestAnimationFrame(() => applyT());
  }
  root.querySelectorAll('.twsc-tab').forEach(t => t.addEventListener('click', () => setView(t.dataset.view)));

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (selectedId) select(null);
  });
  window.addEventListener('resize', () => renderMinimap());

  // ---------- Boot ----------
  const boot = () => { renderGraph(); renderInspector(); fit(0); setInterval(renderInspector, 60000); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);
})();
