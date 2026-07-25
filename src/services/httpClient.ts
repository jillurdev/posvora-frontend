import { env } from "@/config/env";
import type { ApiResponse } from "@/types/api-response";

const BASE_URL = env.apiUrl;

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public data?: unknown,
		public errors: string[] = [],
	) {
		super(message);
		this.name = "ApiError";
	}
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

// ---- Silent refresh state (module-level, shared across all requests) ----
let isRefreshing = false;
let refreshWaiters: Array<(ok: boolean) => void> = [];

function waitForRefresh(): Promise<boolean> {
	return new Promise(resolve => refreshWaiters.push(resolve));
}

function notifyWaiters(ok: boolean) {
	refreshWaiters.forEach(resolve => resolve(ok));
	refreshWaiters = [];
}

async function refreshAccessToken(): Promise<boolean> {
	if (isRefreshing) return waitForRefresh();

	isRefreshing = true;
	try {
		const res = await fetch(`${BASE_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		});
		const ok = res.ok;
		isRefreshing = false;
		notifyWaiters(ok);
		return ok;
	} catch {
		isRefreshing = false;
		notifyWaiters(false);
		return false;
	}
}

const SKIP_REFRESH_PATHS = [
	"/auth/login",
	"/auth/refresh",
	"/auth/register",
	"/auth/admin/login",
];

async function request<T>(
	path: string,
	options: RequestInit = {},
	_retry = true,
): Promise<T> {
	const isFormData = options.body instanceof FormData;

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: "include",
		headers: {
			...(!isFormData && { "Content-Type": "application/json" }),
			...options.headers,
		},
	});

	if (res.status === 401 && _retry && !SKIP_REFRESH_PATHS.includes(path)) {
		const refreshed = await refreshAccessToken();

		if (refreshed) {
			return request<T>(path, options, false);
		}

		if (typeof window !== "undefined") {
			window.dispatchEvent(new Event("auth:logout"));
		}
		throw new ApiError(401, "Session expired");
	}

	const json = await res.json().catch(() => null);

	if (!res.ok) {
		throw new ApiError(
			res.status,
			json?.message || "Something went wrong",
			json?.data,
			json?.errors,
		);
	}

	return (json?.data !== undefined ? json.data : json) as T;
}

// Returns the raw envelope (with meta) instead of unwrapping `data` — useful for paginated lists.
async function requestRaw<T>(
	path: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const json = await res.json().catch(() => null);

	if (!res.ok) {
		throw new ApiError(
			res.status,
			json?.message || "Something went wrong",
			json?.data,
			json?.errors,
		);
	}

	return json as ApiResponse<T>;
}

function buildQuery(params: QueryParams): string {
	const query = Object.entries(params)
		.filter(([, v]) => v !== undefined && v !== null && v !== "")
		.map(
			([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
		)
		.join("&");

	return query ? `?${query}` : "";
}

export const httpClient = {
	get<T>(path: string, params?: QueryParams): Promise<T> {
		const fullPath = params ? `${path}${buildQuery(params)}` : path;
		return request<T>(fullPath);
	},

	getPaginated<T>(path: string, params?: QueryParams): Promise<ApiResponse<T>> {
		const fullPath = params ? `${path}${buildQuery(params)}` : path;
		return requestRaw<T>(fullPath);
	},

	post<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, {
			method: "POST",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
	},

	put<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, {
			method: "PUT",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
	},

	patch<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, {
			method: "PATCH",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
	},

	delete<T>(path: string): Promise<T> {
		return request<T>(path, { method: "DELETE" });
	},

	upload<T>(path: string, formData: FormData): Promise<T> {
		return request<T>(path, { method: "POST", body: formData });
	},
};
