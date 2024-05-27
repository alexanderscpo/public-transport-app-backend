import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";

import * as schema from "./schemas";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getProvincia, getProvincias } from "./cruds/provincia";
import {
  getTerminal,
  getTerminales,
  getTerminalesWithRuta,
} from "./cruds/terminal";
import {
  getRecorrido,
  getRuta,
  getRutas,
  getRutasByParada,
  Sentido,
} from "./cruds/ruta";
import { getParada, getParadas } from "./cruds/parada";
import { cors } from "hono/cors";
import { cache } from "hono/cache";

type Bindings = {
  DB: D1Database;
};

export type DBDriver = DrizzleD1Database<typeof schema>;

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET"],
  })
);

app.get(
  "*",
  cache({
    cacheName: "public-transport-app",
    cacheControl: "max-age=604800",
  })
);

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
      provincia_id: z.coerce.number().int().positive(),
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
  "/provincias/:provincia_id/paradas",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
    })
  ),
  zValidator(
    "query",
    z.object({
      offset: z.coerce.number().int().min(0).optional().default(0),
      limit: z.coerce.number().int().min(1).max(50).optional().default(25),
    })
  ),
  async (c) => {
    const { provincia_id } = c.req.valid("param");
    const { limit, offset } = c.req.valid("query");
    const db = drizzle(c.env.DB, { schema });
    const paradas = await getParadas(db, provincia_id, offset, limit);
    return c.json({ paradas });
  }
);

app.get(
  "/provincias/:provincia_id/paradas/:parada_id",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
      parada_id: z.string().min(8).max(10),
    })
  ),
  async (c) => {
    const { provincia_id, parada_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const parada = await getParada(db, parada_id, provincia_id);
    return c.json({ parada });
  }
);

app.get(
  "/provincias/:provincia_id/paradas/:parada_id/rutas",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
      parada_id: z.string().min(8).max(10),
    })
  ),
  async (c) => {
    const { provincia_id, parada_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const parada = await getParada(db, parada_id, provincia_id);
    if (!parada) return c.notFound();
    const rutas = await getRutasByParada(db, parada.id);
    return c.json({ rutas });
  }
);

app.get(
  "/provincias/:provincia_id/terminales",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
    })
  ),
  zValidator(
    "query",
    z.object({
      with: z
        .string()
        .optional()
        .transform((v) => (v ? v.split(",") : []))
        .pipe(
          z.array(z.string()).refine(
            (array) => {
              const requiredFields = ["ruta"];
              return array.every((field) => requiredFields.includes(field));
            },
            {
              message: "The 'with' query parameter must include 'ruta'.",
            }
          )
        ),
    })
  ),
  async (c) => {
    const validated = c.req.valid("param");
    const { provincia_id } = validated;

    const { with: withQuery } = c.req.valid("query");

    const db = drizzle(c.env.DB, { schema });
    let terminales;
    if (withQuery.includes("ruta")) {
      terminales = await getTerminalesWithRuta(db, provincia_id);
    } else {
      terminales = await getTerminales(db, provincia_id);
    }

    return c.json({ terminales });
  }
);

app.get(
  "/provincias/:provincia_id/terminales/:terminal_id",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
      terminal_id: z.coerce.number().int().positive(),
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
      provincia_id: z.coerce.number().int().positive(),
      terminal_id: z.coerce.number().int().positive(),
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
      provincia_id: z.coerce.number().int().positive(),
      terminal_id: z.coerce.number().int().positive(),
      ruta_id: z.coerce.number().int().positive(),
    })
  ),
  async (c) => {
    const { provincia_id, terminal_id, ruta_id } = c.req.valid("param");
    const db = drizzle(c.env.DB, { schema });
    const ruta = await getRuta(db, ruta_id, terminal_id, provincia_id);
    return c.json({ ruta });
  }
);

app.get(
  "/provincias/:provincia_id/terminales/:terminal_id/rutas/:ruta_id/recorrido",
  zValidator(
    "param",
    z.object({
      provincia_id: z.coerce.number().int().positive(),
      terminal_id: z.coerce.number().int().positive(),
      ruta_id: z.coerce.number().int().positive(),
    })
  ),
  zValidator("query", z.object({ sentido: z.nativeEnum(Sentido).optional() })),
  async (c) => {
    const { provincia_id, terminal_id, ruta_id } = c.req.valid("param");
    const { sentido } = c.req.valid("query");

    const db = drizzle(c.env.DB, { schema });

    const ruta = await getRuta(db, ruta_id, terminal_id, provincia_id);
    if (!ruta) {
      return c.notFound();
    }

    let recorrido = await getRecorrido(db, ruta.id, sentido);
    if (!sentido) {
      const ida = [];
      const regreso = [];
      recorrido.forEach((v) => {
        const r = v.regreso;
        delete v.regreso;
        if (r) {
          regreso.push({
            ...v,
          });
        } else {
          ida.push({
            ...v,
          });
        }
      });

      recorrido = {
        ida,
        regreso,
      };
    }
    return c.json({ recorrido });
  }
);

export default app;
