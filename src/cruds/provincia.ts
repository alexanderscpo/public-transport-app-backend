import { eq } from "drizzle-orm";
import { DBDriver } from "..";
import { provincia } from "../schemas";

type Provincia = {
  id: number;
  nombre: string;
  abreviatura: string;
};

export const getProvincias = async (db: DBDriver): Promise<Provincia[]> => {
  const provincias = await db.query.provincia.findMany();
  return provincias;
};

export const getProvincia = async (
  db: DBDriver,
  id: number
): Promise<Provincia | undefined> => {
  const provincia = await db.query.provincia.findFirst({
    where: (provincia, { eq }) => eq(provincia.id, id),
  });
  console.log(provincia);
  return provincia;
};

export const insertProvincia = async (
  db: DBDriver,
  provinciaData: Provincia
): Promise<Provincia | undefined> => {
  const r = await db
    .insert(provincia)
    .values({
      ...provinciaData,
    })
    .returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const removeProvincia = async (
  db: DBDriver,
  id: number
): Promise<Provincia | undefined> => {
  const r = await db.delete(provincia).where(eq(provincia.id, id)).returning();

  if (r.length == 0) return undefined;
  return r[0];
};

export const updateProvincia = async (
  db: DBDriver,
  id: number,
  provinciaData: Partial<Provincia>
) => {
  let provinciaDB = await getProvincia(db, id);
  if (provinciaDB == undefined) return undefined;

  return await db
    .update(provincia)
    .set({ ...provinciaData })
    .where(eq(provincia.id, id))
    .returning();
};
