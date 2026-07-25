export default function TermsPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
			<span className="text-sm font-medium text-slate-400">Legal</span>
			<h1 className="mt-2 text-4xl font-semibold text-slate-900">Terms of Service</h1>
			<p className="mt-3 text-sm text-slate-400">Last updated: 25 July 2026</p>

			<div className="prose prose-slate mt-10 max-w-none text-slate-600">
				<p>
					These Terms of Service (&quot;Terms&quot;) govern access to and use of Posvora (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;).
					By creating an account or using the Service, you agree to these Terms on behalf of yourself and the
					business you represent.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">1. Your account</h2>
				<p>
					You&apos;re responsible for keeping your login credentials secure and for all activity carried out under
					your organization&apos;s account, including actions taken by employees you invite. You must provide
					accurate business information when registering.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">2. Subscriptions & billing</h2>
				<p>
					Paid plans are billed in advance on a recurring basis (monthly or as otherwise agreed) until cancelled.
					Fees are non-refundable except where required by law. We may change pricing with advance notice; continued
					use after a price change constitutes acceptance of the new pricing.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">3. Acceptable use</h2>
				<p>
					You agree not to use the Service to store or process unlawful content, attempt to breach the security
					of the platform, resell access without authorization, or use the Service in a way that disrupts other
					customers.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">4. Your data</h2>
				<p>
					You retain ownership of the business data you upload (products, sales, customers, etc.). We process it
					only to provide the Service, as described in our{" "}
					<a href="/privacy" className="text-slate-900 underline">
						Privacy Policy
					</a>
					. You&apos;re responsible for the accuracy and legality of the data you enter.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">5. Service availability</h2>
				<p>
					We aim for high availability but do not guarantee the Service will be uninterrupted or error-free.
					We may perform scheduled maintenance with reasonable notice where practical.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">6. Termination</h2>
				<p>
					You may cancel your subscription at any time from Settings. We may suspend or terminate accounts that
					violate these Terms or remain unpaid after a reasonable grace period. Upon termination, you may
					request an export of your data within a limited period, after which it may be deleted.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">7. Limitation of liability</h2>
				<p>
					The Service is provided &quot;as is&quot;. To the maximum extent permitted by law, we are not liable for
					indirect, incidental or consequential damages arising from your use of the Service, including lost
					profits or lost data, beyond amounts paid to us in the preceding three months.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">8. Changes to these Terms</h2>
				<p>
					We may update these Terms from time to time. Material changes will be communicated via the app or
					email. Continued use of the Service after changes take effect constitutes acceptance.
				</p>

				<h2 className="mt-8 text-xl font-semibold text-slate-900">9. Contact</h2>
				<p>
					Questions about these Terms can be sent to <a href="mailto:support@posvora.com" className="text-slate-900 underline">support@posvora.com</a>{" "}
					or via our <a href="/contact" className="text-slate-900 underline">contact page</a>.
				</p>
			</div>
		</div>
	);
}
