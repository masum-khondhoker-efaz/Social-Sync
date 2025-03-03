import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    teamId: z.string(),
    projectId: z.string(),
    taskId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    teamId: z.string().optional(),
    projectId: z.string().optional(),
    taskId: z.string().optional(),
  }),
});

export const teamAssignedValidation = {
  createSchema,
  updateSchema,
};
