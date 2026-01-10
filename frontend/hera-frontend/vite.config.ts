import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    root: '.',
    plugins: [react({
        // ✅ Use automatic JSX runtime (React 17+)
        jsxRuntime: "automatic"
      })],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // ✅ points to frontend/src
      },
    },
    build: {
      outDir: "dist", // ✅ resolves to frontend/dist
    },
  };
});
