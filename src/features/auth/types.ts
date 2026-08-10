import type { AuthUser } from "@/types/user";

export interface LoginPayload {
	identifier: string;
	password: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	phone?: string;
	organizationName: string;
	businessType: string;
	country?: string;
}

export interface ChangePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ResetPasswordPayload {
	token: string;
	newPassword: string;
}

export interface AuthResult {
	user: AuthUser;
	organization?: { id: string; name: string; handle: string | null };
	accessToken?: string;
	refreshToken?: string;
}

// Returned by /auth/register now that the account is PENDING until the
// email OTP is confirmed — no tokens/user yet, just what's needed to show
// the "check your inbox" screen.
export interface RegisterPendingResult {
	requiresEmailVerification: true;
	email: string;
	otpExpiresInMinutes: number;
}

export interface VerifyEmailPayload {
	email: string;
	code: string;
}

export interface ResendOtpPayload {
	email: string;
}

export interface TwoFactorChallenge {
	twoFactorRequired: true;
	challengeToken: string;
}

export type LoginResult = AuthResult | TwoFactorChallenge;

export function isTwoFactorChallenge(result: LoginResult): result is TwoFactorChallenge {
	return "twoFactorRequired" in result && result.twoFactorRequired === true;
}

export interface VerifyTwoFactorPayload {
	challengeToken: string;
	code: string;
}

export interface TwoFactorSetup {
	secret: string;
	otpauthUrl: string;
}

export interface EnableTwoFactorResult {
	message: string;
	recoveryCodes: string[];
}
