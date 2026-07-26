"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, ShieldOff, Copy, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useSetupTwoFactor } from "@/features/auth/hooks/useSetupTwoFactor";
import { useEnableTwoFactor } from "@/features/auth/hooks/useEnableTwoFactor";
import { useDisableTwoFactor } from "@/features/auth/hooks/useDisableTwoFactor";

export function TwoFactorSection() {
	const { user } = useAuth();
	const enabled = !!user?.twoFactorEnabled;

	const [enableOpen, setEnableOpen] = useState(false);
	const [disableOpen, setDisableOpen] = useState(false);

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-sm font-semibold text-slate-700">Two-factor authentication</h2>
					<p className="mt-1 text-sm text-slate-500">
						{enabled
							? "Enabled — you'll need a code from your authenticator app to log in."
							: "Add an extra layer of security: a code from an authenticator app is required to log in."}
					</p>
				</div>
				{enabled ? (
					<Button variant="outline" onClick={() => setDisableOpen(true)}>
						<ShieldOff className="h-4 w-4" />
						Disable
					</Button>
				) : (
					<Button onClick={() => setEnableOpen(true)}>
						<ShieldCheck className="h-4 w-4" />
						Enable
					</Button>
				)}
			</div>

			<EnableTwoFactorModal open={enableOpen} onClose={() => setEnableOpen(false)} />
			<DisableTwoFactorModal open={disableOpen} onClose={() => setDisableOpen(false)} />
		</section>
	);
}

function EnableTwoFactorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const setup = useSetupTwoFactor();
	const enable = useEnableTwoFactor();

	const [step, setStep] = useState<"qr" | "codes">("qr");
	const [token, setToken] = useState("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
	const [copied, setCopied] = useState(false);

	// Kick off setup the first time the modal opens for this session.
	useEffect(() => {
		if (open && !setup.data && !setup.isPending && !setup.isError) {
			setup.mutate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	function handleClose() {
		setStep("qr");
		setToken("");
		setRecoveryCodes([]);
		setCopied(false);
		setup.reset();
		enable.reset();
		onClose();
	}

	function handleConfirm() {
		enable.mutate(token, {
			onSuccess: result => {
				setRecoveryCodes(result.recoveryCodes);
				setStep("codes");
			},
		});
	}

	function copyRecoveryCodes() {
		navigator.clipboard.writeText(recoveryCodes.join("\n"));
		setCopied(true);
	}

	return (
		<Modal open={open} onClose={handleClose} title={step === "qr" ? "Enable two-factor authentication" : "Save your recovery codes"}>
			{step === "qr" ? (
				<div className="space-y-4">
					<p className="text-sm text-slate-600">
						Scan this with Google Authenticator, Authy, or any TOTP app, then enter the 6-digit
						code it shows.
					</p>

					{setup.data && (
						<div className="flex flex-col items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
							<QRCodeSVG value={setup.data.otpauthUrl} size={180} />
							<p className="break-all text-center text-xs text-slate-500">
								Can&apos;t scan? Enter this code manually: <span className="font-mono">{setup.data.secret}</span>
							</p>
						</div>
					)}

					<TextField
						id="2fa-token"
						label="6-digit code"
						inputMode="numeric"
						maxLength={6}
						placeholder="123456"
						value={token}
						onChange={e => setToken(e.target.value.replace(/\D/g, ""))}
					/>

					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={handleClose}>Cancel</Button>
						<Button onClick={handleConfirm} isLoading={enable.isPending} disabled={token.length !== 6}>
							Confirm & enable
						</Button>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<p className="text-sm text-slate-600">
						Store these somewhere safe. Each code can be used once to log in if you lose access to
						your authenticator app — they won&apos;t be shown again.
					</p>

					<div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 bg-slate-50 p-4 font-mono text-sm">
						{recoveryCodes.map(code => (
							<span key={code}>{code}</span>
						))}
					</div>

					<Button variant="outline" onClick={copyRecoveryCodes} className="w-full">
						{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
						{copied ? "Copied" : "Copy codes"}
					</Button>

					<Button onClick={handleClose} className="w-full">I've saved these codes</Button>
				</div>
			)}
		</Modal>
	);
}

function DisableTwoFactorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const disable = useDisableTwoFactor();
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");

	function handleClose() {
		setPassword("");
		setToken("");
		disable.reset();
		onClose();
	}

	function handleSubmit() {
		disable.mutate({ password, token }, { onSuccess: handleClose });
	}

	return (
		<Modal open={open} onClose={handleClose} title="Disable two-factor authentication">
			<div className="space-y-4">
				<p className="text-sm text-slate-600">
					Confirm your password and a current authenticator code to turn this off.
				</p>
				<TextField
					id="disable-2fa-password"
					label="Current password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<TextField
					id="disable-2fa-token"
					label="6-digit code"
					inputMode="numeric"
					maxLength={6}
					placeholder="123456"
					value={token}
					onChange={e => setToken(e.target.value.replace(/\D/g, ""))}
				/>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={handleClose}>Cancel</Button>
					<Button
						variant="danger"
						onClick={handleSubmit}
						isLoading={disable.isPending}
						disabled={!password || token.length !== 6}
					>
						Disable 2FA
					</Button>
				</div>
			</div>
		</Modal>
	);
}
