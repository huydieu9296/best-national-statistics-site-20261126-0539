// Small canvas chart helpers. No library: every chart is drawn with the 2D canvas API,
// sized to its container and re-drawn on resize so it stays sharp on desktop and phone.

const INK = '#1d2b36';
const MUTED = '#6b7a86';
const GRID = '#dfe6ea';
const PALETTE = ['#0f766e', '#b45309', '#1d4ed8', '#be123c', '#4d7c0f', '#7c3aed', '#0369a1', '#a16207'];

export function palette(i) {
  return PALETTE[i % PALETTE.length];
}

function setupCanvas(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const widthCss = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.style.height = heightCss + 'px';
  canvas.width = Math.round(widthCss * dpr);
  canvas.height = Math.round(heightCss * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  return { ctx, w: widthCss, h: heightCss };
}

function niceMax(value) {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * pow;
}

function drawAxes(ctx, pad, w, h, max, min, ticks, formatTick) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) * i) / ticks;
    const y = pad.top + (h - pad.top - pad.bottom) * (1 - i / ticks);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatTick(v), pad.left - 8, y);
  }
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.lineTo(w - pad.right, h - pad.bottom);
  ctx.stroke();
}

// Vertical bar chart: labels under each bar, values on top.
export function drawBarChart(canvas, items, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas, opts.height || 280);
  const pad = { top: 24, right: 12, bottom: 34, left: 62 };
  const values = items.map((d) => d.value);
  const max = niceMax(Math.max(...values, 1));
  const min = Math.min(0, ...values);
  drawAxes(ctx, pad, w, h, max, min, 4, (v) => opts.formatTick ? opts.formatTick(v) : String(Math.round(v)));
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const slot = plotW / items.length;
  const barW = Math.min(52, slot * 0.62);
  items.forEach((d, i) => {
    const x = pad.left + slot * i + (slot - barW) / 2;
    const zeroY = pad.top + plotH * (1 - (0 - min) / (max - min));
    const y = pad.top + plotH * (1 - (d.value - min) / (max - min));
    ctx.fillStyle = d.color || palette(i);
    ctx.fillRect(x, Math.min(y, zeroY), barW, Math.abs(zeroY - y));
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(d.labelValue || String(d.value), x + barW / 2, Math.min(y, zeroY) - 4);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(d.label, x + barW / 2, h - pad.bottom + 8);
  });
}

// Line chart over years, one series per country.
export function drawLineChart(canvas, series, years, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas, opts.height || 280);
  const pad = { top: 24, right: 12, bottom: 30, left: 52 };
  const all = series.flatMap((s) => s.values);
  let max = Math.max(...all);
  let min = Math.min(...all);
  const span = Math.max(max - min, 1);
  max = max + span * 0.15;
  min = min - span * 0.15;
  if (min < 0 && Math.min(...all) >= 0) min = 0;
  drawAxes(ctx, pad, w, h, max, min, 4, (v) => v.toFixed(0) + '%');
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const xAt = (i) => pad.left + (plotW * i) / (years.length - 1);
  const yAt = (v) => pad.top + plotH * (1 - (v - min) / (max - min));
  // Zero line, so negative growth reads at a glance.
  if (min < 0 && max > 0) {
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, yAt(0));
    ctx.lineTo(w - pad.right, yAt(0));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  series.forEach((s, si) => {
    ctx.strokeStyle = s.color || palette(si);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    s.values.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xAt(i), yAt(v));
      else ctx.lineTo(xAt(i), yAt(v));
    });
    ctx.stroke();
    ctx.fillStyle = s.color || palette(si);
    s.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((y, i) => ctx.fillText(String(y), xAt(i), h - pad.bottom + 8));
}

// Grouped bars: several countries side by side for one indicator.
export function drawGroupedBars(canvas, groups, labels, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas, opts.height || 280);
  const pad = { top: 24, right: 12, bottom: 34, left: 62 };
  const max = niceMax(Math.max(...groups.flatMap((g) => g.values), 1));
  drawAxes(ctx, pad, w, h, max, 0, 4, (v) => opts.formatTick ? opts.formatTick(v) : String(Math.round(v)));
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const slot = plotW / labels.length;
  const barW = Math.min(30, (slot * 0.7) / groups.length);
  labels.forEach((label, li) => {
    groups.forEach((g, gi) => {
      const v = g.values[li];
      const totalW = barW * groups.length;
      const x = pad.left + slot * li + (slot - totalW) / 2 + gi * barW;
      const y = pad.top + plotH * (1 - v / max);
      ctx.fillStyle = g.color || palette(gi);
      ctx.fillRect(x, y, barW - 2, pad.top + plotH - y);
    });
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, pad.left + slot * li + slot / 2, h - pad.bottom + 8);
  });
}
