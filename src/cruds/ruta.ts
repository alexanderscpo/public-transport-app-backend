import { eq } from "drizzle-orm";
import { DBDriver } from "..";
import { ruta } from "../schemas";

type Ruta = {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  terminal_id: number;
  provincia_id: number;
};

export const getRutas = async (
  db: DBDriver,
  terminal_id: number,
  provincia_id: number
): Promise<Ruta[]> => {
  const rutas = await db.query.ruta.findMany({
    where: (ruta, { and, eq }) =>
      and(
        eq(ruta.terminal_id, terminal_id),
        eq(ruta.provincia_id, provincia_id)
      ),
  });
  return rutas;
};

export const getRuta = async (
  db: DBDriver,
  id: number,
  terminal_id: number,
  provincia_id: number
): Promise<Ruta | undefined> => {
  const ruta = await db.query.ruta.findFirst({
    where: (ruta, { and, eq }) =>
      and(
        eq(ruta.id, id),
        eq(ruta.terminal_id, terminal_id),
        eq(ruta.provincia_id, provincia_id)
      ),
  });
  return ruta;
};

export const insertRuta = async (
  db: DBDriver,
  rutaData: Ruta
): Promise<Ruta | undefined> => {
  const r = await db
    .insert(ruta)
    .values({
      ...rutaData,
    })
    .returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const removeRuta = async (
  db: DBDriver,
  id: number
): Promise<Ruta | undefined> => {
  const r = await db.delete(ruta).where(eq(ruta.id, id)).returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const updateRuta = async (
  db: DBDriver,
  id: number,
  rutaData: Partial<Ruta>
) => {
  let rutaDB = await getRuta(db, id);
  if (rutaDB == undefined) return undefined;

  return await db
    .update(ruta)
    .set({ ...rutaData })
    .where(eq(ruta.id, id))
    .returning();
};

export enum Sentido {
  IDA = "IDA",
  REGRESO = "REGRESO",
}

type Recorrido = {
  orden: number;
  parada: {
    id: string;
    nombre: string;
    direccion: string;
    x: number;
    y: number;
  };
  regreso?: boolean;
};

export const getRecorrido = async (
  db: DBDriver,
  ruta_id: number,
  sentido?: Sentido
): Promise<Recorrido[]> => {
  const recorrido = await db.query.rutasToParadas.findMany({
    where: (rutasToParadas, { eq, and }) => {
      if (!sentido) {
        return eq(rutasToParadas.ruta_id, ruta_id);
      }
      const regreso = sentido == Sentido.REGRESO;
      return and(
        eq(rutasToParadas.ruta_id, ruta_id),
        eq(rutasToParadas.regreso, regreso)
      );
    },
    with: {
      parada: {
        columns: { provincia_id: false },
      },
    },
    columns: {
      id: false,
      parada_id: false,
      ruta_id: false,
      orden: true,
      regreso: !sentido,
    },
    orderBy: (rutasToParadas, { asc }) => asc(rutasToParadas.orden),
  });
  return recorrido;
};
