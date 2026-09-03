"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SelectField, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { FileUploadPreview } from "@/components/common/FileUploadPreview";
import { HandleAvailabilityField } from "@/components/common/HandleAvailabilityField";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile, useUploadAvatar } from "@/features/user/hooks/useProfile";
import { useOrganization, useUpdateOrganization, useUploadOrganizationLogo } from "@/features/organization/hooks/useOrganization";
import { organizationApi } from "@/features/organization/api";
import { useShops, useUploadShopLogo } from "@/features/shop/hooks/useShops";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/auth/schema";
import { TwoFactorSection } from "@/features/auth/components/TwoFactorSection";
import { KycVerificationSection } from "@/features/kyc/components/KycVerificationSection";
import { TaxRulesSection } from "@/features/tax/components/TaxRulesSection";
import type { UpdateOrganizationPayload } from "@/features/organization/types";

export default function SettingsPage() {
	const { user } = useAuth();
	const isOwner = user?.roles?.includes("OWNER");

	const updateProfile = useUpdateProfile();
	const uploadAvatar = useUploadAvatar();
	const { data: organization } = useOrganization();
	const updateOrganization = useUpdateOrganization();
	const uploadOrgLogo = useUploadOrganizationLogo();
	const { data: shops = [] } = useShops();
	const uploadShopLogo = useUploadShopLogo();
	const changePassword = useChangePassword();
	const [taxShopId, setTaxShopId] = useState<string>("");

	useEffect(() => {
		if (!taxShopId && shops.length) setTaxShopId(shops[0].id);
	}, [shops, taxShopId]);

	const profileForm = useForm({ defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" } });
	const orgForm = useForm<UpdateOrganizationPayload>({ defaultValues: { name: "", handle: "", email: "", phone: "", address: "" } });
	const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });
	// Gates "Save organization" while the handle field has an
	// unchecked/changed value — see HandleAvailabilityField.
	const [handleAvailable, setHandleAvailable] = useState(true);
	const handleValue = orgForm.watch("handle") ?? "";

	useEffect(() => {
		if (organization)
			orgForm.reset({
				name: organization.name,
				handle: organization.handle ?? "",
				email: organization.email ?? "",
				phone: organization.phone ?? "",
				address: organization.address ?? "",
			});
	}, [organization]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="max-w-2xl">
			<PageHeader title="Settings" description="Manage your profile, organization and security." />

			<Tabs defaultValue="general">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="branding">Branding</TabsTrigger>
					<TabsTrigger value="verification">Verification</TabsTrigger>
					<TabsTrigger value="taxes">Taxes</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				{/* ── General: profile + organization details ─────────── */}
				<TabsContent value="general">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">Your profile</h2>
						<form
							onSubmit={profileForm.handleSubmit(values => updateProfile.mutate(values))}
							className="space-y-4"
						>
							<TextField
								id="profile-email"
								label="Email"
								type="email"
								value={user?.email ?? ""}
								disabled
								hint="This is the email you signed up with — it can't be changed here. Contact support if it needs to change."
							/>
							<TextField id="profile-name" label="Name" {...profileForm.register("name")} />
							<TextField id="profile-phone" label="Phone" {...profileForm.register("phone")} />
							<Button type="submit" isLoading={updateProfile.isPending}>Save profile</Button>
						</form>
					</section>

					<section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-slate-700">Organization</h2>
							{!isOwner && (
								<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
									<Lock className="h-3 w-3" />
									Owner only
								</span>
							)}
						</div>

						{!isOwner && (
							<p className="mb-4 -mt-2 text-sm text-slate-500">
								Only the organization owner can update these details. Ask your owner if something needs to change.
							</p>
						)}

						<fieldset disabled={!isOwner} className="space-y-4 disabled:opacity-60">
							<form
								onSubmit={orgForm.handleSubmit(values => updateOrganization.mutate(values))}
								className="space-y-4"
							>
								<TextField id="org-name" label="Business name" {...orgForm.register("name")} />
								<HandleAvailabilityField
									id="org-handle"
									label="Handle (dashboard URL)"
									value={handleValue}
									onChange={v => orgForm.setValue("handle", v)}
									currentValue={organization?.handle ?? ""}
									placeholder="your-business"
									hint="Letters, numbers and hyphens only. This is your organization's dashboard URL (login required) — e.g. posvora.com/your-handle/dashboard. It's not a public storefront; for that, set each shop's own handle below."
									disabled={!isOwner}
									checkAvailability={v => organizationApi.checkHandleAvailability(v)}
									onAvailabilityChange={setHandleAvailable}
								/>
								<TextField id="org-email" label="Email" type="email" {...orgForm.register("email")} />
								<TextField id="org-phone" label="Phone" {...orgForm.register("phone")} />
								<TextField id="org-address" label="Address" {...orgForm.register("address")} />
								{isOwner && (
									<Button type="submit" isLoading={updateOrganization.isPending} disabled={!handleAvailable}>Save organization</Button>
								)}
							</form>
						</fieldset>
					</section>
				</TabsContent>

				{/* ── Branding: avatar, org logo, shop logos ───────────── */}
				<TabsContent value="branding">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">Your avatar</h2>
						<FileUploadPreview
							label="Profile photo"
							hint="Shown across the dashboard wherever your name appears."
							currentUrl={user?.avatarUrl}
							shape="circle"
							onConfirm={file => uploadAvatar.mutateAsync(file)}
						/>
					</section>

					<section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-slate-700">Organization logo</h2>
							{!isOwner && (
								<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
									<Lock className="h-3 w-3" />
									Owner only
								</span>
							)}
						</div>
						<p className="mb-4 -mt-2 text-sm text-slate-500">
							Shown on your dashboard header and can appear on generated receipts.
						</p>
						{isOwner ? (
							<FileUploadPreview
								label="Organization logo"
								hint="Square images work best."
								currentUrl={organization?.logoUrl}
								onConfirm={file => uploadOrgLogo.mutateAsync(file)}
							/>
						) : (
							<p className="text-sm text-slate-400">Only the organization owner can change this.</p>
						)}
					</section>

					<section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-1 text-sm font-semibold text-slate-700">Shop logos</h2>
						<p className="mb-4 text-sm text-slate-500">
							Each shop can have its own logo — this is what prints on that shop&apos;s sales receipts.
						</p>
						<div className="space-y-6">
							{shops.map(shop => (
								<FileUploadPreview
									key={shop.id}
									label={shop.name}
									currentUrl={shop.logoUrl}
									onConfirm={file => uploadShopLogo.mutateAsync({ id: shop.id, file })}
								/>
							))}
							{shops.length === 0 && (
								<p className="text-sm text-slate-400">You don&apos;t have any shops yet.</p>
							)}
						</div>
					</section>
				</TabsContent>

				{/* ── Verification: KYC ────────────────────────────────── */}
				<TabsContent value="verification">
					<KycVerificationSection />
				</TabsContent>

				{/* ── Taxes: tax-jurisdiction/rate/rule engine ─────────── */}
				<TabsContent value="taxes">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-1 text-sm font-semibold text-slate-700">Tax rules</h2>
						<p className="mb-4 text-sm text-slate-500">
							Tax rules are per-shop. Pick a shop to manage the VAT/tax rates that auto-apply
							to its sales.
						</p>
						{shops.length > 1 && (
							<div className="mb-4 max-w-xs">
								<SelectField id="tax-shop" label="Shop" value={taxShopId} onChange={e => setTaxShopId(e.target.value)}>
									{shops.map(shop => (
										<option key={shop.id} value={shop.id}>{shop.name}</option>
									))}
								</SelectField>
							</div>
						)}
						<TaxRulesSection shopId={taxShopId || shops[0]?.id} />
					</section>
				</TabsContent>

				{/* ── Security: password + 2FA ─────────────────────────── */}
				<TabsContent value="security">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">Change password</h2>
						<form
							onSubmit={passwordForm.handleSubmit(values =>
								changePassword.mutate(
									{ oldPassword: values.oldPassword, newPassword: values.newPassword },
									{ onSuccess: () => passwordForm.reset() },
								),
							)}
							className="space-y-4"
						>
							<TextField
								id="current-password"
								label="Current password"
								type="password"
								error={passwordForm.formState.errors.oldPassword?.message}
								{...passwordForm.register("oldPassword")}
							/>
							<TextField
								id="new-password"
								label="New password"
								type="password"
								error={passwordForm.formState.errors.newPassword?.message}
								{...passwordForm.register("newPassword")}
							/>
							<TextField
								id="confirm-password"
								label="Confirm new password"
								type="password"
								error={passwordForm.formState.errors.confirmPassword?.message}
								{...passwordForm.register("confirmPassword")}
							/>
							<Button type="submit" isLoading={changePassword.isPending}>Update password</Button>
						</form>
					</section>

					<div className="mt-8">
						<TwoFactorSection />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
