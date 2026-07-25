import type { SupportTicketPriority, SupportTicketStatus } from "./types";

export const STATUS_TONE: Record<SupportTicketStatus, "default" | "success" | "warning" | "danger" | "info"> = {
	OPEN: "info",
	IN_PROGRESS: "warning",
	RESOLVED: "success",
	CLOSED: "default",
};

export const PRIORITY_TONE: Record<SupportTicketPriority, "default" | "success" | "warning" | "danger" | "info"> = {
	LOW: "default",
	MEDIUM: "info",
	HIGH: "warning",
	URGENT: "danger",
};

export const STATUS_LABEL: Record<SupportTicketStatus, string> = {
	OPEN: "Open",
	IN_PROGRESS: "In progress",
	RESOLVED: "Resolved",
	CLOSED: "Closed",
};
