export interface Employee {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	shopId: string;
	branchId?: string | null;
	departmentId?: string | null;
	designationId?: string | null;
	baseSalary?: number | null;
	joinedAt?: string | null;
	createdAt: string;
}

export interface EmployeePayload {
	name: string;
	email: string;
	phone?: string;
	password: string;
	shopId: string;
	branchId?: string;
	departmentId?: string;
	designationId?: string;
	roleId?: string;
	nid?: string;
	address?: string;
	baseSalary?: number;
	joinedAt?: string;
}
