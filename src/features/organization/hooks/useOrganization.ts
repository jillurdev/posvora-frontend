"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationApi } from "../api";
import type { UpdateOrganizationPayload } from "../types";
import { useAuth } from "@/context/AuthContext";

export function useOrganization() {
	return useQuery({ queryKey: ["organization", "me"], queryFn: organizationApi.me });
}

export function useDashboardSummary() {
	return useQuery({ queryKey: ["organization", "summary"], queryFn: organizationApi.summary });
}

export function useUpdateOrganization() {
	const queryClient = useQueryClient();
	const { refetchUser } = useAuth();
	return useMutation({
		mutationFn: (payload: UpdateOrganizationPayload) => organizationApi.update(payload),
		onSuccess: () => {
			toast.success("Organization updated");
			queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
			// Handle may have changed — refresh the AuthContext user so the dashboard
			// layout's org-handle check can redirect to the (possibly new) URL.
			refetchUser();
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUploadOrganizationLogo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (file: File) => organizationApi.uploadLogo(file),
		onSuccess: () => {
			toast.success("Logo updated");
			queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
		},
		onError: (err: Error) => toast.error(err.message || "Could not upload logo"),
	});
}
