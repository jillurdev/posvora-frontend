export default function PrivacyPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
			<span className="text-sm font-medium text-slate-400">Legal</span>
			<h1 className="mt-2 text-4xl font-semibold text-slate-900">Privacy Policy</h1>
			<p className="mt-3 text-sm text-slate-400">Last updated: 25 July 2026</p>

			<div className="prose prose-slate mt-10 max-w-none text-slate-600">
				<p>
					This Privacy Policy explains what information Posvora collects, how we use it, and the choices you
					have. It applies to the Posvora website and application (the &quot;Service&quot;).
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">1. Information we collect</h2>
				<ul>
					<li>
						<strong>Account information</strong> — name, email, phone number, and business details you provide
						when registering.
					</li>
					<li>
						<strong>Business data</strong> — products, inventory, sales, purchases, customers, suppliers,
						employees and accounting records you enter or import into the Service.
					</li>
					<li>
						<strong>Usage data</strong> — pages visited, actions taken, device and browser information, used to
						improve the Service and secure your account.
					</li>
					<li>
						<strong>Cookies</strong> — used for authentication (keeping you signed in) and basic analytics.
					</li>
				</ul>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">2. How we use your information</h2>
				<p>
					We use the information above to operate and improve the Service, process transactions, provide
					customer support, send important account and billing notices, and detect or prevent fraud and abuse.
					We do not sell your business data to third parties.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">3. Sharing of information</h2>
				<p>
					We share information only with: (a) service providers who help us run the platform (e.g. hosting,
					payment processing) under confidentiality obligations; (b) authorities where required by law; and
					(c) other parties with your explicit consent.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">4. Data security</h2>
				<p>
					We use industry-standard measures — encrypted connections, hashed passwords, and access controls — to
					protect your data. No system is completely secure, so we encourage strong, unique passwords and
					enabling any available account protections.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">5. Data retention</h2>
				<p>
					We retain your account and business data for as long as your account is active. If you close your
					account, we retain data for a limited period to allow recovery or as required for legal, tax or
					accounting purposes, after which it is deleted or anonymized.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">6. Your choices</h2>
				<p>
					You can access, correct, or export most of your business data directly from the dashboard. You can
					request a full export or deletion of your account data by contacting us.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">7. Children&apos;s privacy</h2>
				<p>The Service is intended for business use and is not directed at individuals under 18.</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">8. Changes to this policy</h2>
				<p>
					We may update this Privacy Policy periodically. We&apos;ll notify you of material changes via the app
					or email.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">9. Contact</h2>
				<p>
					For privacy questions or data requests, email{" "}
					<a href="mailto:privacy@posvora.com" className="text-slate-900 underline">
						privacy@posvora.com
					</a>{" "}
					or visit our <a href="/contact" className="text-slate-900 underline">contact page</a>.
				</p>
			</div>
		</div>
	);
}
