// Bootstrap: hash routing for the five pages. No framework, no network.
import { renderAbout, renderCompare, renderCountry, renderHome, renderIndicators } from './views.js';

function route() {
  const hash = location.hash || '#/';
  const [path, query = ''] = hash.slice(2).split('?');
  const parts = path.split('/').filter(Boolean);
  window.scrollTo(0, 0);
  if (parts.length === 0) return renderHome();
  if (parts[0] === 'country' && parts[1]) return renderCountry(parts[1]);
  if (parts[0] === 'compare') return renderCompare(query);
  if (parts[0] === 'indicators') return renderIndicators(query);
  if (parts[0] === 'about') return renderAbout();
  return renderHome();
}

window.addEventListener('hashchange', route);
route();
