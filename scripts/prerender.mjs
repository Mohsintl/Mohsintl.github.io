/**
 * Turns the client build into one static HTML page per route, so search
 * engines, link previews and AI tools that don't run JavaScript still see
 * the content. Also writes llms.txt, sitemap.xml and robots.txt.
 *
 * Runs after `vite build` (client, into build/) and
 * `vite build --ssr src/entry-server.tsx --outDir build-ssr`.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build');
const ssrDir = join(root, 'build-ssr');

const { render, ALL_ROUTES, pageMeta, pathFor, SITE_URL, site } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

const template = await readFile(join(buildDir, 'index.html'), 'utf8');
const ROOT_TAG = '<div id="root"></div>';
if (!template.includes(ROOT_TAG)) throw new Error(`build/index.html has no ${ROOT_TAG} to fill`);

const escapeAttr = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headFor(route) {
  const { title, description } = pageMeta(route);
  const notFound = route.page === 'not-found';
  const url = `${SITE_URL}${pathFor(route)}`;
  const tags = [
    `<meta name="description" content="${escapeAttr(description)}" />`,
    notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${route.page === 'note' ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    ...(notFound ? [] : [`<meta property="og:url" content="${url}" />`]),
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta name="twitter:card" content="summary_large_image" />`,
    '<link rel="alternate" type="text/plain" title="Plain-text summary for AI tools" href="/llms.txt" />',
  ];
  return { title, tags };
}

let pages = 0;
for (const route of ALL_ROUTES) {
  const { title, tags } = headFor(route);
  let html = template
    .replace(ROOT_TAG, `<div id="root">${render(route)}</div>`)
    .replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`);
  const path = pathFor(route);
  const file = path.endsWith('/') ? join(buildDir, path, 'index.html') : join(buildDir, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  pages++;
}

const { profile, experience, certifications, projects, contributions, skills, notes } = site;
const live = ALL_ROUTES.filter((r) => r.page !== 'not-found');

const llms = [
  `# ${profile.fullName} (${profile.name})`,
  '',
  `> ${profile.role}. ${profile.tagline}`,
  '',
  ...profile.about,
  '',
  `- Site: ${SITE_URL}/`,
  `- GitHub: ${profile.github}`,
  `- LinkedIn: ${profile.linkedin}`,
  `- Email: ${profile.email}`,
  '',
  '## Experience',
  '',
  ...experience.flatMap((job) => [
    `${job.company} (${job.context})`,
    '',
    ...job.roles.flatMap((role) => [`- ${role.title}, ${role.dates}`, ...role.points.map((point) => `  - ${point}`)]),
    '',
  ]),
  '## Projects',
  '',
  ...projects.map((p) => `- [${p.name}](${p.url}): ${p.summary} (${p.tech.join(', ')})`),
  '',
  '## Open-source contributions',
  '',
  ...contributions.flatMap((c) => c.items.map((i) => `- ${c.project} (${c.about}): [${i.label}](${i.url}), ${i.status}`)),
  '',
  '## Notes',
  '',
  ...notes.map((n) => `- [${n.title}](${SITE_URL}${pathFor({ page: 'note', note: n })}): ${n.summary}`),
  '',
  '## Skills',
  '',
  ...skills.map((s) => `- ${s.group}: ${s.items.join(', ')}`),
  `- Certifications: ${certifications.join(', ')}`,
  '',
  '## QA resources',
  '',
  `- [Cheat sheets, templates, test cases and test scripts](${SITE_URL}/resources/)`,
  '',
].join('\n');
await writeFile(join(buildDir, 'llms.txt'), llms);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...live.map((r) => `  <url><loc>${SITE_URL}${pathFor(r)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(join(buildDir, 'sitemap.xml'), sitemap);
await writeFile(join(buildDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${pages} pages, plus llms.txt, sitemap.xml and robots.txt`);
