export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiResponse<T = unknown> {
	statusCode: number;
	success: boolean;
	message: string | null;
	timestamp: string;
	requestId: string;
	path: string;
	method: string;
	meta: PaginationMeta | null;
	data: T;
}

export interface PaginatedResult<T> {
	data: T[];
	meta: PaginationMeta;
}
