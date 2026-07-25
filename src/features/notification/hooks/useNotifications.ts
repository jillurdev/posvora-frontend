"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api";

export function useNotifications() {
	return useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });
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
