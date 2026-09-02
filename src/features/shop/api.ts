import { httpClient } from "@/services/httpClient";
import type { Shop, ShopPayload } from "./types";

export interface PublicShop {
	id: string;
	name: string;
	slug: string;
	logoUrl?: string | null;
	address?: string | null;
	currency?: string | null;
	organization: { name: string; logoUrl?: string | null };
}

export const shopApi = {
	list: () => httpClient.get<Shop[]>("/shops"),
	get: (id: string) => httpClient.get<Shop>(`/shops/${id}`),
	create: (payload: ShopPayload) => httpClient.post<Shop>("/shops", payload),
	update: (id: string, payload: Partial<ShopPayload>) => httpClient.patch<Shop>(`/shops/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/shops/${id}`),
	getPublic: (slug: string) => httpClient.get<PublicShop>(`/shops/public/${slug}`),
	checkSlugAvailability: (slug: string, shopId?: string) =>
		httpClient.get<{ available: boolean; slug: string; reason?: string }>(
			`/shops/slug-availability?slug=${encodeURIComponent(slug)}${shopId ? `&shopId=${shopId}` : ""}`,
		),
	uploadLogo: (id: string, file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return httpClient.upload<Shop>(`/shops/${id}/logo`, formData);
	},
};
