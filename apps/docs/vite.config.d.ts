import type { ViteSSGOptions } from 'vite-ssg';

declare module 'vite' {
  interface UserConfig {
    ssgOptions?: Partial<ViteSSGOptions>;
  }
}
