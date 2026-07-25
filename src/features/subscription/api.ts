import { httpClient } from "@/services/httpClient";
import type { Plan, Subscription } from "./types";

export const subscriptionApi = {
	plans: () => httpClient.get<Plan[]>("/subscription/plans"),
	me: () => httpClient.get<Subscription | null>("/subscription/me"),
	subscribe: (planId: string) => httpClient.post<Subscription>("/subscription/subscribe", { planId }),
	cancel: () => httpClient.post("/subscription/cancel"),
};
