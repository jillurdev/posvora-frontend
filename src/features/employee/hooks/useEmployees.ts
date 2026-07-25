"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeApi } from "../api";
import type { EmployeePayload } from "../types";

export function useEmployees(params?: { shopId?: string; branchId?: string; page?: number; limit?: number }) {
	return useQuery({ queryKey: ["employees", params], queryFn: () => employeeApi.list(params) });
}

export function useCreateEmployee() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: EmployeePayload) => employeeApi.create(payload),
		onSuccess: () => {
			toast.success("Employee added");
			qc.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteEmployee() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => employeeApi.remove(id),
		onSuccess: () => {
			toast.success("Employee removed");
			qc.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
