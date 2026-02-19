import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import App from './App.vue';
import { routes } from './router';
import './styles/main.css';
import './styles/prism.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';

export const createApp = ViteSSG(
  App,
  { routes: routes as import('vue-router').RouteRecordRaw[] },
  ({ app, router, initialState, isClient }) => {
    const pinia = createPinia();
    app.use(pinia);

    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value;
    } else {
      pinia.state.value = initialState.pinia ?? {};
    }

    router.beforeEach(async (to) => {
      if (import.meta.env.SSR) {
        const version = to.params.version as string | undefined;
        if (version) {
          const { useDocsStore } = await import('./stores/docs');
          const { useGuidesStore } = await import('./stores/guides');
          const { useVersionStore } = await import('./stores/version');
          const docsStore = useDocsStore(pinia);
          const guidesStore = useGuidesStore(pinia);
          const versionStore = useVersionStore(pinia);

          await versionStore.loadVersions();
          versionStore.setVersion(version);

          const key = version === 'latest' ? 'latest' : version;
          if (to.path.includes('/docs')) await docsStore.loadDocs(key);
          if (to.path.includes('/guides')) await guidesStore.loadGuides(key);

          initialState.pinia = pinia.state.value;
        }
      }
    });

    router.afterEach(() => {
      if (!isClient) return;
      queueMicrotask(() => Prism.highlightAll());
    });
  },
);
