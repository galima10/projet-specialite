import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/", // si un nom de domaine personnalisé
  // base: "/nom-du-repo/", // si front hébergé sur github
  base: process.env.VITE_BASE_URL || "/",
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@App": path.resolve(__dirname, "src/App"),
      "@images": path.resolve(__dirname, "src/assets/images"),
      "@fonts": path.resolve(__dirname, "src/assets/fonts"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@app-types": path.resolve(__dirname, "src/types"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@constants": path.resolve(__dirname, "src/constants"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"],
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});

// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default ({ mode }: { mode: string }) => {
//   // Charge les variables d'environnement qui commencent par VITE_ depuis le .env correspondant
//   const env = loadEnv(mode, process.cwd(), "VITE_");

//   return defineConfig({
//     base: env.VITE_BASE_URL || "/",
//     plugins: [react()],
//     build: {
//       sourcemap: false,
//       minify: "terser",
//       terserOptions: {
//         compress: {
//           drop_console: true,
//           drop_debugger: true,
//         },
//         format: {
//           comments: false,
//         },
//       },
//       outDir: "dist",
//       emptyOutDir: true,
//     },
//     resolve: {
//       alias: {
//         "@App": path.resolve(__dirname, "src/App"),
//         "@images": path.resolve(__dirname, "src/assets/images"),
//         "@fonts": path.resolve(__dirname, "src/assets/fonts"),
//         "@stores": path.resolve(__dirname, "src/stores"),
//         "@modules": path.resolve(__dirname, "src/modules"),
//         "@styles": path.resolve(__dirname, "src/styles"),
//         "@app-types": path.resolve(__dirname, "src/types"),
//         "@utils": path.resolve(__dirname, "src/utils"),
//         "@constants": path.resolve(__dirname, "src/constants"),
//       },
//       extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"],
//     },
//     define: {
//       "process.env": env, // optionnel : expose toutes les VITE_ variables
//     },
//     css: {
//       modules: {
//         localsConvention: "camelCase",
//       },
//     },
//   });
// };