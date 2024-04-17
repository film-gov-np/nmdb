import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email address" })
    .transform((value) => value.trim()),
});

export const loginSchema = emailSchema.extend({
  password: z.string().min(5, {
    message: "Password must be at least 5 characters long",
  }),
});
export const loginSchemaResolver = zodResolver(loginSchema);

export const registerSchema = emailSchema
  .extend({
    firstName: z
      .string()
      .min(1, {
        message: "First name is required",
      })
      .transform((value) => value.trim()),
    lastName: z
      .string()
      .min(1, {
        message: "Last name is required",
      })
      .transform((value) => value.trim()),
    mobileNumber: z
      .string()
      .min(10, {
        message: "Mobile number must be at least 10 characters long",
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(5, {
        message: "Password is required",
      })
      .refine(
        (value) =>
          /[A-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[^A-Za-z0-9]/.test(value),
        {
          message:
            "Password must contain at least one uppercase letter, one digit, and one special character",
        },
      ),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required",
    }),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerSchemaResolver = zodResolver(registerSchema);
