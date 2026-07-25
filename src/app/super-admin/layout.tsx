import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function SuperAdminRootLayout({ children }: { children: React.ReactNode }) {
	return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
