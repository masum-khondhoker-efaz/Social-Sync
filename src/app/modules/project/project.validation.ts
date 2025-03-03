import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    projectName: z.string().min(1, 'Project name is required'),
    supervisorId: z.string(),
    mapId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    projectName: z.string().optional(),
    supervisorId: z.string().optional(),
    mapId: z.string().optional(),
  }),
});

export const projectValidation = {
createSchema,
updateSchema,
};