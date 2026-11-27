// Country statistics: real public figures, each with its source and year.
// Sources: World Bank, World Development Indicators (WDI), accessed November 2026.
// Population and GDP are 2024; unemployment is the modelled ILO estimate, 2024;
// inflation is consumer-price inflation, 2024; life expectancy is 2024 (India 2023);
// exports are goods and services, 2024; internet users are 2024; CO2 per capita is 2022.
// GDP growth is annual % growth of GDP, 2019-2024, World Bank WDI. Figures are rounded.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const INDICATORS = [
  { key: 'population', label: 'Population', unit: 'million people', format: 'millions', year: 2024, source: 'World Bank WDI' },
  { key: 'gdp', label: 'GDP', unit: 'US$ billion', format: 'billions', year: 2024, source: 'World Bank WDI' },
  { key: 'gdpPerCapita', label: 'GDP per capita', unit: 'US$', format: 'dollars', year: 2024, source: 'World Bank WDI' },
  { key: 'unemployment', label: 'Unemployment', unit: '% of labour force', format: 'percent', year: 2024, source: 'World Bank WDI (modelled ILO estimate)' },
  { key: 'inflation', label: 'Inflation', unit: '% per year', format: 'percent', year: 2024, source: 'World Bank WDI' },
  { key: 'lifeExpectancy', label: 'Life expectancy', unit: 'years', format: 'years', year: 2024, source: 'World Bank WDI' },
  { key: 'exports', label: 'Exports of goods & services', unit: 'US$ billion', format: 'billions', year: 2024, source: 'World Bank WDI' },
  { key: 'internetUsers', label: 'Internet users', unit: '% of population', format: 'percent', year: 2024, source: 'World Bank WDI' },
  { key: 'co2PerCapita', label: 'CO2 emissions per capita', unit: 'tonnes', format: 'tonnes', year: 2022, source: 'World Bank WDI' },
];

export const COUNTRIES = [
  {
    code: 'VNM', name: 'Vietnam', region: 'South-East Asia', capital: 'Hanoi', currency: 'Vietnamese dong (VND)',
    blurb: 'A fast-growing manufacturing economy on the South China Sea coast, Vietnam has averaged over 6% annual GDP growth across the last decade and is now one of the world\u2019s largest exporters of electronics, textiles and phones.',
    population: 101.0, gdp: 476.4, gdpPerCapita: 4711, unemployment: 2.2, inflation: 3.6,
    lifeExpectancy: 75.7, exports: 405.5, internetUsers: 79.1, co2PerCapita: 2.5,
    growth: [7.0, 2.9, 2.6, 8.0, 5.1, 7.1],
  },
  {
    code: 'USA', name: 'United States', region: 'North America', capital: 'Washington, D.C.', currency: 'US dollar (USD)',
    blurb: 'The world\u2019s largest economy by nominal GDP, the United States combines a huge services sector with leading technology, finance and energy industries, and the world\u2019s deepest capital markets.',
    population: 340.1, gdp: 29184, gdpPerCapita: 85809, unemployment: 4.0, inflation: 2.9,
    lifeExpectancy: 78.4, exports: 3247, internetUsers: 92.0, co2PerCapita: 14.3,
    growth: [2.6, -2.2, 6.1, 2.5, 2.9, 2.8],
  },
  {
    code: 'CHN', name: 'China', region: 'East Asia', capital: 'Beijing', currency: 'Chinese yuan (CNY)',
    blurb: 'The world\u2019s second-largest economy and its biggest exporter, China leads global manufacturing and is the largest market for electric vehicles, solar panels and smartphones.',
    population: 1411.8, gdp: 18532, gdpPerCapita: 13125, unemployment: 5.1, inflation: 0.2,
    lifeExpectancy: 79.0, exports: 3603, internetUsers: 77.5, co2PerCapita: 8.0,
    growth: [6.0, 2.2, 8.6, 3.0, 5.2, 5.0],
  },
  {
    code: 'JPN', name: 'Japan', region: 'East Asia', capital: 'Tokyo', currency: 'Japanese yen (JPY)',
    blurb: 'The world\u2019s fourth-largest economy, Japan pairs advanced manufacturing and robotics with the longest life expectancy of any large country, and a population that has been shrinking since 2009.',
    population: 124.1, gdp: 4026, gdpPerCapita: 32445, unemployment: 2.5, inflation: 2.7,
    lifeExpectancy: 84.0, exports: 902, internetUsers: 83.7, co2PerCapita: 8.5,
    growth: [-0.4, -4.2, 2.7, 0.9, 1.5, -0.1],
  },
  {
    code: 'DEU', name: 'Germany', region: 'Western Europe', capital: 'Berlin', currency: 'Euro (EUR)',
    blurb: 'Europe\u2019s largest economy, built on cars, machinery and chemicals. Germany is the world\u2019s third-largest exporter and runs one of the largest trade surpluses of any country.',
    population: 84.6, gdp: 4659, gdpPerCapita: 55059, unemployment: 3.4, inflation: 2.2,
    lifeExpectancy: 81.4, exports: 1912, internetUsers: 93.0, co2PerCapita: 7.0,
    growth: [1.1, -3.8, 3.6, 1.9, -0.3, -0.2],
  },
  {
    code: 'IND', name: 'India', region: 'South Asia', capital: 'New Delhi', currency: 'Indian rupee (INR)',
    blurb: 'The world\u2019s most populous country and its fastest-growing large economy, India is now the fifth-largest economy and a major exporter of software services, medicines and refined fuels.',
    population: 1450.9, gdp: 3909, gdpPerCapita: 2695, unemployment: 4.9, inflation: 4.7,
    lifeExpectancy: 68.0, exports: 825, internetUsers: 52.0, co2PerCapita: 2.0,
    growth: [3.9, -5.8, 9.7, 7.0, 7.8, 6.5],
  },
  {
    code: 'BRA', name: 'Brazil', region: 'South America', capital: 'Bras\u00edlia', currency: 'Brazilian real (BRL)',
    blurb: 'South America\u2019s largest economy, Brazil is a farming and mining powerhouse \u2014 the top exporter of soybeans, coffee, sugar and iron ore \u2014 with a large domestic market of over 216 million people.',
    population: 216.4, gdp: 2171, gdpPerCapita: 10033, unemployment: 6.8, inflation: 4.4,
    lifeExpectancy: 76.4, exports: 391, internetUsers: 84.0, co2PerCapita: 2.2,
    growth: [1.2, -3.3, 5.3, 3.0, 2.9, 3.4],
  },
  {
    code: 'GBR', name: 'United Kingdom', region: 'Northern Europe', capital: 'London', currency: 'Pound sterling (GBP)',
    blurb: 'The world\u2019s sixth-largest economy, the United Kingdom is a services-led economy with London as a global finance centre, and a leading exporter of financial, legal and creative services.',
    population: 69.3, gdp: 3380, gdpPerCapita: 48771, unemployment: 4.3, inflation: 2.5,
    lifeExpectancy: 81.3, exports: 1050, internetUsers: 96.0, co2PerCapita: 5.0,
    growth: [1.6, -10.3, 8.6, 4.8, 0.3, 1.1],
  },
];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === (code || '').toUpperCase()) || null;
}

export function indicatorByKey(key) {
  return INDICATORS.find((i) => i.key === key) || INDICATORS[0];
}

export function formatValue(key, value) {
  const ind = indicatorByKey(key);
  if (value === null || value === undefined) return '\u2014';
  switch (ind.format) {
    case 'millions': return value.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' m';
    case 'billions': return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' bn';
    case 'dollars': return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    case 'percent': return value.toFixed(1) + '%';
    case 'years': return value.toFixed(1) + ' yrs';
    case 'tonnes': return value.toFixed(1) + ' t';
    default: return String(value);
  }
}

export function rankOf(code, key) {
  const sorted = [...COUNTRIES].sort((a, b) => b[key] - a[key]);
  return sorted.findIndex((c) => c.code === code) + 1;
}
