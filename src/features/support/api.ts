import { httpClient } from "@/services/httpClient";
import type {
	CreateGuestTicketPayload,
	CreateTicketPayload,
	SupportTicket,
} from "./types";

export const supportApi = {
	// Authenticated org user
	list: () => httpClient.get<SupportTicket[]>("/support/tickets"),
	getOne: (id: string) => httpClient.get<SupportTicket>(`/support/tickets/${id}`),
	create: (payload: CreateTicketPayload) =>
		httpClient.post<SupportTicket>("/support/tickets", payload),
	reply: (id: string, message: string) =>
		httpClient.post(`/support/tickets/${id}/messages`, { message }),

	// Guest (public, no auth)
	createGuest: (payload: CreateGuestTicketPayload) =>
		httpClient.post<SupportTicket>("/support/tickets/guest", payload),
	getGuestOne: (id: string, token: string) =>
		httpClient.get<SupportTicket>(`/support/tickets/guest/${id}`, { token }),
	replyGuest: (id: string, token: string, message: string) =>
		httpClient.post(`/support/tickets/guest/${id}/messages?token=${encodeURIComponent(token)}`, { message }),
};
