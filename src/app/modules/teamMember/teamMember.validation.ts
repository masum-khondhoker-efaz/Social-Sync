import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    teamId: z.string(),
    projectId: z.string(),
    memberId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    teamId: z.string().optional(),
    projectId: z.string().optional(),
    memberId: z.string().optional(),
  }),
});

export const teamMemberValidation = {
createSchema,
updateSchema,
};