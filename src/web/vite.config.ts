import path, { resolve } from "path";
import { defineConfig } from 'vite'
import { WatcherOptions } from "rollup";
import preact from '@preact/preset-vite'
import svgr from "vite-plugin-svgr";

const output = path.resolve(__dirname, '..', '..', 'server', 'resources', 'crz', 'web');

console.log(__dirname, '..', '..', 'server', 'resources', 'crz', 'web')

const watcherOptions: WatcherOptions = {

};

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  publicDir: resolve(__dirname, "public"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: output,
    emptyOutDir: true,
    watch: watcherOptions,
    copyPublicDir: true,
  },
  plugins: [svgr(), preact()]
})
