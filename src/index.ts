import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";

import * as schema from "./schemas";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getProvincia, getProvincias } from "./cruds/provincia";
import { getTerminal, getTerminales } from "./cruds/terminal";
import { getRuta, getRutas } from "./cruds/ruta";

type Bindings = {
  DB: D1Database;
};

export type DBDriver = DrizzleD1Database<typeof schema>;

const app = new Hono<{ Bindings: Bindings }>();

app.get("/provincias", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  console.log(db);
  const provincias = await getProvincias(db);
  return c.json({ provincias });
});

app.get(
  "/provincias/:provincia_id",
  zValidator(
    "param",
    z.object({
      provincia_id: z.string().regex(/^\d+$/).transform(Number),
    })
  ),
  async (c) => {
    const validated = c.req.valid("param");
    const { provincia_id } = validated;
    const db = drizzle(c.env.DB, { schema });
    const provincia = await getProvincia(db, provincia_id);

    return c.json({ provincia });
  }
);

app.get(
  "/provincias/:provincia_id/terminales",
  zValidator(
    "param",
    z.object({
      provincia_id: z.string().regex(/^\d+$/).transform(Number),
    })
  ),
  async (c) => {
    const validated = c.req.valid("param");
    const { provincia_id } = validated;
    const db = drizzle(c.env.DB, { schema });
    const terminales = await getTerminales(db, provincia_id);
    return c.json({ terminales });
  }
);

app.get(
  "/provincias/:provincia_id/terminales/:terminal_id",
  zValidator(
    "param",
    z.object({
      provincia_id: z.string().regex(/^\d+$/).transform(Number),
      terminal_id: z.string().regex(/^\d+$/).transform(Number),
    })
  ),
  async (c) => {
    const { provincia_id, terminal_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const terminal = await getTerminal(db, terminal_id, provincia_id);
    return c.json({ terminal });
  }
);

app.get(
  "/provincias/:provincia_id/terminales/:terminal_id/rutas",
  zValidator(
    "param",
    z.object({
      provincia_id: z.string().regex(/^\d+$/).transform(Number),
      terminal_id: z.string().regex(/^\d+$/).transform(Number),
    })
  ),
  async (c) => {
    const { provincia_id, terminal_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const rutas = await getRutas(db, terminal_id, provincia_id);
    return c.json({ rutas });
  }
);

app.get(
  "/provincias/:provincia_id/terminales/:terminal_id/rutas/:ruta_id",
  zValidator(
    "param",
    z.object({
      provincia_id: z.string().regex(/^\d+$/).transform(Number),
      terminal_id: z.string().regex(/^\d+$/).transform(Number),
      ruta_id: z.string().regex(/^\d+$/).transform(Number),
    })
  ),
  async (c) => {
    const { provincia_id, terminal_id, ruta_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const ruta = await getRuta(db, ruta_id, terminal_id, provincia_id);
    return c.json({ ruta });
  }
);

// app.get(
//   "/provincias/:provincia_id/terminales/:terminal_id/rutas/:ruta_id/recorrido",
//   zValidator(
//     "param",
//     z.object({
//       provincia_id: z.string().regex(/^\d+$/).transform(Number),
//       terminal_id: z.string().regex(/^\d+$/).transform(Number),
//       ruta_id: z.string().regex(/^\d+$/).transform(Number),
//     })
//   ),
//   async (c) => {
//     const { provincia_id, terminal_id, ruta_id } = c.req.param();
//     const db = drizzle(c.env.DB, { schema });
//     // const recorrido
//     return c.json({});
//   }
// );

export default app;
