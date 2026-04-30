import './styles.css';
import { renderAnomaly, attachAnomalyHandlers } from './screens/anomaly.js';
import { renderMonitor, attachMonitorHandlers } from './screens/monitor.js';
import { renderIncident, attachIncidentHandlers } from './screens/incident.js';
import { mountUtcClock, clearUtcClock } from './utc-clock.js';

const WIDTH = 2560;
const HEIGHT = 1440;

function fitArtboard() {
  const board = document.getElementById('artboard');
  const frame = document.getElementById('scale-frame');
  if (!board || !frame) return;

  const sx = window.innerWidth / WIDTH;
  const sy = window.innerHeight / HEIGHT;
  const scale = Math.min(sx, sy);

  board.style.transform = `scale(${scale})`;
  /* Inverse so 1 CSS px borders stay ~1 device px after zoom-style scaling (same factor as transform). */
  board.style.setProperty('--artboard-scale', String(scale));
  const w = Math.ceil(WIDTH * scale) + 8;
  const h = Math.ceil(HEIGHT * scale) + 8;
  frame.style.width = `${w}px`;
  frame.style.height = `${h}px`;
}

function currentView() {
  const m = window.location.hash.match(/#\/([\w-]+)/);
  const v = m ? m[1] : 'anomaly';
  if (v === 'monitor' || v === 'incident') return v;
  return 'anomaly';
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  clearUtcClock();

  const view = currentView();
  let html = '';

  if (view === 'monitor') {
    html = renderMonitor();
  } else if (view === 'incident') {
    html = renderIncident();
  } else {
    html = renderAnomaly();
  }

  app.innerHTML = html;

  const root = app;
  if (view === 'anomaly') attachAnomalyHandlers(root);
  if (view === 'monitor') attachMonitorHandlers(root);
  if (view === 'incident') attachIncidentHandlers(root);

  mountUtcClock(root);
}

function init() {
  if (!window.location.hash) {
    window.location.hash = '#/anomaly';
  }

  render();
  fitArtboard();

  window.addEventListener('resize', fitArtboard);
  window.addEventListener('hashchange', render);
}

init();
