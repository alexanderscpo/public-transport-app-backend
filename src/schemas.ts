import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const provincia = sqliteTable("provincia", {
  id: integer("id").primaryKey(),
  nombre: text("nombre", { length: 50 }).notNull(),
  abreviatura: text("abreviatura", { length: 5 }).notNull().unique(),
});

export const terminal = sqliteTable("terminal", {
  id: integer("id").primaryKey(),
  nombre: text("nombre", { length: 50 }).notNull(),
  abreviatura: text("abreviatura", { length: 5 }).unique().notNull(),
  direccion: text("direccion", { length: 100 }).notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  provincia_id: integer("provincia_id")
    .notNull()
    .references(() => provincia.id),
});

export const ruta = sqliteTable("ruta", {
  id: integer("id").primaryKey(),
  nombre: text("nombre", { length: 10 }).notNull(),
  origen: text("origen", { length: 40 }).notNull(),
  destino: text("destino", { length: 40 }).notNull(),
  terminal_id: integer("terminal_id")
    .notNull()
    .references(() => terminal.id),
  provincia_id: integer("provincia_id")
    .notNull()
    .references(() => provincia.id),
});

export const parada = sqliteTable("parada", {
  id: text("id", { length: 10 }).primaryKey(),
  nombre: text("nombre", { length: 50 }).notNull(),
  direccion: text("direccion", { length: 100 }).notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  provincia_id: integer("provincia_id")
    .notNull()
    .references(() => provincia.id),
});

export const rutasToParadas = sqliteTable(
  "rutas_to_paradas",
  {
    id: integer("id").notNull(),
    ruta_id: integer("ruta_id")
      .notNull()
      .references(() => ruta.id),
    parada_id: text("parada_id")
      .notNull()
      .references(() => parada.id),
    orden: integer("orden").notNull(),
    regreso: integer("regreso", { mode: "boolean" }).notNull(), // Ida: 0, Regreso: 1
  },
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.ruta_id, t.parada_id] }),
  })
);

export const terminalRelations = relations(terminal, ({ one, many }) => ({
  provincia: one(provincia, {
    fields: [terminal.provincia_id],
    references: [provincia.id],
  }),
  rutas: many(ruta),
}));

export const rutasToParadasRelations = relations(rutasToParadas, ({ one }) => ({
  ruta: one(ruta, {
    fields: [rutasToParadas.ruta_id],
    references: [ruta.id],
  }),
  parada: one(parada, {
    fields: [rutasToParadas.parada_id],
    references: [parada.id],
  }),
}));

export const rutaRelations = relations(ruta, ({ one, many }) => ({
  provincia: one(provincia, {
    fields: [ruta.provincia_id],
    references: [provincia.id],
  }),
  terminal: one(terminal, {
    fields: [ruta.terminal_id],
    references: [terminal.id],
  }),
  paradas: many(rutasToParadas),
}));

export const paradaRelations = relations(parada, ({ one, many }) => ({
  provincia: one(provincia, {
    fields: [parada.provincia_id],
    references: [provincia.id],
  }),
  rutas: many(rutasToParadas),
}));
