"use client";

import { useState } from "react";

export function usePagination(initialLimit = 10) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(initialLimit);

	return { page, limit, setPage, setLimit };
}
