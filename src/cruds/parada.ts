import { eq } from "drizzle-orm";
import { DBDriver } from "..";
import { parada } from "../schemas";

type Parada = {
  id: string;
  nombre: string;
  direccion: string;
  x: number;
  y: number;
  provincia_id: number;
};

export const getParadas = async (
  db: DBDriver,
  provincia_id: number,
  offset: number,
  limit: number
) => {
  const paradas = await db.query.parada.findMany({
    where: (parada, { eq }) => eq(parada.provincia_id, provincia_id),
    columns: {
      provincia_id: false,
    },
    limit,
    offset,
  });
  return paradas;
};

export const getParada = async (
  db: DBDriver,
  id: string
): Promise<Parada | undefined> => {
  const parada = await db.query.parada.findFirst({
    where: (parada, { eq }) => eq(parada.id, id),
  });
  return parada;
};

export const insertParada = async (
  db: DBDriver,
  paradaData: Parada
): Promise<Parada | undefined> => {
  const r = await db
    .insert(parada)
    .values({
      ...paradaData,
    })
    .returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const removeParada = async (
  db: DBDriver,
  id: string
): Promise<Parada | undefined> => {
  const r = await db.delete(parada).where(eq(parada.id, id)).returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const updateParada = async (
  db: DBDriver,
  id: string,
  paradaData: Partial<Parada>
) => {
  let paradaDB = await getParada(db, id);
  if (paradaDB == undefined) return undefined;

  return await db
    .update(parada)
    .set({ ...paradaData })
    .where(eq(parada.id, id))
    .returning();
};
