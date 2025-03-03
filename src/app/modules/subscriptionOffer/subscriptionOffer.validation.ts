import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    price: z.number().min(1, 'Price is required'),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    price: z.number().min(1, 'Price is required').optional(),
  }),
});

export const subscriptionOfferValidation = {
  createSchema,
  updateSchema,
};
