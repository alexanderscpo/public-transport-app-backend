import { eq } from "drizzle-orm";
import { DBDriver } from "..";
import { terminal } from "../schemas";

type Terminal = {
  id: number;
  nombre: string;
  abreviatura: string;
  direccion: string;
  x: number;
  y: number;
  provincia_id: number;
};

export const getTerminales = async (
  db: DBDriver,
  provincia_id: number
): Promise<Terminal[]> => {
  const terminales = await db.query.terminal.findMany({
    where: (terminal, { eq }) => eq(terminal.provincia_id, provincia_id),
  });
  return terminales;
};

export const getTerminal = async (
  db: DBDriver,
  id: number,
  provincia_id: number
): Promise<Terminal | undefined> => {
  const terminal = await db.query.terminal.findFirst({
    where: (terminal, { and, eq }) =>
      and(eq(terminal.id, id), eq(terminal.provincia_id, provincia_id)),
  });
  return terminal;
};

// export const insertTerminal = async (
//   db: DBDriver,
//   terminalData: Terminal
// ): Promise<Terminal | undefined> => {
//   const r = await db
//     .insert(terminal)
//     .values({
//       ...terminalData,
//     })
//     .returning();

//   if (r.length == 0) return undefined;
//   return r[0];
// };

// export const removeTerminal = async (
//   db: DBDriver,
//   id: number
// ): Promise<Terminal | undefined> => {
//   const r = await db.delete(terminal).where(eq(terminal.id, id)).returning();

//   if (r.length == 0) return undefined;
//   return r[0];
// };

// export const updateTerminal = async (
//   db: DBDriver,
//   id: number,
//   terminalData: Partial<Terminal>
// ) => {
//   let rutaDB = await getTerminal(db, id);
//   if (rutaDB == undefined) return undefined;

//   return await db
//     .update(terminal)
//     .set({ ...terminalData })
//     .where(eq(terminal.id, id))
//     .returning();
// };
