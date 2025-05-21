import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
      plugins: [tsconfigPaths(), react()],
      test: {
            environment: "jsdom",
            setupFiles: ['./__test__/vitest.setup.ts']
      },
      resolve: {
            alias: {
                  "@": path.resolve(__dirname, "./"),
                  "@/components": path.resolve(__dirname, "./src/components"),
            },
      },
});
