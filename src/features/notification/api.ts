import { httpClient } from "@/services/httpClient";
import type { AppNotification } from "./types";

export const notificationApi = {
	list: () => httpClient.get<AppNotification[]>("/notifications"),
	markRead: (id: string) => httpClient.patch(`/notifications/${id}/read`),
	markAllRead: () => httpClient.patch("/notifications/read-all"),
};
