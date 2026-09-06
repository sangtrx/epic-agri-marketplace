import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
const target = "packages/api/.env";
if (existsSync(target) || existsSync(".demo/access.json") || existsSync("apps/storefront/.env.local")) {
 throw new Error("Demo configuration already exists; existing files were preserved.");
}
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DATABASE_URL to a dedicated local PostgreSQL database before configuring.");
const database = new URL(databaseUrl);
if (!["localhost", "127.0.0.1", "[::1]"].includes(database.hostname) || !database.pathname.startsWith("/epic_agri_demo")) {
 throw new Error("Use a local database named epic_agri_demo (or epic_agri_demo_<suffix>). No shared databases.");
}
if (!["/epic_agri_demo"].includes(database.pathname) && !/^\/epic_agri_demo_[a-z0-9_]+$/.test(database.pathname)) throw new Error("Invalid demo database name.");
const password = randomBytes(18).toString("base64url");
const backend = "http://localhost:9107", storefront = "http://localhost:3107";
mkdirSync(".demo", { recursive: true, mode: 0o700 });
writeFileSync(".demo/access.json", JSON.stringify({ note: "Local fictional demo accounts only; keep this file private.",
 password, operator: "operator@epic.example", sellers: ["mekong@epic.example", "highland@epic.example", "coast@epic.example"] }, null, 2), { mode: 0o600 });
writeFileSync(target, [
 `DATABASE_URL=${databaseUrl}`, `JWT_SECRET=${randomBytes(32).toString("hex")}`, `COOKIE_SECRET=${randomBytes(32).toString("hex")}`,
 `EPIC_DEMO_PASSWORD=${password}`, "EPIC_DEMO=true", `EPIC_BACKEND_URL=${backend}`, `EPIC_STOREFRONT_URL=${storefront}`,
 `STORE_CORS=${storefront}`, `ADMIN_CORS=${backend},http://localhost:7107`, `VENDOR_CORS=${backend},http://localhost:7108`,
 `AUTH_CORS=${backend},${storefront},http://localhost:7107,http://localhost:7108`,
 "MERCUR_DISABLE_TELEMETRY=true", "MEDUSA_DISABLE_TELEMETRY=true",
].join("\n") + "\n", { mode: 0o600 });
console.log("Local demo configured. Credentials are in ignored .demo/access.json; nothing sensitive was printed.");
