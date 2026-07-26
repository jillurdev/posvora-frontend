"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationApi } from "../api";
import type { UpdateOrganizationPayload } from "../types";

export function useOrganization() {
	return useQuery({ queryKey: ["organization", "me"], queryFn: organizationApi.me });
}

export function useDashboardSummary() {
	return useQuery({ queryKey: ["organization", "summary"], queryFn: organizationApi.summary });
}

export function useUpdateOrganization() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: UpdateOrganizationPayload) => organizationApi.update(payload),
		onSuccess: () => {
			toast.success("Organization updated");
			queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
