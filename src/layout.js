import iconHome from './icons/home.svg?raw';
import iconIncidentReport from './icons/incident-report.svg?raw';
import iconNetworkManager from './icons/network-manager.svg?raw';
import iconAuditNotes from './icons/audit-notes.svg?raw';
import iconCompliance from './icons/compliance.svg?raw';
import iconSettings from './icons/settings.svg?raw';
import iconContactUs from './icons/contact-us.svg?raw';
import iconDocumentation from './icons/documentation.svg?raw';
import topbarSearch from './icons/topbar-icons/search-01.svg?raw';
import topbarBell from './icons/topbar-icons/bell-02.svg?raw';
import topbarSettings from './icons/topbar-icons/settings-02.svg?raw';

const navSvg = (svg) => svg.trim();

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Shown in the first segment (full product line); incident view truncates in the UI. */
const TOPBAR_ENGINE_LEAD = 'Leo2.0Y - Automated Threat Correlation Engine';

function leadTruncated(lead) {
  const t = String(lead);
  if (t.length <= 10) return t;
  return `${t.slice(0, 10)}...`;
}

/**
 * Breadcrumb: `string` (legacy "A / B") or
 * - `{ mode: 'standard', trail }` — full engine lead + `trail` (e.g. Anomaly Detection, monitor)
 * - `{ mode: 'incident', caseTitle }` — truncated lead (hover) + link to anomaly + case title
 * - `{ mode: 'incidentSubpage', caseTitle, pageTitle }` — incident trail + current subpage
 */
function formatCrumb(crumb) {
  if (crumb && typeof crumb === 'object' && 'mode' in crumb) {
    if (crumb.mode === 'incident') {
      const short = leadTruncated(TOPBAR_ENGINE_LEAD);
      return `
<nav class="topbar-breadcrumb" aria-label="Breadcrumb">
  <ol class="topbar-breadcrumb__list">
    <li class="topbar-breadcrumb__item">
      <span class="crumb-segment crumb-segment--engine crumb-segment--trunc" title="${escapeHtml(
        TOPBAR_ENGINE_LEAD,
      )}">${escapeHtml(short)}</span>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item">
      <a class="crumb-segment crumb-segment--link" href="#/anomaly">Anomaly Detection</a>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item" aria-current="page">
      <span class="crumb-segment">${escapeHtml(String(crumb.caseTitle))}</span>
    </li>
  </ol>
</nav>`.trim();
    }
    if (crumb.mode === 'incidentSubpage') {
      const short = leadTruncated(TOPBAR_ENGINE_LEAD);
      return `
<nav class="topbar-breadcrumb" aria-label="Breadcrumb">
  <ol class="topbar-breadcrumb__list">
    <li class="topbar-breadcrumb__item">
      <span class="crumb-segment crumb-segment--engine crumb-segment--trunc" title="${escapeHtml(
        TOPBAR_ENGINE_LEAD,
      )}">${escapeHtml(short)}</span>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item">
      <a class="crumb-segment crumb-segment--link" href="#/anomaly">Anomaly Detection</a>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item">
      <a class="crumb-segment crumb-segment--link" href="#/incident">${escapeHtml(String(crumb.caseTitle))}</a>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item" aria-current="page">
      <span class="crumb-segment">${escapeHtml(String(crumb.pageTitle))}</span>
    </li>
  </ol>
</nav>`.trim();
    }
    if (crumb.mode === 'standard') {
      return formatStandardBreadcrumb(escapeHtml(TOPBAR_ENGINE_LEAD), escapeHtml(String(crumb.trail || '')));
    }
  }
  const raw = String(crumb);
  const m = raw.match(/^(.+?)\s*\/\s*(.+)$/);
  if (m) {
    return formatStandardBreadcrumb(escapeHtml(m[1].trim()), escapeHtml(m[2].trim()));
  }
  return `<span class="crumb crumb-plain">${escapeHtml(raw)}</span>`;
}

function formatStandardBreadcrumb(leadHtml, trailHtml) {
  return `
<nav class="topbar-breadcrumb" aria-label="Breadcrumb">
  <ol class="topbar-breadcrumb__list">
    <li class="topbar-breadcrumb__item">
      <span class="crumb-segment crumb-segment--engine">${leadHtml}</span>
    </li>
    <li class="topbar-breadcrumb__sep" aria-hidden="true">/</li>
    <li class="topbar-breadcrumb__item" aria-current="page">
      <span class="crumb-segment crumb-segment--current">${trailHtml}</span>
    </li>
  </ol>
</nav>`.trim();
}

export function sidebar(active = 'network') {
  const item = (ic, label, key) =>
    `<span class="nav-item ${active === key ? 'active' : ''}">${ic}<span>${label}</span></span>`;

  /** Only sidebar navigation target: return to Anomaly Detection. Same markup on every page. */
  const networkMonitorLink = (ic, label, key) =>
    `<a class="nav-item ${active === key ? 'active' : ''}" href="#/anomaly">${ic}<span>${label}</span></a>`;

  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true"></div>
        <span class="brand-name">Polor Systems</span>
      </div>
      <nav class="nav-primary" aria-label="Primary">
        ${item(navSvg(iconHome), 'Home', 'home')}
        ${item(navSvg(iconIncidentReport), 'Incident Reports', 'incidents')}
        ${networkMonitorLink(navSvg(iconNetworkManager), 'Network Monitoring', 'network')}
        ${item(navSvg(iconAuditNotes), 'Audit Logs', 'audit')}
        ${item(navSvg(iconCompliance), 'Compliance Dashboard', 'compliance')}
        ${item(navSvg(iconSettings), 'Settings', 'settings')}
      </nav>
      <div class="sidebar-footer">
        <nav class="nav-footer" aria-label="Secondary">
          ${item(navSvg(iconContactUs), 'Contact Us', 'contact')}
          ${item(navSvg(iconDocumentation), 'Documentation', 'docs')}
        </nav>
        <div class="legal">
          <span class="legal-link">Changelog</span>
          <span class="legal-dash" aria-hidden="true"></span>
          <span class="legal-link">Privacy</span>
          <span class="legal-dash" aria-hidden="true"></span>
          <span class="legal-link">Terms</span>
        </div>
      </div>
    </aside>
  `;
}

export function topbar(crumbText) {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <button type="button" class="menu-btn" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        ${formatCrumb(crumbText)}
      </div>
      <div class="topbar-right">
        <span class="version">Alpha 0.8.986</span>
        <button type="button" class="icon-btn" aria-label="Search">
          ${navSvg(topbarSearch)}
        </button>
        <button type="button" class="icon-btn" aria-label="Notifications">
          ${navSvg(topbarBell)}
        </button>
        <button type="button" class="icon-btn" aria-label="Settings">
          ${navSvg(topbarSettings)}
        </button>
        <div class="avatar" role="img" aria-label="User"></div>
      </div>
    </header>
  `;
}

export function shell({ crumb, content, activeNav = 'network' }) {
  return `
    <div class="shell">
      ${sidebar(activeNav)}
      <div class="main-col">
        ${topbar(crumb)}
        <div class="main-body">
          <div class="content-scroll">${content}</div>
        </div>
      </div>
    </div>
  `;
}
