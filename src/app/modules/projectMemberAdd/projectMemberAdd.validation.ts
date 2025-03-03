import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    projectId: z.string(),
    memberId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    memberId: z.string().optional(),
  }),
});

export const projectMemberAddValidation = {
  createSchema,
  updateSchema,
};
