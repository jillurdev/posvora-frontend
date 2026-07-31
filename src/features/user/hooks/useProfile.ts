"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../api";
import { useAuth } from "@/context/AuthContext";

export function useUpdateProfile() {
	const qc = useQueryClient();
	const { setUser } = useAuth();
	return useMutation({
		mutationFn: (payload: { name?: string; phone?: string; avatarUrl?: string }) => userApi.updateProfile(payload),
		onSuccess: user => {
			setUser(user);
			toast.success("Profile updated");
			qc.invalidateQueries({ queryKey: ["organization"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUploadAvatar() {
	const { setUser } = useAuth();
	return useMutation({
		mutationFn: (file: File) => userApi.uploadAvatar(file),
		onSuccess: user => {
			setUser(user);
			toast.success("Avatar updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not upload avatar"),
	});
}
