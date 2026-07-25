"use client";

import { useState } from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useEmployees, useCreateEmployee, useDeleteEmployee } from "@/features/employee/hooks/useEmployees";
import type { Employee, EmployeePayload } from "@/features/employee/types";
import { formatMoney } from "@/lib/utils";

export default function EmployeesPage() {
	const { activeShopId, shops } = useActiveShop();
	const { data, isLoading } = useEmployees({ shopId: activeShopId ?? undefined });
	const createEmployee = useCreateEmployee();
	const deleteEmployee = useDeleteEmployee();
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<EmployeePayload>();

	if (shops.length === 0) {
		return <EmptyState icon={UserCog} title="Create a shop first" description="Employees are attached to a shop." />;
	}

	const onSubmit = (values: EmployeePayload) => {
		createEmployee.mutate(
			{ ...values, shopId: activeShopId! },
			{ onSuccess: () => { reset(); setModalOpen(false); } },
		);
	};

	const columns: Column<Employee>[] = [
		{ header: "Name", accessor: e => <span className="font-medium text-slate-900">{e.name}</span> },
		{ header: "Email", accessor: e => e.email },
		{ header: "Phone", accessor: e => e.phone ?? "—" },
		{ header: "Base salary", accessor: e => (e.baseSalary != null ? formatMoney(e.baseSalary) : "—") },
		{
			header: "",
			accessor: e => (
				<button onClick={() => deleteEmployee.mutate(e.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Employees"
				description="Manage staff, attendance, leave and payroll."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add employee</Button>}
			/>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={e => e.id} emptyTitle="No employees yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add employee" size="lg">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField label="Name" required>
							<Input {...register("name", { required: true })} />
						</FormField>
						<FormField label="Email" required>
							<Input type="email" {...register("email", { required: true })} />
						</FormField>
						<FormField label="Phone">
							<Input {...register("phone")} />
						</FormField>
						<FormField label="Password" required>
							<Input type="password" {...register("password", { required: true })} />
						</FormField>
						<FormField label="Base salary">
							<Input type="number" step="0.01" {...register("baseSalary")} />
						</FormField>
						<FormField label="Joined at">
							<Input type="date" {...register("joinedAt")} />
						</FormField>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button type="submit" isLoading={createEmployee.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
