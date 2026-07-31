"use client";

import { useQuery } from "@tanstack/react-query";
import { announcementsApi } from "../api";

export function useAnnouncements() {
	return useQuery({
		queryKey: ["announcements", "mine"],
		queryFn: announcementsApi.mine,
		staleTime: 5 * 60 * 1000,
	});
}
