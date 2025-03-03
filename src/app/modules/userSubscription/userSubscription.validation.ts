import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    subscriptionOfferId: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    subscriptionOfferId: z.string().optional(),
  }),
});

export const userSubscriptionValidation = {
  createSchema,
  updateSchema,
};
