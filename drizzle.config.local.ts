import type { Config } from "drizzle-kit";

const schema = "./src/schemas.ts";
const local_db_path =
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/637be834d5ddac6130c672d6e7effd4298d06c364bca3186d149a624e174b899.sqlite";

export default {
  dialect: "sqlite",
  schema,
  out: "./migrations",
  dbCredentials: {
    url: local_db_path,
  },
} satisfies Config;
