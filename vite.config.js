import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import commonjs from "vite-plugin-commonjs";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  plugins: [commonjs(), libInjectCss()],
  build: {
    lib: {
      entry: "src/chart.js",
      name: "genomaps",
      fileName: "genomaps",
    },
  },
});
