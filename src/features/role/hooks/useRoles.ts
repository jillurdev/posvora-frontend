"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleApi } from "../api";
import type { RolePayload } from "../types";

export function useRoles() {
	return useQuery({ queryKey: ["roles"], queryFn: roleApi.list });
}

export function usePermissions() {
	return useQuery({ queryKey: ["permissions"], queryFn: roleApi.permissions });
}

export function useCreateRole() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: RolePayload) => roleApi.create(payload),
		onSuccess: () => {
			toast.success("Role created");
			qc.invalidateQueries({ queryKey: ["roles"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteRole() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => roleApi.remove(id),
		onSuccess: () => {
			toast.success("Role removed");
			qc.invalidateQueries({ queryKey: ["roles"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
