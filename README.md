[![CountryLedger — make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![CountryLedger rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/huydieu9296/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![CountryLedger reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/huydieu9296/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# CountryLedger — National Statistics, Open & Offline

A national statistics site for eight major economies — Vietnam, the United States, China, Japan, Germany, India, Brazil and the United Kingdom — built for the [make.fun "Make the best national statistics site" bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

Every figure is real and credited: population, GDP, GDP per capita, unemployment, inflation, life expectancy, exports, internet users and CO₂ per capita, each with its source (World Bank, World Development Indicators) and year (2024; CO₂ per capita 2022, India life expectancy 2023). GDP growth runs 2019–2024.

## What it does

- **Dashboard** (`#/`): world-at-a-glance KPIs, a sortable ranking table (sort by population, GDP, GDP per capita, unemployment or inflation), a GDP bar chart, and a searchable grid of country cards.
- **Country profile** (`#/country/VNM`): key-indicator table with a rank for each figure, a 2019–2024 GDP-growth line chart with the yearly table, and one-click comparisons against other countries.
- **Compare** (`#/compare`): pick any two or three countries; a side-by-side table marks the best value in each row, plus GDP-per-capita bars and a growth comparison chart.
- **Indicators** (`#/indicators`): pick any indicator to rank all eight countries on it, with a bar chart and a ranked table.
- **Sources & methods** (`#/about`): where every number comes from and what was done to it.

## How it runs

Plain static files under `app/` — HTML, CSS and ES-module JavaScript, no build step, no network request, no framework. It opens from its own files on a desktop or a phone, offline.

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Then open http://localhost:8080 in a browser.

## Layout

- `main.ts` — the entry program (Node 22): copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored make.fun library.
- `app/` — the site itself: `index.html`, `style.css`, `main.js` (hash router), `views.js` (one render function per page), `charts.js` (canvas bar/line/grouped charts), `data.js` (the figures, with source and year).
- `screenshots/` — 4 real renders of the site running, desktop and phone.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `serve.ts` — a tiny static server for local testing.

## License

MIT. See [LICENSE](LICENSE).
