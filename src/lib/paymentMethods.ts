export type PaymentMethodOption = { value: string; label: string };

// Methods that work anywhere, regardless of country.
const UNIVERSAL_METHODS: PaymentMethodOption[] = [
	{ value: "CASH", label: "Cash" },
	{ value: "CARD", label: "Card" },
	{ value: "BANK_TRANSFER", label: "Bank Transfer" },
];

// Mobile-wallet methods that only exist in specific markets.
const COUNTRY_METHODS: Record<string, PaymentMethodOption[]> = {
	BD: [
		{ value: "BKASH", label: "bKash" },
		{ value: "NAGAD", label: "Nagad" },
		{ value: "ROCKET", label: "Rocket" },
		{ value: "UPAY", label: "Upay" },
	],
};

/**
 * Builds the payment method list to show for a shop, filtering out
 * country-specific mobile wallets that wouldn't apply outside their home
 * market. `extra` lets a screen append methods only it needs (e.g. POS's
 * "Due / pay later" doesn't make sense for a supplier purchase payment).
 */
export function getPaymentMethods(countryCode: string | undefined, extra: PaymentMethodOption[] = []): PaymentMethodOption[] {
	const localMethods = countryCode ? (COUNTRY_METHODS[countryCode] ?? []) : [];
	return [...UNIVERSAL_METHODS, ...localMethods, ...extra];
}
