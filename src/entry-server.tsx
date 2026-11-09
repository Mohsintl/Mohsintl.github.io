/** Build-time renderer: scripts/prerender.mjs turns each route into a static HTML page. */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ALL_ROUTES, pageMeta, pathFor, SITE_URL, type Route } from './routes';
import { certifications, contributions, experience, profile, projects, skills } from './data/profile';
import { notes } from './data/notes';

export { ALL_ROUTES, pageMeta, pathFor, SITE_URL };
export const site = { profile, experience, certifications, projects, contributions, skills, notes };

export function render(route: Route): string {
  return renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>,
  );
}
