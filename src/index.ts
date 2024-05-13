import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";

import * as schema from "./schemas";

type Bindings = {
  DB: D1Database;
};

export type DBDriver = DrizzleD1Database<typeof schema>;

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
