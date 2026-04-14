import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    dts(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Header',
      formats: ['es', 'cjs'],
      fileName: 'header',
    },
    rollupOptions: {
      external: [
        '@editorjs/editorjs',
        '@editorjs/model',
        '@editorjs/sdk',
      ],
    },
    sourcemap: true,
  },
  css: {
    modules: {
      generateScopedName: (name) => `editorjs-${name}`,
      localsConvention: 'dashes',
    },
  },
  esbuild: {
    target: 'esnext',
  },
});
