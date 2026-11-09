/**
 * Browser entry point. Every page is prerendered at build time, so this
 * hydrates the HTML that is already there instead of building it from scratch.
 */
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { pathForLegacyHash, routeFromPath } from './routes';
import './index.css';

// Links shared before the site had real URLs (#/resources/templates, #/notes/<slug>) still land on their page.
const legacyPath = pathForLegacyHash(window.location.hash);
if (legacyPath) {
  window.location.replace(legacyPath);
} else {
  const container = document.getElementById('root')!;
  const route = routeFromPath(window.location.pathname);
  const app = (
    <StrictMode>
      <App route={route} />
    </StrictMode>
  );
  // Hydrate only HTML prerendered for this very page. `vite dev` serves the bare template, and a
  // server without 404.html support may answer an unknown path with the home page.
  const prerendered = (container.firstElementChild as HTMLElement | null)?.dataset.page;
  if (prerendered === route.page) hydrateRoot(container, app);
  else {
    container.replaceChildren();
    createRoot(container).render(app);
  }
}
