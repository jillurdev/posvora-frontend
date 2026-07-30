import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	phone: z.string().optional(),
	organizationName: z.string().min(2, "Business name is required"),
	businessType: z.string().min(1, "Select a business type"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
	email: z.string().email("Enter a valid email"),
	code: z.string().length(6, "Enter the 6-digit code"),
});
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const changePasswordSchema = z
	.object({
		oldPassword: z.string().min(6),
		newPassword: z.string().min(6),
		confirmPassword: z.string().min(6),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
