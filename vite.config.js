import { ViteMinifyPlugin } from "vite-plugin-minify";

export default {
  appType: "mpa",
  plugins: [ViteMinifyPlugin()],
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./src/index.html",
        catalogue: "./src/catalogue.html",
        gallery: "./src/gallery.html",
        design: "./src/design.html",
      },
    },
  },
};
