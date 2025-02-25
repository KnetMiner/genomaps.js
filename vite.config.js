import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";
import { libInjectCss } from "vite-plugin-lib-inject-css";
export default defineConfig({
  plugins: [
    libInjectCss(),
    commonjs(),
  ],
  build: {
    lib: {
      entry: "src/chart.js",
      name: "genomaps",
      fileName: "genomaps",
    },
  },
});