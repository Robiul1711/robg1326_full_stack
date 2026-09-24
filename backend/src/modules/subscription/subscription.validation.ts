import { z } from "zod";

export const createSubscriptionValidation = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
});

export const updateSubscriptionValidation = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionValidation>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionValidation>;
