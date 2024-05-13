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

export const getRutas = async (db: DBDriver): Promise<Ruta[]> => {
  const rutas = await db.query.ruta.findMany();
  return rutas;
};

export const getRuta = async (
  db: DBDriver,
  id: number
): Promise<Ruta | undefined> => {
  const ruta = await db.query.ruta.findFirst({
    where: (ruta, { eq }) => eq(ruta.id, id),
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
