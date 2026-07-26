"use client";

import { useState } from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";

import { useActiveShop } from "@/context/ActiveShopContext";
import { useRoles } from "@/features/role/hooks/useRoles";
import {
	useEmployees,
	useCreateEmployee,
	useDeleteEmployee,
} from "@/features/employee/hooks/useEmployees";

import type { Employee, EmployeePayload } from "@/features/employee/types";

import { formatMoney } from "@/lib/utils";

export default function EmployeesPage() {
	const { activeShopId, shops } = useActiveShop();

	const { data, isLoading } = useEmployees({
		shopId: activeShopId ?? undefined,
	});

	const createEmployee = useCreateEmployee();
	const deleteEmployee = useDeleteEmployee();
	const { data: roles = [] } = useRoles();

	const [modalOpen, setModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EmployeePayload>();

	if (shops.length === 0) {
		return (
			<EmptyState
				icon={UserCog}
				title="Create a shop first"
				description="Employees are attached to a shop."
			/>
		);
	}

	const onSubmit = (values: EmployeePayload) => {
		createEmployee.mutate(
			{
				...values,
				shopId: activeShopId!,
			},
			{
				onSuccess: () => {
					reset();
					setModalOpen(false);
				},
			},
		);
	};

	const columns: Column<Employee>[] = [
		{
			header: "Name",
			accessor: employee => (
				<span className="font-medium text-slate-900">{employee.name}</span>
			),
		},
		{
			header: "Email",
			accessor: employee => employee.email,
		},
		{
			header: "Phone",
			accessor: employee => employee.phone ?? "—",
		},
		{
			header: "Base salary",
			accessor: employee =>
				employee.baseSalary != null ? formatMoney(employee.baseSalary) : "—",
		},
		{
			header: "",
			accessor: employee => (
				<button
					type="button"
					onClick={() => deleteEmployee.mutate(employee.id)}
					className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500">
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
				action={
					<Button onClick={() => setModalOpen(true)}>
						<Plus className="h-4 w-4" />
						Add employee
					</Button>
				}
			/>

			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={employee => employee.id}
				emptyTitle="No employees yet"
			/>

			<Modal
				open={modalOpen}
				onClose={() => {
					reset();
					setModalOpen(false);
				}}
				title="Add employee"
				size="lg">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<TextField
							id="name"
							label="Name"
							required
							autoComplete="name"
							error={errors.name?.message}
							{...register("name", { required: "Name is required" })}
						/>

						<TextField
							id="email"
							label="Email"
							type="email"
							required
							autoComplete="email"
							error={errors.email?.message}
							{...register("email", { required: "Email is required" })}
						/>

						<TextField id="phone" label="Phone" autoComplete="tel" {...register("phone")} />

						<TextField
							id="password"
							label="Temporary password"
							type="password"
							hint="The employee will be required to set their own password the first time they log in."
							required
							autoComplete="new-password"
							error={errors.password?.message}
							{...register("password", { required: "Password is required" })}
						/>

						<SelectField
							id="roleId"
							label="Role"
							required
							defaultValue=""
							error={errors.roleId?.message}
							{...register("roleId", { required: "Role is required" })}
						>
							<option value="" disabled>
								Select a role
							</option>
							{roles.map(role => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</SelectField>

						<TextField
							id="baseSalary"
							label="Base salary"
							type="number"
							step="0.01"
							inputMode="decimal"
							{...register("baseSalary")}
						/>

						<TextField id="joinedAt" label="Joined at" type="date" {...register("joinedAt")} />
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								reset();
								setModalOpen(false);
							}}>
							Cancel
						</Button>

						<Button type="submit" isLoading={createEmployee.isPending}>
							Save
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
