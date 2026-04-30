import { shell } from '../layout.js';
import iconDropdownArrow from '../icons/incident-page/dropdown-arrow.svg?raw';
import iconIssueArrow from '../icons/monitor-page/issue-arrow.svg?raw';

/** 11:00 PM as a persistent fraction of the horizontal domain (same “clock slice” across presets). */
const MONITOR_PRIMARY_X_RATIO = 23 / 24;

/** X positions for secondary checkpoint dots only (major ticks); primary marker added separately at {@link MONITOR_PRIMARY_X_RATIO}. */
const MONITOR_DOT_CHECKPOINT_RATIOS = {
  /** 6 × 4h marks on Today’s axis */
  today: [0, 4 / 24, 8 / 24, 12 / 24, 16 / 24, 20 / 24],
  /** One checkpoint per weekday label column */
  '2weeks': [0, 1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7],
  /** Aligned with 7 calendar-day buckets */
  '1month': [0, 1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7],
  /** Fully zoomed-out: evenly spaced checkpoints; cap 19 + primary dot = max 20 */
  '3months': Array.from({ length: 19 }, (_, i) => i / 18),
};

const CHART_PLOT_WIDTH = 1600;

/** Demo series per timeframe preset (same viewBox 0 0 1600 260 as the chart SVG). */
const MONITOR_TIMEFRAME_CHART = {
  today: {
    points: '0,220 320,176 520,220 820,220 1400,26 1600,130',
    xLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  },
  '2weeks': {
    points: '0,200 243,208 486,165 729,152 972,88 1215,118 1600,95',
    xLabels: ['Mon', 'Wed', 'Fri', 'Sun', 'Tue', 'Thu', 'Sat'],
  },
  '1month': {
    points: '0,185 266,130 533,175 800,55 1066,140 1333,105 1600,160',
    xLabels: ['1', '5', '10', '15', '20', '25', '30'],
  },
  '3months': {
    points: '0,215 266,200 533,120 800,100 1066,45 1333,85 1600,70',
    xLabels: ['W1', 'W5', 'W9', 'W13', 'W17', 'W21', 'W25'],
  },
};

export function renderMonitor() {
  const chartPoints = MONITOR_TIMEFRAME_CHART.today.points;
  const chartGridLineCount = 4;
  const chartGridYTop = 26;
  const chartGridYBottom = 234;
  const chartGridLines = Array.from({ length: chartGridLineCount })
    .map((_, i) => {
      const t = chartGridLineCount > 1 ? i / (chartGridLineCount - 1) : 0;
      const y = chartGridYTop + t * (chartGridYBottom - chartGridYTop);
      return `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="#252525" stroke-width="1"/>`;
    })
    .join('');

  const content = `
    <section class="monitor-page">
      <div class="page-head page-head-monitor">
        <div>
          <h1 class="page-title page-title-monitor monitor-title-row">
            <a class="monitor-host-link" href="#/incident">db-core-02.internal</a>
            <span class="btn btn-dark incident-status-btn">Database Server</span>
          </h1>
          <p class="desc monitor-desc">
            Stores structured information—everything from user credentials and transaction logs to internal audit trails,
            application telemetry, and threat event data gathered by the SOC's tools.
          </p>
        </div>
      </div>

      <div class="controls-bar">
        <div class="monitor-controls-group">
          <div class="monitor-combo monitor-combo--query" aria-label='Query "DoS" OR "Port Scan"'>
            <span class="monitor-combo-label">Query</span>
            <span class="monitor-combo-value">"DoS" OR "Port Scan"</span>
          </div>
          <div class="monitor-combo monitor-combo--severity" aria-label='Severity >= "medium"'>
            <span class="monitor-combo-label">Severity</span>
            <span class="monitor-combo-value">&gt;= "medium"</span>
          </div>
          <div class="control">
            <div class="monitor-timeframe-wrap">
              <button
                type="button"
                class="select-like monitor-timeframe-select"
                aria-label="Time range selector"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <span class="monitor-timeframe-label">Today</span>
                <span class="monitor-dropdown-caret" aria-hidden="true">${iconDropdownArrow.trim()}</span>
              </button>
              <div class="monitor-timeframe-menu" role="menu" aria-label="Time range options" hidden>
                <button type="button" class="monitor-timeframe-menu-item is-selected" role="menuitemradio" aria-checked="true" data-monitor-timeframe="today">Today</button>
                <button type="button" class="monitor-timeframe-menu-item" role="menuitemradio" aria-checked="false" data-monitor-timeframe="2weeks">2 weeks</button>
                <button type="button" class="monitor-timeframe-menu-item" role="menuitemradio" aria-checked="false" data-monitor-timeframe="1month">1 month</button>
                <button type="button" class="monitor-timeframe-menu-item" role="menuitemradio" aria-checked="false" data-monitor-timeframe="3months">3 months</button>
                <button type="button" class="monitor-timeframe-menu-item" role="menuitemradio" aria-checked="false" data-monitor-timeframe="custom">Custom Range</button>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-dark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </button>
        </div>
        <button type="button" class="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/><polygon points="11 8 16 12 11 16 11 8" fill="#111"/></svg>
          Run Query
        </button>
      </div>

      <div class="monitor-layout">
        <div class="monitor-main">
          <div class="metrics-row">
            ${[
              ['All Issues', '125', ''],
              ['Unauthorized Port Scan', '67', 'selected'],
              ['Recursive DNS Loop', '20', ''],
              ['Failed Logins', '5', ''],
              ['External IP Correlation', '33', ''],
            ]
              .map(
                ([label, val, sel]) =>
                  `<div class="metric-card ${sel}" data-metric="${label}">
                    <div class="label">${label}</div>
                    <div class="value">${val}</div>
                  </div>`,
              )
              .join('')}
          </div>

          <div class="chart-panel">
            <div class="chart-head">
              <div class="chart-legend-chip">
                <span class="chart-legend-dot"></span>
                Unauthorized Port Scan
              </div>
              <span class="chart-clock">00:15 UTC</span>
            </div>
            <div class="chart-big hidden">67</div>
            <div class="chart-svg-wrap">
              <div class="chart-plot-row">
                <div class="chart-y-axis-labels">
                  <span>40</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
                <svg class="chart-svg" viewBox="0 0 1600 260" preserveAspectRatio="xMidYMid meet">
                  ${chartGridLines}
                  <polyline fill="none" stroke="#3b82f6" stroke-width="0.125rem" points="${chartPoints}" stroke-linejoin="round"/>
                  <g class="monitor-chart-dots" aria-hidden="true"></g>
                </svg>
              </div>
              <div class="chart-x-axis-labels">
                <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span>
              </div>
            </div>
          </div>
          <div class="chart-foot">
            <span class="chart-foot-host">db-core-02.internal</span>
            <button type="button" class="chart-foot-link">Manage Issues</button>
          </div>

          <div class="monitor-task-table-wrap">
            <div class="monitor-task-table">
              <div class="monitor-task-head">
                <span>TIME (UTC) ↑</span>
                <span>ROOT TASK</span>
                <span>STATUS</span>
                <span>SEVERITY</span>
                <span>AFFECTED HOST</span>
              </div>
              <div class="monitor-task-row">
                <span>11:02:11AM</span>
                <div>
                  <div class="task-name">DAILY_FINANCE_AGGREGATE</div>
                  <div class="task-sub">0 sub tasks</div>
                </div>
                <span class="task-status is-on">ON</span>
                <span class="task-severity"><span class="task-severity-dot"></span>Medium</span>
                <a href="#/incident">web-prod-01</a>
              </div>
              <div class="monitor-task-row">
                <span>11:02:11AM</span>
                <div>
                  <div class="task-name">INVENTORY_SYNC_TASK</div>
                  <div class="task-sub">0 sub tasks</div>
                </div>
                <span class="task-status is-off">OFF</span>
                <span class="task-severity"><span class="task-severity-dot"></span>Low</span>
                <a href="#/incident">web-prod-01</a>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div class="issue-body issue-panel">
            <div class="issue-panel-title">
              ${iconIssueArrow.trim()}
              Issue Analysis
            </div>
            <div class="monitor-issue-summary">
              <h4>Harden DNS Configuration</h4>
              <div class="sub">Immediate Host Isolation</div>
              <p class="copy monitor-issue-copy">
                Quarantine the compromised host at IP address 172.31.255.2 to immediately prevent any potential lateral
                movement or external data exfiltration.
              </p>
            </div>
            <div class="steps">
              <a class="step" href="#/monitor">
                <div class="step-inner">
                  <div class="step-num-box">
                    <span class="step-num">1</span>
                  </div>
                  <div class="step-content">
                    <div class="step-text">
                      <div class="step-title">Correlate with prior telemetry logs</div>
                      <div class="step-sub">Temporarily segment this endpoint</div>
                    </div>
                    <div class="step-link">
                      <svg class="step-link-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M17.707 7.29163L13.5404 7.29163V9.37496L17.707 9.37496C19.4258 9.37496 20.832 10.7812 20.832 12.5C20.832 14.2187 19.4258 15.625 17.707 15.625H13.5404V17.7083H17.707C20.582 17.7083 22.9154 15.375 22.9154 12.5C22.9154 9.62496 20.582 7.29163 17.707 7.29163ZM11.457 15.625L7.29036 15.625C5.57161 15.625 4.16536 14.2187 4.16536 12.5C4.16536 10.7812 5.57161 9.37496 7.29036 9.37496L11.457 9.37496V7.29163L7.29036 7.29163C4.41536 7.29163 2.08203 9.62496 2.08203 12.5C2.08203 15.375 4.41536 17.7083 7.29036 17.7083H11.457V15.625ZM8.33203 11.4583L16.6654 11.4583V13.5416L8.33203 13.5416V11.4583Z" fill="currentColor"/>
                      </svg>
                      <span class="step-link-text">How to Isolate Host</span>
                    </div>
                  </div>
                </div>
                <span class="step-chev-box" aria-hidden="true">
                  <svg class="step-chev" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9.67578 8.645L15.0191 14L9.67578 19.355L11.3208 21L18.3208 14L11.3208 7L9.67578 8.645Z" fill="currentColor"/>
                  </svg>
                </span>
              </a>
              <a class="step" href="#/incident">
                <div class="step-inner">
                  <div class="step-num-box">
                    <span class="step-num">2</span>
                  </div>
                  <div class="step-content">
                    <div class="step-text">
                      <div class="step-title">Generate anomaly summary for Case #8846</div>
                      <div class="step-sub">Compile time-series data, node relationships, and AI-detected</div>
                    </div>
                  </div>
                </div>
                <span class="step-chev-box" aria-hidden="true">
                  <svg class="step-chev" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9.67578 8.645L15.0191 14L9.67578 19.355L11.3208 21L18.3208 14L11.3208 7L9.67578 8.645Z" fill="currentColor"/>
                  </svg>
                </span>
              </a>
              <button type="button" class="step" id="step-sandbox">
                <div class="step-inner">
                  <div class="step-num-box">
                    <span class="step-num">3</span>
                  </div>
                  <div class="step-content">
                    <div class="step-text">
                      <div class="step-title">Initiate traffic replay sandbox</div>
                      <div class="step-sub">Reconstruct the last 60 seconds of packet flow</div>
                    </div>
                  </div>
                </div>
                <span class="step-chev-box" aria-hidden="true">
                  <svg class="step-chev" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9.67578 8.645L15.0191 14L9.67578 19.355L11.3208 21L18.3208 14L11.3208 7L9.67578 8.645Z" fill="currentColor"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;

  return shell({
    crumb: {
      mode: 'incidentSubpage',
      caseTitle: '#8846 — DNS Loop & Port Scan Correlation',
      pageTitle: 'Server Telemetry',
    },
    content,
    activeNav: 'network',
  });
}

/**
 * Samples Y on the demo polyline at x (our series are monotone increasing in x).
 */
function interpolateYOnPolyline(pointsStr, x) {
  const parts = pointsStr.trim().split(/\s+/).filter(Boolean);
  const pts = parts.map((p) => {
    const [px, py] = p.split(',').map(Number);
    return { x: px, y: py };
  });
  if (pts.length === 0) return 130;
  if (pts.length === 1) return pts[0].y;
  if (x <= pts[0].x) return pts[0].y;
  const lastPt = pts[pts.length - 1];
  if (x >= lastPt.x) return lastPt.y;
  let i = 0;
  while (i < pts.length - 1 && pts[i + 1].x < x) i++;
  const a = pts[i];
  const b = pts[i + 1];
  if (Math.abs(b.x - a.x) < 1e-9) return a.y;
  const t = (x - a.x) / (b.x - a.x);
  return a.y + t * (b.y - a.y);
}

/** Ratio-space gap: secondary checkpoints nearer than this to 23:00 are skipped (still show primary dot). ~1.7% span ≈ 27px */
const MONITOR_DOT_DEDUP_RATIO = 0.017;

/** Primary dot (23:00) + checkpoint dots placed on curve; merges near-primary checkpoints. */
function renderMonitorChartDots(root, preset, pointsStr) {
  const group = root.querySelector('.monitor-page .chart-svg .monitor-chart-dots');
  if (!group) return;

  const primaryX = MONITOR_PRIMARY_X_RATIO * CHART_PLOT_WIDTH;
  const primaryY = interpolateYOnPolyline(pointsStr, primaryX);

  const checkpointRatios = MONITOR_DOT_CHECKPOINT_RATIOS[preset] ?? [];
  const checkpoints = checkpointRatios
    .filter((r) => Math.abs(r - MONITOR_PRIMARY_X_RATIO) > MONITOR_DOT_DEDUP_RATIO)
    .map((r) => {
      const cx = r * CHART_PLOT_WIDTH;
      return {
        cx,
        cy: interpolateYOnPolyline(pointsStr, cx),
        primary: false,
      };
    });

  const dots = [
    ...checkpoints,
    { cx: primaryX, cy: primaryY, primary: true },
  ];

  const ns = 'http://www.w3.org/2000/svg';
  group.replaceChildren();

  dots.forEach((d, i) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', String(d.cx));
    c.setAttribute('cy', String(d.cy));
    /* 10×10 user units (diameter 10) — uniform; meet preserves circular shape vs non-uniform stretch */
    c.setAttribute('r', '5');
    c.setAttribute('class', d.primary ? 'monitor-chart-dot monitor-chart-dot--primary' : 'monitor-chart-dot');
    c.setAttribute('data-dot-index', String(i));
    group.appendChild(c);
  });
}

/**
 * Updates the main telemetry chart polyline + x-axis labels for a timeframe preset.
 * Does nothing for `custom` (Custom Range).
 */
function applyMonitorTimeframeChart(root, preset) {
  if (preset === 'custom' || !MONITOR_TIMEFRAME_CHART[preset]) return;
  const cfg = MONITOR_TIMEFRAME_CHART[preset];
  const poly = root.querySelector('.monitor-page .chart-svg polyline');
  const xAxis = root.querySelector('.monitor-page .chart-x-axis-labels');
  if (poly) poly.setAttribute('points', cfg.points);
  if (xAxis) {
    const spans = xAxis.querySelectorAll('span');
    cfg.xLabels.forEach((text, i) => {
      if (spans[i]) spans[i].textContent = text;
    });
  }
  renderMonitorChartDots(root, preset, cfg.points);
}

export function attachMonitorHandlers(root) {
  const timeframeWrap = root.querySelector('.monitor-timeframe-wrap');
  const timeframeBtn = root.querySelector('.monitor-timeframe-select');
  const timeframeMenu = root.querySelector('.monitor-timeframe-menu');
  const timeframeLabel = root.querySelector('.monitor-timeframe-label');
  const timeframeItems = timeframeMenu
    ? Array.from(timeframeMenu.querySelectorAll('.monitor-timeframe-menu-item'))
    : [];

  function closeTimeframeMenu() {
    if (!timeframeBtn || !timeframeMenu) return;
    timeframeBtn.setAttribute('aria-expanded', 'false');
    timeframeMenu.hidden = true;
    timeframeWrap?.classList.remove('is-open');
  }

  function openTimeframeMenu() {
    if (!timeframeBtn || !timeframeMenu) return;
    timeframeBtn.setAttribute('aria-expanded', 'true');
    timeframeMenu.hidden = false;
    timeframeWrap?.classList.add('is-open');
  }

  if (timeframeBtn && timeframeMenu) {
    timeframeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (timeframeMenu.hidden) {
        openTimeframeMenu();
        return;
      }
      closeTimeframeMenu();
    });

    timeframeMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest('.monitor-timeframe-menu-item');
      if (!item) return;

      for (const menuItem of timeframeItems) {
        menuItem.classList.remove('is-selected');
        menuItem.setAttribute('aria-checked', 'false');
      }
      item.classList.add('is-selected');
      item.setAttribute('aria-checked', 'true');
      if (timeframeLabel) timeframeLabel.textContent = item.textContent ?? '';
      const preset = item.dataset.monitorTimeframe ?? '';
      applyMonitorTimeframeChart(root, preset);
      closeTimeframeMenu();
    });

    document.addEventListener('pointerdown', (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (timeframeWrap?.contains(target)) return;
      closeTimeframeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTimeframeMenu();
    });
  }

  const sb = root.querySelector('#step-sandbox');
  if (sb) {
    sb.addEventListener('click', () => {
      window.location.hash = '#/incident';
    });
  }

  applyMonitorTimeframeChart(root, 'today');
}
