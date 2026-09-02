"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api";

export function useNotifications() {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: notificationApi.list,
		// Keeps the Topbar's unread badge reasonably fresh without a
		// websocket — cheap for a 50-row capped list polled while a
		// dashboard tab is open.
		refetchInterval: 60_000,
	});
}

export function useMarkNotificationRead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.markRead(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
	});
}

export function useMarkAllRead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => notificationApi.markAllRead(),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
	});
}
