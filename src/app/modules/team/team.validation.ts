import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    projectId: z.string(),
    teamName: z.string(),
    departmentName: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    teamName: z.string().optional(),
    departmentName: z.string().optional(),
  }),
});

export const teamValidation = {
  createSchema,
  updateSchema,
};
