// Views: hash routing and one render function per page. Every page is reachable
// from the header nav, and every control on a page does what it says.

import { COUNTRIES, INDICATORS, YEARS, countryByCode, formatValue, indicatorByKey, rankOf } from './data.js';
import { drawBarChart, drawGroupedBars, drawLineChart, palette } from './charts.js';

const app = document.getElementById('app');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function nav(active) {
  const links = [
    ['#/', 'Dashboard', 'home'],
    ['#/compare', 'Compare', 'compare'],
    ['#/indicators', 'Indicators', 'indicators'],
    ['#/about', 'Sources & methods', 'about'],
  ];
  document.querySelectorAll('.site-header nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.page === active);
  });
  return links;
}

function sourceLine(ind) {
  return `<p class="source-line">Source: <b>${esc(ind.source)}</b> &middot; ${ind.label}, ${ind.year} &middot; figures rounded. See <a href="#/about">Sources &amp; methods</a> for notes.</p>`;
}

function kpiCard(label, value, sub) {
  return `<div class="kpi"><div class="kpi-label">${esc(label)}</div><div class="kpi-value">${esc(value)}</div><div class="kpi-sub">${esc(sub)}</div></div>`;
}

// ---- Dashboard: world at a glance, ranking table, GDP chart, country cards ----
export function renderHome() {
  nav('home');
  const totalPop = COUNTRIES.reduce((s, c) => s + c.population, 0);
  const totalGdp = COUNTRIES.reduce((s, c) => s + c.gdp, 0);
  const avgLife = COUNTRIES.reduce((s, c) => s + c.lifeExpectancy, 0) / COUNTRIES.length;
  const topExporter = [...COUNTRIES].sort((a, b) => b.exports - a.exports)[0];

  const byGdp = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp);
  const rows = byGdp.map((c) => `<tr>
    <td><a href="#/country/${c.code}">${esc(c.name)}</a></td>
    <td class="num">${formatValue('population', c.population)}</td>
    <td class="num">${formatValue('gdp', c.gdp)}</td>
    <td class="num">${formatValue('gdpPerCapita', c.gdpPerCapita)}</td>
    <td class="num">${formatValue('unemployment', c.unemployment)}</td>
    <td class="num">${formatValue('inflation', c.inflation)}</td>
  </tr>`).join('');

  const cards = COUNTRIES.map((c) => `<a class="country-card" href="#/country/${c.code}">
    <div class="cc-name">${esc(c.name)}</div>
    <div class="cc-region">${esc(c.region)} &middot; capital ${esc(c.capital)}</div>
    <div class="cc-stats">GDP <b>${formatValue('gdp', c.gdp)}</b> &middot; ${formatValue('population', c.population)} people</div>
    <div class="cc-stats">Growth 2024: <b>${c.growth[5].toFixed(1)}%</b></div>
  </a>`).join('');

  app.innerHTML = `
  <div class="hero"><div class="wrap">
    <h1>National statistics, open and offline</h1>
    <p>Population, GDP, jobs, prices and trade for eight major economies &mdash; real figures with their source and year, charts you can read at a glance, and side-by-side comparisons. Everything on this site lives in its own files: no network request, no account, no tracking.</p>
    <p class="updated">Latest data: 2024 (CO&#8322; per capita: 2022) &middot; Source: World Bank, World Development Indicators</p>
  </div></div>
  <div class="wrap">
    <section>
      <div class="kpi-grid">
        ${kpiCard('Countries covered', String(COUNTRIES.length), 'across 4 continents')}
        ${kpiCard('Combined population', totalPop.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' m', 'of the 8 economies')}
        ${kpiCard('Combined GDP', '$' + totalGdp.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' bn', '2024, current US$')}
        ${kpiCard('Average life expectancy', avgLife.toFixed(1) + ' yrs', 'mean of the 8 countries')}
      </div>
    </section>
    <section>
      <h2>Biggest economies, ranked by GDP</h2>
      <p class="section-note">Click a column header to sort. Click a country for its full profile.</p>
      <div class="card"><div class="table-scroll"><table id="rank-table">
        <thead><tr>
          <th><button class="secondary" data-sort="name">Country</button></th>
          <th class="num"><button class="secondary" data-sort="population">Population</button></th>
          <th class="num"><button class="secondary" data-sort="gdp">GDP</button></th>
          <th class="num"><button class="secondary" data-sort="gdpPerCapita">GDP per capita</button></th>
          <th class="num"><button class="secondary" data-sort="unemployment">Unemployment</button></th>
          <th class="num"><button class="secondary" data-sort="inflation">Inflation</button></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      ${sourceLine(indicatorByKey('gdp'))}</div>
    </section>
    <section>
      <h2>GDP, 2024 &mdash; the eight economies side by side</h2>
      <p class="section-note">Current US$, World Bank WDI 2024. ${esc(topExporter.name)} is the largest exporter of the eight, at ${formatValue('exports', topExporter.exports)}.</p>
      <div class="card chart-box"><canvas id="gdp-chart" aria-label="Bar chart of GDP by country, 2024"></canvas></div>
    </section>
    <section>
      <h2>Browse by country</h2>
      <p class="section-note">Search or pick a country to open its profile: key indicators, six years of growth, and how it ranks.</p>
      <div class="controls">
        <div><label for="country-search">Search countries</label>
        <input type="search" id="country-search" placeholder="Type a name, e.g. Vietnam"></div>
      </div>
      <div class="country-grid" id="country-grid">${cards}</div>
      <p class="source-line" id="search-note"></p>
    </section>
  </div>`;

  drawBarChart(document.getElementById('gdp-chart'), byGdp.map((c, i) => ({
    label: c.code, value: c.gdp, color: palette(i),
    labelValue: '$' + Math.round(c.gdp).toLocaleString('en-US') + 'bn',
  })), { formatTick: (v) => '$' + Math.round(v).toLocaleString('en-US') + 'bn' });

  // Sortable ranking table.
  let sortKey = 'gdp';
  let sortDir = -1;
  document.querySelectorAll('#rank-table button[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (key === sortKey) sortDir = -sortDir;
      else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
      const sorted = [...COUNTRIES].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * sortDir;
      });
      document.querySelector('#rank-table tbody').innerHTML = sorted.map((c) => `<tr>
        <td><a href="#/country/${c.code}">${esc(c.name)}</a></td>
        <td class="num">${formatValue('population', c.population)}</td>
        <td class="num">${formatValue('gdp', c.gdp)}</td>
        <td class="num">${formatValue('gdpPerCapita', c.gdpPerCapita)}</td>
        <td class="num">${formatValue('unemployment', c.unemployment)}</td>
        <td class="num">${formatValue('inflation', c.inflation)}</td>
      </tr>`).join('');
    });
  });

  // Live search over the country cards.
  const search = document.getElementById('country-search');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('#country-grid .country-card').forEach((card) => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
      if (match) shown += 1;
    });
    document.getElementById('search-note').textContent =
      q ? `${shown} of ${COUNTRIES.length} countries match \u201c${search.value.trim()}\u201d.` : '';
  });
}

// ---- Country profile ----
export function renderCountry(code) {
  const c = countryByCode(code);
  if (!c) {
    nav('home');
    app.innerHTML = `<div class="wrap"><section><div class="card">
      <h2>Country not found</h2><p>There is no country with code \u201c${esc(code)}\u201d in this edition.
      <a href="#/">Back to the dashboard</a> to browse the ${COUNTRIES.length} countries covered.</p></div></section></div>`;
    return;
  }
  nav('home');
  const others = COUNTRIES.filter((x) => x.code !== c.code);
  const compareLinks = others.slice(0, 3).map((o) =>
    `<a href="#/compare?a=${c.code}&amp;b=${o.code}">vs ${esc(o.name)}</a>`).join(' &middot; ');

  const indRows = INDICATORS.map((ind) => `<tr>
    <td>${esc(ind.label)}</td>
    <td class="num"><b>${formatValue(ind.key, c[ind.key])}</b></td>
    <td class="num">${ind.unit}</td>
    <td class="num">#${rankOf(c.code, ind.key)} of ${COUNTRIES.length}</td>
    <td class="num">${ind.year}</td>
  </tr>`).join('');

  const avgGrowth = c.growth.reduce((s, v) => s + v, 0) / c.growth.length;

  app.innerHTML = `
  <div class="wrap">
    <section>
      <p><a href="#/">&larr; All countries</a></p>
      <h2>${esc(c.name)}</h2>
      <p class="section-note">${esc(c.region)} &middot; Capital: ${esc(c.capital)} &middot; Currency: ${esc(c.currency)}</p>
      <p>${esc(c.blurb)}</p>
      <div class="kpi-grid">
        ${kpiCard('Population', formatValue('population', c.population), '2024, World Bank')}
        ${kpiCard('GDP', formatValue('gdp', c.gdp), '2024, current US$')}
        ${kpiCard('GDP per capita', formatValue('gdpPerCapita', c.gdpPerCapita), '2024, current US$')}
        ${kpiCard('Growth 2024', c.growth[5].toFixed(1) + '%', '6-year average ' + avgGrowth.toFixed(1) + '%')}
      </div>
    </section>
    <section>
      <h2>GDP growth, 2019&ndash;2024</h2>
      <p class="section-note">Annual % growth of GDP, World Bank WDI. The 2020 dip is the COVID-19 pandemic; the 2021 rebound follows it.</p>
      <div class="card chart-box"><canvas id="growth-chart" aria-label="Line chart of annual GDP growth, 2019 to 2024"></canvas></div>
      <div class="card"><div class="table-scroll"><table>
        <thead><tr><th>Year</th>${YEARS.map((y) => `<th class="num">${y}</th>`).join('')}</tr></thead>
        <tbody><tr><td>GDP growth</td>${c.growth.map((v) => `<td class="num">${v.toFixed(1)}%</td>`).join('')}</tr></tbody>
      </table></div>${sourceLine({ label: 'GDP growth', source: 'World Bank WDI', year: 2024 })}</div>
    </section>
    <section>
      <h2>Key indicators</h2>
      <p class="section-note">Every figure carries its year. Rank is among the ${COUNTRIES.length} countries in this edition.</p>
      <div class="card"><div class="table-scroll"><table>
        <thead><tr><th>Indicator</th><th class="num">Value</th><th class="num">Unit</th><th class="num">Rank</th><th class="num">Year</th></tr></thead>
        <tbody>${indRows}</tbody>
      </table></div>
      <p class="source-line">Source: <b>World Bank, World Development Indicators</b>. Unemployment is the modelled ILO estimate; life expectancy for India is 2023; CO&#8322; per capita is 2022.</p></div>
    </section>
    <section>
      <div class="callout"><b>Compare ${esc(c.name)}:</b> ${compareLinks} &mdash; or open the <a href="#/compare">full comparison page</a> to pick any three countries.</div>
    </section>
  </div>`;

  drawLineChart(document.getElementById('growth-chart'),
    [{ name: c.name, values: c.growth, color: palette(0) }], YEARS);
}

// ---- Compare two or three countries ----
export function renderCompare(query) {
  nav('compare');
  const params = new URLSearchParams(query);
  const pick = (key, fallback) => countryByCode(params.get(key)) || COUNTRIES[fallback];
  let a = pick('a', 0);
  let b = pick('b', 1);
  let d = params.get('c') ? countryByCode(params.get('c')) : null;
  if (b.code === a.code) b = COUNTRIES.find((x) => x.code !== a.code);
  if (d && (d.code === a.code || d.code === b.code)) d = null;
  const chosen = d ? [a, b, d] : [a, b];

  const options = (selected) => COUNTRIES.map((c) =>
    `<option value="${c.code}"${c.code === selected.code ? ' selected' : ''}>${esc(c.name)}</option>`).join('');

  const rows = INDICATORS.map((ind) => {
    const cells = chosen.map((c) => `<td class="num"><b>${formatValue(ind.key, c[ind.key])}</b></td>`).join('');
    const best = chosen.reduce((bestC, c) => {
      const better = ind.key === 'unemployment' || ind.key === 'inflation' || ind.key === 'co2PerCapita'
        ? c[ind.key] < bestC[ind.key] : c[ind.key] > bestC[ind.key];
      return better ? c : bestC;
    }, chosen[0]);
    return `<tr><td>${esc(ind.label)}<br><span style="color:var(--muted);font-size:13px">${ind.unit}, ${ind.year}</span></td>${cells}
      <td class="num">${esc(best.name)}</td></tr>`;
  }).join('');

  app.innerHTML = `
  <div class="wrap">
    <section>
      <h2>Compare countries</h2>
      <p class="section-note">Pick two or three countries. The table marks the best value in each row &mdash; lowest wins for unemployment, inflation and CO&#8322; per capita; highest wins elsewhere. The chart below shows GDP per capita for the same set.</p>
      <div class="card">
        <div class="controls">
          <div><label for="cmp-a">Country A</label><select id="cmp-a">${options(a)}</select></div>
          <div><label for="cmp-b">Country B</label><select id="cmp-b">${options(b)}</select></div>
          <div><label for="cmp-c">Country C (optional)</label><select id="cmp-c"><option value="">None</option>${options(d || { code: '' })}</select></div>
          <div><button id="cmp-go">Compare</button></div>
        </div>
        <div class="table-scroll"><table>
          <thead><tr><th>Indicator</th>${chosen.map((c) => `<th class="num"><a href="#/country/${c.code}">${esc(c.name)}</a></th>`).join('')}<th class="num">Best of these</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        <p class="source-line">Source: <b>World Bank, World Development Indicators</b>, 2024 (CO&#8322; per capita 2022; India life expectancy 2023).</p>
      </div>
    </section>
    <section>
      <h2>GDP per capita, 2024</h2>
      <div class="card chart-box"><canvas id="cmp-chart" aria-label="Bar chart comparing GDP per capita"></canvas>
      <div class="legend">${chosen.map((c, i) => `<span><span class="swatch" style="background:${palette(i)}"></span>${esc(c.name)}</span>`).join('')}</div></div>
    </section>
    <section>
      <h2>Growth, 2019&ndash;2024</h2>
      <p class="section-note">Annual % GDP growth for the same countries, so a one-year spike does not hide the trend.</p>
      <div class="card chart-box"><canvas id="cmp-growth" aria-label="Line chart comparing GDP growth"></canvas>
      <div class="legend">${chosen.map((c, i) => `<span><span class="swatch" style="background:${palette(i)}"></span>${esc(c.name)}</span>`).join('')}</div></div>
    </section>
  </div>`;

  document.getElementById('cmp-go').addEventListener('click', () => {
    const ca = document.getElementById('cmp-a').value;
    const cb = document.getElementById('cmp-b').value;
    const cc = document.getElementById('cmp-c').value;
    if (ca === cb) {
      alert('Pick two different countries to compare.');
      return;
    }
    location.hash = `#/compare?a=${ca}&b=${cb}${cc ? '&c=' + cc : ''}`;
  });

  drawBarChart(document.getElementById('cmp-chart'), chosen.map((c, i) => ({
    label: c.code, value: c.gdpPerCapita, color: palette(i),
    labelValue: '$' + Math.round(c.gdpPerCapita).toLocaleString('en-US'),
  })), { formatTick: (v) => '$' + Math.round(v).toLocaleString('en-US') });

  drawLineChart(document.getElementById('cmp-growth'),
    chosen.map((c, i) => ({ name: c.name, values: c.growth, color: palette(i) })), YEARS);
}

// ---- Indicator explorer: one indicator across all countries ----
export function renderIndicators(query) {
  nav('indicators');
  const params = new URLSearchParams(query);
  const ind = indicatorByKey(params.get('key')) || INDICATORS[0];
  const sorted = [...COUNTRIES].sort((a, b) => b[ind.key] - a[ind.key]);

  const rows = sorted.map((c, i) => `<tr>
    <td>${i + 1}</td>
    <td><a href="#/country/${c.code}">${esc(c.name)}</a></td>
    <td class="num"><b>${formatValue(ind.key, c[ind.key])}</b></td>
    <td class="num">${ind.unit}</td>
  </tr>`).join('');

  app.innerHTML = `
  <div class="wrap">
    <section>
      <h2>Explore an indicator</h2>
      <p class="section-note">Choose any indicator to rank all ${COUNTRIES.length} countries on it, with a chart and a table.</p>
      <div class="card">
        <div class="controls">
          <div><label for="ind-select">Indicator</label>
          <select id="ind-select">${INDICATORS.map((x) => `<option value="${x.key}"${x.key === ind.key ? ' selected' : ''}>${esc(x.label)} (${x.year})</option>`).join('')}</select></div>
          <div><button id="ind-go">Show indicator</button></div>
        </div>
        <h3>${esc(ind.label)} &mdash; ${ind.year}</h3>
        <div class="chart-box"><canvas id="ind-chart" aria-label="Bar chart of ${esc(ind.label)} by country"></canvas></div>
        ${sourceLine(ind)}
      </div>
    </section>
    <section>
      <div class="card"><div class="table-scroll"><table>
        <thead><tr><th>Rank</th><th>Country</th><th class="num">Value</th><th class="num">Unit</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div>
    </section>
  </div>`;

  document.getElementById('ind-go').addEventListener('click', () => {
    location.hash = '#/indicators?key=' + document.getElementById('ind-select').value;
  });
  document.getElementById('ind-select').addEventListener('change', (e) => {
    location.hash = '#/indicators?key=' + e.target.value;
  });

  drawBarChart(document.getElementById('ind-chart'), sorted.map((c, i) => ({
    label: c.code, value: c[ind.key], color: palette(i),
    labelValue: formatValue(ind.key, c[ind.key]),
  })), {
    formatTick: (v) => ind.format === 'percent' ? v.toFixed(0) + '%' : ind.format === 'dollars' ? '$' + Math.round(v).toLocaleString('en-US') : Math.round(v).toLocaleString('en-US'),
  });
}

// ---- Sources & methods ----
export function renderAbout() {
  nav('about');
  app.innerHTML = `
  <div class="wrap">
    <section>
      <h2>Sources &amp; methods</h2>
      <p class="section-note">Where every number on this site comes from, and what was done to it.</p>
      <div class="card">
        <h3>Sources</h3>
        <p>All figures come from the <b>World Bank, World Development Indicators (WDI)</b>, accessed November 2026. WDI is the World Bank\u2019s primary collection of development indicators, compiled from officially recognised international sources.</p>
        <ul>
          <li><b>Population, GDP, GDP per capita, inflation, exports, internet users</b> &mdash; 2024, World Bank WDI.</li>
          <li><b>Unemployment</b> &mdash; 2024, modelled ILO estimate published through World Bank WDI.</li>
          <li><b>Life expectancy at birth</b> &mdash; 2024, World Bank WDI (India: 2023, the latest year published).</li>
          <li><b>CO&#8322; emissions per capita</b> &mdash; 2022, World Bank WDI, the latest year published for this indicator.</li>
          <li><b>GDP growth, 2019&ndash;2024</b> &mdash; annual % growth of GDP, World Bank WDI.</li>
        </ul>
        <h3>Methods</h3>
        <ul>
          <li>Figures are shown rounded to one decimal place or to whole dollars; rounding never changes a ranking.</li>
          <li>GDP is in current US dollars; GDP per capita divides it by mid-year population.</li>
          <li>On the compare page, \u201cbest\u201d means lowest for unemployment, inflation and CO&#8322; per capita, and highest for every other indicator.</li>
          <li>This edition covers eight major economies. It is a snapshot, not a database: for the full series and the underlying country data, use the World Bank\u2019s data portal.</li>
        </ul>
        <h3>About this site</h3>
        <p><b>CountryLedger</b> is an original site built for the make.fun \u201cbest national statistics site\u201d bounty. Its design, text and charts are its own; its figures are public statistics credited above. It is plain static files &mdash; HTML, CSS and JavaScript with no build step and no network request &mdash; so it opens from its own files on a desktop or a phone, offline.</p>
      </div>
    </section>
    <section>
      <div class="card">
        <h3>All eight countries</h3>
        <p>${COUNTRIES.map((c) => `<a href="#/country/${c.code}">${esc(c.name)}</a>`).join(' &middot; ')}</p>
        <p class="source-line">Questions about a figure? Every figure on a country page names its source and year.</p>
      </div>
    </section>
  </div>`;
}
