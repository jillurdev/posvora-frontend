"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionApi } from "../api";

export function usePlans() {
	return useQuery({ queryKey: ["plans"], queryFn: subscriptionApi.plans });
}

export function useMySubscription() {
	return useQuery({ queryKey: ["subscription", "me"], queryFn: subscriptionApi.me });
}

export function useSubscribe() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (planId: string) => subscriptionApi.subscribe(planId),
		onSuccess: () => {
			toast.success("Subscribed successfully");
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
