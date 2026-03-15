import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/auth": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
