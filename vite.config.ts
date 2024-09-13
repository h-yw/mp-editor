/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-07 19:39:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 16:58:08
 * @Description:
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { createPages, featureMap } from "./scripts/entry";
import path from "path";

// https://vitejs.dev/config
const input = createPages();
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // publicDir: "html",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: { ...input, ...featureMap },
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: (chunkInfo) => {
          return chunkInfo.name?.endsWith(".css")
            ? "styles/[name].[ext]"
            : "assets/[name].[ext]";
        },
        dir: "dist",
      },
    },
    manifest: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@feature": path.resolve(__dirname, "./src/feature"),
      "@entries": path.resolve(__dirname, "./src/entries"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
