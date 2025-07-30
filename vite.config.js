import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
    base: "/",
    plugins: [react(),],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});