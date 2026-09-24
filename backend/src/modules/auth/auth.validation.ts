import { z } from "zod";

export const registerValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginValidation = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordValidation = z.object({
  email: z.string().email("Invalid email format"),
});

export const setNewPasswordValidation = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerValidation>;
export type LoginInput = z.infer<typeof loginValidation>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidation>;
export type SetNewPasswordInput = z.infer<typeof setNewPasswordValidation>;
