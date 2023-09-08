import { z } from "zod";

export const defaultStringValidation = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length >= 1, {
    message: "Required",
  });
