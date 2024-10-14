import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  plugins: [
    libInjectCss()],
  build: {
    lib: {
      entry: "src/chart.js",
      name: "genomaps",
      fileName: "genomaps",
    },
  },
});
