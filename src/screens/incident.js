import { shell } from '../layout.js';
import iconPerformScan from '../icons/button-icons/grain.svg?raw';
import iconDropdownArrow from '../icons/incident-page/dropdown-arrow.svg?raw';
import iconFilter from '../icons/SearchBarRow/filter-icon.svg?raw';
import tapeRingUrl from '../icons/incident-page/circle_v2.png?url';

/** Square side (rem) for the rotating ring image; red node is sized from this. 85px at 16px root. */
const DB_CORE_TAPE_BOX_REM = 5.3125;
/**
 * Red fill: circumference = this × (π × tape box side) — i.e. diameter = scale × tape box.
 * Tune to match the PNG inner opening (smaller = tighter to the ring hole).
 */
const DB_CORE_RED_CIRCUMFERENCE_SCALE = 0.62;

/**
 * Optical centering nudge for the ring PNG (applied before rotation). Same units as SVG lengths
 * (e.g. `0`, `1px`, `0.0625rem`). Adjust if the ring looks off-center while spinning.
 */
const DB_CORE_TAPE_IMAGE_NUDGE_X = '0';
const DB_CORE_TAPE_IMAGE_NUDGE_Y = '0';

function escHtmlAttr(raw) {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function renderIncident() {
  const dbCoreTapeHalfRem = DB_CORE_TAPE_BOX_REM / 2;
  const dbCoreRedRadiusRem = (DB_CORE_TAPE_BOX_REM * DB_CORE_RED_CIRCUMFERENCE_SCALE) / 2;
  const content = `
    <section class="incident-page">
      <div class="page-head incident-header">
        <div class="incident-header-utc">
          <div class="page-head-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span data-utc-live>00:00:00 UTC</span>
          </div>
        </div>
        <div class="incident-header-body">
          <div class="incident-actions">
            <div class="incident-actions-main">
              <div class="incident-title-wrap">
                <h1 class="page-title incident-title">
                  #8846 — DNS Loop &amp; Port Scan Correlation
                </h1>
              </div>
              <div class="incident-header-tags">
                <span class="btn btn-dark incident-status-btn"><span class="incident-risk-dot" aria-hidden="true"></span>High Risk</span>
                <span class="btn btn-dark incident-status-btn"><span class="incident-status-icon" aria-hidden="true">${iconPerformScan.trim()}</span>Under Analysis</span>
              </div>
            </div>
            <div class="incident-telemetry-wrap">
              <a class="btn btn-dark incident-status-btn" href="#/monitor"><span class="incident-status-icon" aria-hidden="true">${iconPerformScan.trim()}</span>View Host Telemetry</a>
            </div>
          </div>
          <p class="desc incident-desc">
            Correlated recursive DNS loops with unauthorized port scans originating from
            <span class="highlight">db-core-02.internal</span>.
            Patterns match known exfiltration attempts observed in prior case #7319.
          </p>
          <div class="meta-row incident-meta-row">
            <button type="button" class="incident-meta-btn">
              <span class="incident-meta-label">Incident ID: </span><span class="incident-meta-value">#8846</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button type="button" class="incident-meta-btn">
              <span class="incident-meta-label">Detected By: </span><span class="incident-meta-value">Leo2.0Y / Automated Threat Correlation Engine</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="graph-widget">
        <div class="graph-canvas">
          <div class="graph-widget-head">
            <button type="button" class="icon-btn" aria-label="Filter graph">
              ${iconFilter.trim()}
            </button>
            <div class="graph-dropdown-wrap">
              <button
                type="button"
                class="graph-dropdown"
                aria-label="Incident ID (demo control)"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <span class="graph-dropdown-label">
                  <span class="graph-dropdown-label-static">Incident ID:</span>
                  <span class="graph-dropdown-label-id" aria-live="polite">#8846</span>
                </span>
                <span class="graph-dropdown-caret" aria-hidden="true">${iconDropdownArrow.trim()}</span>
              </button>
              <div class="graph-dropdown-menu" role="menu" aria-label="Incident selector" hidden>
                <button type="button" class="graph-dropdown-menu-item is-selected" role="menuitemradio" aria-checked="true">Incident ID: #8846</button>
                <button type="button" class="graph-dropdown-menu-item" role="menuitemradio" aria-checked="false">Incident ID: #7319</button>
                <button type="button" class="graph-dropdown-menu-item" role="menuitemradio" aria-checked="false">Incident ID: #9021</button>
                <button type="button" class="graph-dropdown-menu-item" role="menuitemradio" aria-checked="false">Incident ID: #1084</button>
              </div>
            </div>
            <button type="button" class="icon-btn" aria-label="Expand">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
          </div>
          <div
            class="graph-map-viewport"
            tabindex="0"
            role="application"
            aria-label="Incident graph: click to activate, then drag to pan and scroll to zoom"
          >
            <div class="graph-map-stage">
              <div class="graph-map-infinite-bg" aria-hidden="true"></div>
              <div class="graph-map-graph-layer">
          <svg class="graph-svg" viewBox="0 0 1600 640" preserveAspectRatio="xMinYMid meet">
            <g transform="translate(800 320) scale(0.8) translate(-800 -320)">
            <g class="incident-graph-shift" transform="translate(-380 0)">
            <defs>
              <linearGradient id="incident-db-core-gradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stop-color="#FF0000"/>
                <stop offset="100%" stop-color="#FF6262"/>
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- edges -->
            <line x1="800" y1="320" x2="560" y2="350" stroke="#3f3f46" stroke-width="2"/>
            <line x1="800" y1="320" x2="760" y2="190" stroke="#3f3f46" stroke-width="2"/>
            <line x1="800" y1="320" x2="1040" y2="320" stroke="#3f3f46" stroke-width="2"/>
            <line x1="800" y1="320" x2="980" y2="90" stroke="#3f3f46" stroke-width="2"/>
            <line x1="800" y1="320" x2="650" y2="520" stroke="#3f3f46" stroke-width="2"/>
            <line x1="800" y1="320" x2="1100" y2="610" stroke="#3f3f46" stroke-width="2"/>
            <!-- edge markers -->
            <circle cx="680" cy="335" r="7" fill="#3b82f6" stroke="#070707" stroke-width="3"/>
            <circle cx="780" cy="255" r="7" fill="#b3c66a" stroke="#070707" stroke-width="3"/>
            <circle cx="920" cy="320" r="7" fill="#b3c66a" stroke="#070707" stroke-width="3"/>
            <circle cx="890" cy="205" r="7" fill="#9ca3af" stroke="#070707" stroke-width="3"/>
            <circle cx="725" cy="420" r="7" fill="#3b82f6" stroke="#070707" stroke-width="3"/>
            <circle cx="950" cy="465" r="7" fill="#9ca3af" stroke="#070707" stroke-width="3"/>
            <!-- satellite nodes -->
            <g class="incident-graph-satellite">
              <circle cx="760" cy="190" r="20" fill="#f97316"/>
              <text x="791" y="190" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">web-prod-01</text>
            </g>
            <g class="incident-graph-satellite">
              <circle cx="560" cy="350" r="20" fill="#3b82f6"/>
              <text x="591" y="350" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">auth-svc-01</text>
            </g>
            <g class="incident-graph-satellite">
              <circle cx="650" cy="520" r="20" fill="#3b82f6"/>
              <text x="681" y="520" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">logging-collector</text>
            </g>
            <g class="incident-graph-satellite">
              <circle cx="1040" cy="320" r="20" fill="#b3c66a"/>
              <text x="1071" y="320" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">api-core-07</text>
            </g>
            <g class="incident-graph-satellite">
              <circle cx="980" cy="90" r="20" fill="#9ca3af"/>
              <text x="1011" y="90" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">external-node-a</text>
            </g>
            <g class="incident-graph-satellite">
              <circle cx="1100" cy="610" r="20" fill="#9ca3af"/>
              <text x="1131" y="610" text-anchor="start" dominant-baseline="middle" fill="#fff" font-weight="300" font-family="Inter, sans-serif" font-size="1.25rem">external-node-b</text>
            </g>
            <!-- center: origin at db-core node -->
            <g transform="translate(800 320)">
            <circle cx="0" cy="0" r="26" fill="#030303" opacity="0.95" filter="url(#glow)"/>
            <circle cx="0" cy="0" r="${dbCoreRedRadiusRem}rem" fill="url(#incident-db-core-gradient)"/>
            <g class="incident-db-core-tape-ring" aria-hidden="true">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="6s"
                repeatCount="indefinite"
              />
              <image
                href="${tapeRingUrl}"
                x="-${dbCoreTapeHalfRem}rem"
                y="-${dbCoreTapeHalfRem}rem"
                width="${DB_CORE_TAPE_BOX_REM}rem"
                height="${DB_CORE_TAPE_BOX_REM}rem"
                transform="translate(${DB_CORE_TAPE_IMAGE_NUDGE_X} ${DB_CORE_TAPE_IMAGE_NUDGE_Y})"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
            <g transform="translate(-35 0)">
              <foreignObject x="0" y="2.8125rem" width="480" height="56" overflow="visible">
                <div xmlns="http://www.w3.org/1999/xhtml" class="incident-db-core-label-html">
                  <span class="incident-db-core-pill">db-core-02.internal</span>
                </div>
              </foreignObject>
            </g>
            </g>
            </g>
            </g>
          </svg>
              </div>
            </div>
          </div>

          <div class="graph-overlay">
            <div class="graph-overlay-lead">
              <span class="graph-overlay-hostname">db-core-02.internal</span>
              <span class="btn btn-dark incident-status-btn"><span class="incident-risk-dot" aria-hidden="true"></span>High Risk</span>
              <p>Quarantine the compromised host at IP address <strong style="color:var(--text)">172.31.255.2</strong> to immediately prevent any potential lateral movement or external data exfiltration.</p>
            </div>
            <div class="mini-metrics">
              ${[
                ['All Issues', '125'],
                ['Unauthorized Port Scan', '67'],
                ['Recursive DNS Loop', '20'],
                ['Failed Logins', '5'],
                ['External IP Correlation', '33'],
              ]
                .map(
                  ([l, v]) =>
                    `<button type="button" class="mini-metric" aria-label="${escHtmlAttr(l)}, ${escHtmlAttr(v)}"><div class="l">${l}</div><div class="v">${v}</div></button>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return shell({
    crumb: {
      mode: 'incident',
      caseTitle: '#8846 — DNS Loop & Port Scan Correlation',
    },
    content,
    activeNav: 'network',
  });
}

const GRAPH_SCALE_MIN = 0.35;
const GRAPH_SCALE_MAX = 4;
const GRAPH_ZOOM_STEP = 1.12;

export function attachIncidentHandlers(root = document) {
  const widget = root.querySelector('.graph-widget');
  const viewport = root.querySelector('.graph-map-viewport');
  const stage = root.querySelector('.graph-map-stage');
  if (!widget || !viewport || !stage) return;
  const graphDropdownWrap = root.querySelector('.graph-dropdown-wrap');
  const graphDropdownBtn = root.querySelector('.graph-dropdown');
  const graphDropdownMenu = root.querySelector('.graph-dropdown-menu');
  const graphDropdownItems = graphDropdownMenu
    ? Array.from(graphDropdownMenu.querySelectorAll('.graph-dropdown-menu-item'))
    : [];

  let scale = 1;
  let tx = 0;
  let ty = 0;
  let active = false;
  let panning = false;
  let startX = 0;
  let startY = 0;
  let startTx = 0;
  let startTy = 0;
  let docBound = false;

  function closeIncidentDropdown() {
    if (!graphDropdownBtn || !graphDropdownMenu) return;
    graphDropdownBtn.setAttribute('aria-expanded', 'false');
    graphDropdownMenu.hidden = true;
    graphDropdownWrap?.classList.remove('is-open');
  }

  function openIncidentDropdown() {
    if (!graphDropdownBtn || !graphDropdownMenu) return;
    graphDropdownBtn.setAttribute('aria-expanded', 'true');
    graphDropdownMenu.hidden = false;
    graphDropdownWrap?.classList.add('is-open');
  }

  function toggleIncidentDropdown() {
    if (!graphDropdownBtn || !graphDropdownMenu) return;
    if (graphDropdownMenu.hidden) {
      openIncidentDropdown();
      return;
    }
    closeIncidentDropdown();
  }

  if (graphDropdownBtn && graphDropdownMenu) {
    graphDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleIncidentDropdown();
    });

    graphDropdownMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest('.graph-dropdown-menu-item');
      if (!item) return;

      for (const menuItem of graphDropdownItems) {
        menuItem.classList.remove('is-selected');
        menuItem.setAttribute('aria-checked', 'false');
      }
      item.classList.add('is-selected');
      item.setAttribute('aria-checked', 'true');
      const idNode = graphDropdownBtn.querySelector('.graph-dropdown-label-id');
      if (idNode) {
        const selectedText = item.textContent ?? '';
        const match = selectedText.match(/#\d+/);
        if (match) idNode.textContent = match[0];
      }
      closeIncidentDropdown();
    });

    document.addEventListener('pointerdown', (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (graphDropdownWrap?.contains(target)) return;
      closeIncidentDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeIncidentDropdown();
    });
  }

  function applyTransform() {
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function detachDocListener() {
    if (!docBound) return;
    document.removeEventListener('pointerdown', onDocPointerDown, true);
    docBound = false;
  }

  function deactivate() {
    if (!active) return;
    active = false;
    panning = false;
    viewport.classList.remove('is-active', 'is-panning');
    detachDocListener();
    if (document.activeElement === viewport) {
      viewport.blur();
    }
  }

  function onDocPointerDown(e) {
    if (!active || widget.contains(e.target)) return;
    deactivate();
  }

  function attachDocListener() {
    if (docBound) return;
    document.addEventListener('pointerdown', onDocPointerDown, true);
    docBound = true;
  }

  function activate() {
    if (active) return;
    active = true;
    viewport.classList.add('is-active');
    attachDocListener();
  }

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    activate();
    viewport.focus({ preventScroll: true });
    panning = true;
    viewport.classList.add('is-panning');
    startX = e.clientX;
    startY = e.clientY;
    startTx = tx;
    startTy = ty;
    try {
      viewport.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!panning || !active) return;
    tx = startTx + (e.clientX - startX);
    ty = startTy + (e.clientY - startY);
    applyTransform();
  });

  function endPan(e) {
    if (!panning) return;
    panning = false;
    viewport.classList.remove('is-panning');
    try {
      viewport.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  viewport.addEventListener('pointerup', endPan);
  viewport.addEventListener('pointercancel', endPan);

  viewport.addEventListener('wheel', (e) => {
    if (!active) return;
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? GRAPH_ZOOM_STEP : 1 / GRAPH_ZOOM_STEP;
    const s0 = scale;
    const s1 = Math.min(GRAPH_SCALE_MAX, Math.max(GRAPH_SCALE_MIN, s0 * factor));
    if (s1 === s0) return;
    const lx = (mx - tx) / s0;
    const ly = (my - ty) / s0;
    tx = mx - lx * s1;
    ty = my - ly * s1;
    scale = s1;
    applyTransform();
  }, { passive: false });

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      deactivate();
    }
  });

  viewport.addEventListener('focus', () => {
    activate();
  });

  viewport.addEventListener('focusout', (e) => {
    const rt = e.relatedTarget;
    if (rt && widget.contains(rt)) return;
    deactivate();
  });
}
