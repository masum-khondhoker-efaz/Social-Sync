import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Map name is required'),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const mapValidation = {
createSchema,
updateSchema,
};