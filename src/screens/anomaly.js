import { shell } from '../layout.js';
import iconPerformScan from '../icons/button-icons/grain.svg?raw';
import iconSearchFilter from '../icons/SearchBarRow/filter-icon.svg?raw';
import iconViewBlock from '../icons/SearchBarRow/block-filter.svg?raw';
import iconViewList from '../icons/SearchBarRow/list-filter.svg?raw';
import iconViewPlus from '../icons/SearchBarRow/plus-filter-icon.svg?raw';

function trimSvg(s) {
  return String(s).trim();
}

const cards = [
  {
    id: '8846',
    host: 'db-core-02.internal',
    title: 'DNS Loop & Port Scan Correlation',
    body: 'Recursive DNS requests aligned with outbound port scans (TTP:443). Correlation suggests automated reconnaissance.',
    severity: 'critical',
    scan: '3:00 UTC',
  },
  {
    id: '8851',
    host: 'db-replica-east.internal',
    title: 'Replication Delay & Integrity Mismatch',
    body: 'Streaming replication lag reached 14s with hash mismatch on hot row set—possible silent corruption or network partition.',
    severity: 'high',
    scan: '2:47 UTC',
  },
  {
    id: '8855',
    host: 'db-analytics.internal',
    title: 'Excessive Query Execution Time',
    body: 'Average latency exceeded 8.7s on table user_metrics during peak batch window.',
    severity: 'medium',
    scan: '2:12 UTC',
  },
  {
    id: '8850',
    host: 'db-core-02.internal',
    title: 'Unauthorized Query Access',
    body: 'Service account svc_report queried finance_ledger outside approved maintenance window.',
    severity: 'critical',
    scan: '1:58 UTC',
  },
  {
    id: '8842',
    host: 'db-cache.internal',
    title: 'Anomalous Connection Burst',
    body: 'Inbound connection rate from api-core pool spiked 420% vs 7-day baseline.',
    severity: 'high',
    scan: '1:30 UTC',
  },
  {
    id: '8839',
    host: 'db-core-02.internal',
    title: 'TLS Certificate Pin Mismatch',
    body: 'Client handshake observed with unexpected intermediate CA chain on port 5432.',
    severity: 'medium',
    scan: '1:05 UTC',
  },
];

function sevClass(s) {
  if (s === 'critical') return 'sev-critical';
  if (s === 'high') return 'sev-high';
  return 'sev-medium';
}

function sevLabel(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Tile layout only — not reused by list view */
function renderGridCardHtml(c, dbIcon) {
  const inner = `
        <div class="anomaly-grid-card__top">
          <span class="anomaly-grid-card__source">
            <span class="db-pill">${dbIcon}<span class="db-pill-host">${c.host}</span></span>
          </span>
          <span class="anomaly-grid-card__scan">Last Scan ${c.scan}</span>
        </div>
        <div class="anomaly-grid-card__body">
          <h3 class="anomaly-grid-card__title">#${c.id} — ${c.title}</h3>
          <p class="anomaly-grid-card__desc">${c.body}</p>
        </div>
        <div class="anomaly-grid-card__foot">
          <span class="pill-id">#${c.id}</span>
          <span class="severity ${sevClass(c.severity)}"><span class="severity-dot" aria-hidden="true"></span>${sevLabel(c.severity)}</span>
        </div>`;
  if (c.id === '8846') {
    return `<div role="button" tabindex="0" class="anomaly-grid-card anomaly-grid-card--incident" data-card-id="${c.id}" aria-label="Open incident: ${c.title}">${inner}</div>`;
  }
  return `<article class="anomaly-grid-card anomaly-grid-card--static" data-card-id="${c.id}">${inner}</article>`;
}

/** Row layout only — separate DOM from grid tiles */
function renderListRowHtml(c, dbIcon) {
  const inner = `
        <div class="anomaly-list-row__main">
          <h3 class="anomaly-list-row__title">#${c.id} — ${c.title}</h3>
          <p class="anomaly-list-row__desc">${c.body}</p>
        </div>
        <div class="anomaly-list-row__aside">
          <div class="anomaly-list-row__tags">
            <span class="pill-id">#${c.id}</span>
            <span class="severity ${sevClass(c.severity)}"><span class="severity-dot" aria-hidden="true"></span>${sevLabel(c.severity)}</span>
            <span class="db-pill">${dbIcon}<span class="db-pill-host">${c.host}</span></span>
          </div>
          <span class="anomaly-list-row__scan">Last Scan ${c.scan}</span>
        </div>`;
  if (c.id === '8846') {
    return `<div role="button" tabindex="0" class="anomaly-list-row anomaly-list-row--incident" data-card-id="${c.id}" aria-label="Open incident: ${c.title}">${inner}</div>`;
  }
  return `<article class="anomaly-list-row anomaly-list-row--static" data-card-id="${c.id}">${inner}</article>`;
}

export function renderAnomaly() {
  const dbIcon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>';

  const gridHtml = cards.map((c) => renderGridCardHtml(c, dbIcon)).join('');
  const listHtml = cards.map((c) => renderListRowHtml(c, dbIcon)).join('');

  const content = `
    <section>
      <div class="page-head page-head-anomaly">
        <div class="page-head-meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span data-utc-live>00:00:00 UTC</span>
        </div>
        <div class="page-title-row">
          <h1 class="page-title page-title-anomaly">Anomaly Detection</h1>
          <span class="title-chip">Leo 2.0Y</span>
          <button type="button" class="btn btn-dark page-title-cta"><span class="page-title-cta-icon" aria-hidden="true">${trimSvg(iconPerformScan)}</span><span>Perform Scan</span></button>
        </div>
      </div>
      <div class="search-row">
        <div class="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" placeholder="Databases" autocomplete="off" />
          <button type="button" class="icon-btn search-field-filter-btn" aria-label="Filters">${trimSvg(iconSearchFilter)}</button>
        </div>
        <div class="view-toggles" role="group" aria-label="View mode">
          <button type="button" class="toggle-btn active" data-anomaly-view="grid" title="Grid view" aria-pressed="true"><span class="toggle-btn-icon" aria-hidden="true">${trimSvg(iconViewBlock)}</span></button>
          <button type="button" class="toggle-btn" data-anomaly-view="list" title="List view" aria-pressed="false"><span class="toggle-btn-icon" aria-hidden="true">${trimSvg(iconViewList)}</span></button>
          <button type="button" class="toggle-btn" title="Add" aria-label="Add"><span class="toggle-btn-icon" aria-hidden="true">${trimSvg(iconViewPlus)}</span></button>
        </div>
      </div>
      <div class="anomaly-views">
        <div class="anomaly-view anomaly-view--grid" data-anomaly-view-panel="grid" aria-hidden="false">
          <div class="anomaly-grid">${gridHtml}</div>
        </div>
        <div class="anomaly-view anomaly-view--list" data-anomaly-view-panel="list" aria-hidden="true" hidden>
          <div class="anomaly-list">${listHtml}</div>
        </div>
      </div>
    </section>
  `;

  return shell({
    crumb: { mode: 'standard', trail: 'Anomaly Detection' },
    content,
    activeNav: 'network',
  });
}

export function attachAnomalyHandlers(root) {
  const goIncident = () => {
    window.location.hash = '#/incident';
  };

  root.querySelectorAll('.anomaly-grid-card--incident, .anomaly-list-row--incident').forEach((el) => {
    el.addEventListener('click', goIncident);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goIncident();
      }
    });
  });

  const panelGrid = root.querySelector('[data-anomaly-view-panel="grid"]');
  const panelList = root.querySelector('[data-anomaly-view-panel="list"]');
  const viewBtns = root.querySelectorAll('[data-anomaly-view]');

  if (panelGrid && panelList && viewBtns.length) {
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.anomalyView;
        const listOn = mode === 'list';

        panelGrid.hidden = listOn;
        panelList.hidden = !listOn;
        panelGrid.setAttribute('aria-hidden', listOn ? 'true' : 'false');
        panelList.setAttribute('aria-hidden', listOn ? 'false' : 'true');

        viewBtns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });
  }
}
