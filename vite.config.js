import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [
    commonjs(),
    // federation({
    //   name: "genomaps",
    //   filename: "remoteEntry.js",
    //   exposes: {
    //     "./genomaps": "./src/chart.js",
    //   },
    // }),
  ],

  // build: {
  //   lib: {
  //     entry: "src/chart.js",
  //     name: "MyLib",
  //     fileName: "genomaps",
  //   },
  // },
});
