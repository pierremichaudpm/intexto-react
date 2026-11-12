import { fileURLToPath } from "node:url";
import process from "node:process";
import { createApp } from "./server/app.js";

const app = createApp({
  distDir: fileURLToPath(new URL("./dist", import.meta.url)),
  strapiUrl: process.env.VITE_STRAPI_URL || "https://intexto-strapi-production.up.railway.app",
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[server] Intexto running on port ${port}`));
