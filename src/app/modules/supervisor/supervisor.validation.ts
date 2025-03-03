import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    supervisorId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    supervisorId: z.string().optional(),
  }),
});

export const supervisorValidation = {
  createSchema,
  updateSchema,
};
