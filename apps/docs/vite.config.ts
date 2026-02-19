import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { ViteSSGOptions } from 'vite-ssg';
import { resolve, join } from 'path';
import { readFileSync, existsSync, copyFileSync } from 'fs';

const DOCS_PUBLIC = resolve(__dirname, 'public/docs');

async function includedRoutes(
  _paths: string[],
  _routes: Readonly<import('vue-router').RouteRecordRaw[]>,
): Promise<string[]> {
  const routes: string[] = ['/', '/changelog'];

  if (!existsSync(resolve(DOCS_PUBLIC, 'versions.json'))) {
    console.warn('[included-routes] versions.json not found, using minimal routes');
    return routes;
  }

  const versionsData = JSON.parse(
    readFileSync(resolve(DOCS_PUBLIC, 'versions.json'), 'utf-8'),
  ) as { versions: string[]; latest: string };

  const versions = versionsData.versions ?? [];
  const versionParams = ['latest', ...versions];

  for (const version of versionParams) {
    const versionPath = version === 'latest' ? 'latest' : `v${version}`;
    const mainPath = resolve(DOCS_PUBLIC, versionPath, 'main.json');
    if (!existsSync(mainPath)) continue;

    const base = `/v/${version}`;
    routes.push(base);
    routes.push(`${base}/guides`);
    routes.push(`${base}/docs/classes`);
    routes.push(`${base}/docs/typedefs`);
    routes.push(`${base}/api`);

    const main = JSON.parse(readFileSync(mainPath, 'utf-8')) as {
      classes?: { name: string }[];
      interfaces?: { name: string }[];
      enums?: { name: string }[];
    };
    for (const c of main.classes ?? []) routes.push(`${base}/docs/classes/${c.name}`);
    for (const i of main.interfaces ?? []) routes.push(`${base}/docs/typedefs/${i.name}`);
    for (const e of main.enums ?? []) routes.push(`${base}/docs/typedefs/${e.name}`);

    const guidesPath = resolve(DOCS_PUBLIC, versionPath, 'guides.json');
    if (existsSync(guidesPath)) {
      const guides = JSON.parse(readFileSync(guidesPath, 'utf-8')) as { slug: string }[];
      for (const g of guides) routes.push(`${base}/guides/${g.slug}`);
    }
  }

  console.log(`[included-routes] Generated ${routes.length} routes for SSG`);
  return routes;
}

/** Copy index.html to 404.html so Vercel serves the SPA for unmatched routes */
function vercel404Plugin() {
  return {
    name: 'vercel-404',
    closeBundle() {
      const outDir = join(__dirname, 'dist');
      copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [vue(), vercel404Plugin()],
  ssgOptions: {
    includedRoutes,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3333,
  },
});
