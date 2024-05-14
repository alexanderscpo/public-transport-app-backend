import { defineConfig } from "drizzle-kit";

const { DB_NAME = "d1-public-transport-db" } = process.env;

const schema = "./src/schemas.ts";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1",
  schema,
  out: "./migrations",
  dbCredentials: {
    wranglerConfigPath:
      // This is a hack to inject additional cli flags to wrangler
      // since drizzle-kit doesn't support specifying environments
      new URL("wrangler.toml", import.meta.url).pathname,
    dbName: DB_NAME,
  },
});
