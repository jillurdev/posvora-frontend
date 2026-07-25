import type { SystemRole } from "@/types/roles";

export function hasRole(userRoles: SystemRole[] | undefined, allowed?: SystemRole[]) {
	if (!allowed || allowed.length === 0) return true;
	if (!userRoles) return false;
	return userRoles.some(r => allowed.includes(r));
}

export const ROLE_LABELS: Record<SystemRole, string> = {
	SUPER_ADMIN: "Super Admin",
	OWNER: "Owner",
	MANAGER: "Manager",
	CASHIER: "Cashier",
	SALES_EXECUTIVE: "Sales Executive",
	STORE_KEEPER: "Store Keeper",
	ACCOUNTANT: "Accountant",
	HR: "HR",
	CUSTOM: "Custom",
};
