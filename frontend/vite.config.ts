/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
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
        '**/index.ts',
      ],
    },
  },
  optimizeDeps: {
    include: ["@mantine/core", "@mantine/hooks"],
  },
});
