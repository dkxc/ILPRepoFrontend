/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@ui": path.resolve(__dirname, "./src/ui"),
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      reportOnFailure: true,
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/src/test/**",
        "**/src/mocks/**",
        "**/*.types.ts",
        "**/*.config.ts",
        "**/index.ts",
      ],
    },
  },
  optimizeDeps: {
    include: ["@mantine/core", "@mantine/hooks"],
  },
});
