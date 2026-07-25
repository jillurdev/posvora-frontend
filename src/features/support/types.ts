export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface SupportTicketReply {
	id: string;
	ticketId: string;
	userId?: string | null;
	authorName?: string | null;
	message: string;
	isStaff: boolean;
	createdAt: string;
}

export interface SupportTicket {
	id: string;
	organizationId?: string | null;
	createdById?: string | null;
	guestName?: string | null;
	guestEmail?: string | null;
	guestAccessToken?: string | null;
	subject: string;
	description: string;
	status: SupportTicketStatus;
	priority: SupportTicketPriority;
	createdAt: string;
	updatedAt: string;
	replies?: SupportTicketReply[];
	_count?: { replies: number };
}

export interface CreateTicketPayload {
	subject: string;
	description: string;
	priority?: SupportTicketPriority;
}

export interface CreateGuestTicketPayload extends CreateTicketPayload {
	guestName: string;
	guestEmail: string;
}
