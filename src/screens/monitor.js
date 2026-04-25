import { shell } from '../layout.js';
import iconDropdownArrow from '../icons/incident-page/dropdown-arrow.svg?raw';
import iconIssueArrow from '../icons/monitor-page/issue-arrow.svg?raw';

export function renderMonitor() {
  const chartPoints = '0,220 320,176 520,220 820,220 1400,26 1600,130';
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
          <div class="monitor-combo-control monitor-query-control" aria-label='Query "DoS" OR "Port Scan"'>
            <span class="monitor-combo-label">Query</span>
            <span class="monitor-combo-value">"DoS" OR "Port Scan"</span>
          </div>
          <div class="monitor-combo-control monitor-severity-control" aria-label='Severity >= "medium"'>
            <span class="monitor-combo-label">Severity</span>
            <span class="monitor-combo-value">&gt;= "medium"</span>
          </div>
          <div class="control">
            <div class="select-like monitor-timeframe-select">
              <span>Last 3 Days</span>
              <span class="monitor-dropdown-caret" aria-hidden="true">${iconDropdownArrow.trim()}</span>
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
                  `<button type="button" class="metric-card ${sel}" data-metric="${label}">
                    <div class="label">${label}</div>
                    <div class="value">${val}</div>
                  </button>`,
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
                <svg class="chart-svg" viewBox="0 0 1600 260" preserveAspectRatio="none">
                  ${chartGridLines}
                  <polyline fill="none" stroke="#3b82f6" stroke-width="0.125rem" points="${chartPoints}" stroke-linejoin="round"/>
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
    crumb: 'Leo2.0Y - Automated Threat Correlation Engine / Anomaly Detection',
    content,
    activeNav: 'network',
  });
}

export function attachMonitorHandlers(root) {
  root.querySelectorAll('.metric-card').forEach((el) => {
    el.addEventListener('click', () => {
      root.querySelectorAll('.metric-card').forEach((m) => m.classList.remove('selected'));
      el.classList.add('selected');
    });
  });
  const sb = root.querySelector('#step-sandbox');
  if (sb) {
    sb.addEventListener('click', () => {
      window.location.hash = '#/incident';
    });
  }
}
