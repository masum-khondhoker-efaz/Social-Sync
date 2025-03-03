import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    projectId: z.string(),
    fileName: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    fileName: z.string().optional(),
  }),
});

export const fileValidation = {
createSchema,
updateSchema,
};