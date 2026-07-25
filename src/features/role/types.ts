export interface Permission {
	id: string;
	action: string;
	module: string;
}

export interface Role {
	id: string;
	name: string;
	systemRole?: string | null;
	permissions?: Permission[];
}

export interface RolePayload {
	name: string;
	systemRole?: string;
	permissionIds?: string[];
}
