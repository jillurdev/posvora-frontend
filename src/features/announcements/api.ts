import { httpClient } from "@/services/httpClient";
import type { OrgAnnouncement } from "./types";

export const announcementsApi = {
	mine: () => httpClient.get<OrgAnnouncement[]>("/organization/me/announcements"),
};
