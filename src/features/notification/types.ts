export interface AppNotification {
	id: string;
	title: string;
	body?: string | null;
	isRead: boolean;
	createdAt: string;
}
