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

function formatCrumb(crumbText) {
  const raw = String(crumbText);
  const m = raw.match(/^(.+?)\s*\/\s*(.+)$/);
  if (m) {
    const lead = escapeHtml(m[1].trim());
    const tail = escapeHtml(m[2].trim());
    return `<span class="crumb"><span class="crumb-lead">${lead} / </span><span class="crumb-accent">${tail}</span></span>`;
  }
  return `<span class="crumb crumb-plain">${escapeHtml(raw)}</span>`;
}

export function sidebar(active = 'network') {
  const item = (href, ic, label, key) =>
    `<a class="nav-item ${active === key ? 'active' : ''}" href="${href}">${ic}<span>${label}</span></a>`;

  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true"></div>
        <span class="brand-name">Polor Systems</span>
      </div>
      <nav class="nav-primary" aria-label="Primary">
        ${item('#/anomaly', navSvg(iconHome), 'Home', 'home')}
        ${item('#/', navSvg(iconIncidentReport), 'Incident Reports', 'incidents')}
        ${item('#/anomaly', navSvg(iconNetworkManager), 'Network Monitoring', 'network')}
        ${item('#/', navSvg(iconAuditNotes), 'Audit Logs', 'audit')}
        ${item('#/', navSvg(iconCompliance), 'Compliance Dashboard', 'compliance')}
        ${item('#/', navSvg(iconSettings), 'Settings', 'settings')}
      </nav>
      <div class="sidebar-footer">
        <nav class="nav-footer" aria-label="Secondary">
          ${item('#/', navSvg(iconContactUs), 'Contact Us', 'contact')}
          ${item('#/', navSvg(iconDocumentation), 'Documentation', 'docs')}
        </nav>
        <div class="legal">
          <a href="#">Changelog</a>
          <span class="legal-dash" aria-hidden="true"></span>
          <a href="#">Privacy</a>
          <span class="legal-dash" aria-hidden="true"></span>
          <a href="#">Terms</a>
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
