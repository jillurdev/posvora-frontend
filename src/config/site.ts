import {
	LayoutDashboard,
	Package,
	Boxes,
	Users,
	Truck,
	ShoppingCart,
	ShoppingBag,
	Wallet,
	UserCog,
	Building2,
	Store,
	Warehouse,
	ShieldCheck,
	Bell,
	FileClock,
	CreditCard,
	Settings,
	LifeBuoy,
	BarChart3,
} from "lucide-react";
import type { SystemRole } from "@/types/roles";

export interface NavItem {
	label: string;
	href: string;
	icon: typeof LayoutDashboard;
	roles?: SystemRole[];
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
	{ label: "Products", href: "products", icon: Package },
	{ label: "Inventory", href: "inventory", icon: Boxes },
	{ label: "Sales", href: "sales", icon: ShoppingCart },
	{ label: "Purchases", href: "purchases", icon: ShoppingBag },
	{ label: "Customers", href: "customers", icon: Users },
	{ label: "Suppliers", href: "suppliers", icon: Truck },
	{ label: "Employees", href: "employees", icon: UserCog, roles: ["OWNER", "MANAGER", "HR"] },
	{ label: "Accounting", href: "accounting", icon: Wallet, roles: ["OWNER", "MANAGER", "ACCOUNTANT"] },
	{ label: "Reports", href: "reports", icon: BarChart3, roles: ["OWNER", "MANAGER", "ACCOUNTANT"] },
	{ label: "Shops", href: "shops", icon: Store, roles: ["OWNER"] },
	{ label: "Branches", href: "branches", icon: Building2, roles: ["OWNER", "MANAGER"] },
	{ label: "Warehouses", href: "warehouses", icon: Warehouse, roles: ["OWNER", "MANAGER", "STORE_KEEPER"] },
	{ label: "Roles & Access", href: "roles", icon: ShieldCheck, roles: ["OWNER"] },
	{ label: "Subscription", href: "subscription", icon: CreditCard, roles: ["OWNER"] },
	{ label: "Audit Logs", href: "audit-logs", icon: FileClock, roles: ["OWNER", "MANAGER"] },
	{ label: "Notifications", href: "notifications", icon: Bell },
	{ label: "Support", href: "support", icon: LifeBuoy },
	{ label: "Settings", href: "settings", icon: Settings },
];

export const siteConfig = {
	name: "Posvora",
	description: "Universal Business Management & POS SaaS",
};
