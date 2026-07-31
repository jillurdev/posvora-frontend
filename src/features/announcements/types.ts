export interface OrgAnnouncement {
	id: string;
	title: string;
	message: string;
	organizationId: string | null;
	createdAt: string;
}
