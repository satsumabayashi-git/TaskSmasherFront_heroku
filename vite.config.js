import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true, // サーバーがリッスンするホストアドレスを指定
    port: 5173, // 開発サーバーが使用するポート番号
    // cors: {
    //   origin: "http://localhost:8082", // Allow only specific origin
    //   methods: ["GET"], // Restrict allowed HTTP methods
    //   credentials: true, // Allow cookies and credentials
    // },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8082",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});
