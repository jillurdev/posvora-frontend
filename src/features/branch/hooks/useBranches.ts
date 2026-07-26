"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { branchApi } from "../api";
import type { BranchPayload } from "../types";

export function useBranches() {
	return useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
}

export function useCreateBranch() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: BranchPayload) => branchApi.create(payload),
		onSuccess: () => {
			toast.success("Branch created");
			qc.invalidateQueries({ queryKey: ["branches"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUpdateBranch() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: Partial<BranchPayload>;
		}) => branchApi.update(id, payload),
		onSuccess: () => {
			toast.success("Branch updated");
			qc.invalidateQueries({ queryKey: ["branches"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteBranch() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => branchApi.remove(id),
		onSuccess: () => {
			toast.success("Branch removed");
			qc.invalidateQueries({ queryKey: ["branches"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
