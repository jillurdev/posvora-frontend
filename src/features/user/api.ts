import { httpClient } from "@/services/httpClient";
import type { AuthUser } from "@/types/user";

export const userApi = {
	me: () => httpClient.get<AuthUser>("/users/me"),
	updateProfile: (payload: { name?: string; phone?: string; avatarUrl?: string }) =>
		httpClient.patch<AuthUser>("/users/me", payload),
	uploadAvatar: (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return httpClient.upload<AuthUser>("/users/me/avatar", formData);
	},
	list: (params?: { page?: number; limit?: number; search?: string }) =>
		httpClient.getPaginated<AuthUser[]>("/users", params),
};
