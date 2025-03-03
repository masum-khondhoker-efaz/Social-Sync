import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    projectId: z.string(),
    mapId: z.string(),
    taskName: z.string(),

  }),
});

const updateSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    mapId: z.string().optional(),
    taskName: z.string().optional(),
  }),
});

export const taskValidation = {
createSchema,
updateSchema,
};