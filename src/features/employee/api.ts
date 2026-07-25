import { httpClient } from "@/services/httpClient";
import type { Employee, EmployeePayload } from "./types";

export const employeeApi = {
	list: (params?: { shopId?: string; branchId?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Employee[]>("/employees", params),
	get: (id: string) => httpClient.get<Employee>(`/employees/${id}`),
	create: (payload: EmployeePayload) => httpClient.post<Employee>("/employees", payload),
	update: (id: string, payload: Partial<EmployeePayload>) => httpClient.patch<Employee>(`/employees/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/employees/${id}`),
	markAttendance: (id: string, payload: { status: string; date?: string }) =>
		httpClient.post(`/employees/${id}/attendance`, payload),
	applyLeave: (id: string, payload: { fromDate: string; toDate: string; reason?: string }) =>
		httpClient.post(`/employees/${id}/leaves`, payload),
	approveLeave: (leaveId: string) => httpClient.patch(`/employees/leaves/${leaveId}/approve`),
	rejectLeave: (leaveId: string) => httpClient.patch(`/employees/leaves/${leaveId}/reject`),
	runPayroll: (id: string, payload: { month: string; year: number }) =>
		httpClient.post(`/employees/${id}/payroll`, payload),
};
