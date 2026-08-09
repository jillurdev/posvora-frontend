// A pragmatic, non-exhaustive list — enough for the markets Posvora
// realistically serves at launch. Extend as new markets are onboarded.
export const COUNTRIES = [
	{ code: "BD", label: "Bangladesh", defaultCurrency: "BDT" },
	{ code: "US", label: "United States", defaultCurrency: "USD" },
	{ code: "GB", label: "United Kingdom", defaultCurrency: "GBP" },
	{ code: "IN", label: "India", defaultCurrency: "INR" },
	{ code: "AE", label: "United Arab Emirates", defaultCurrency: "AED" },
	{ code: "SA", label: "Saudi Arabia", defaultCurrency: "SAR" },
	{ code: "MY", label: "Malaysia", defaultCurrency: "MYR" },
	{ code: "SG", label: "Singapore", defaultCurrency: "SGD" },
	{ code: "DE", label: "Germany", defaultCurrency: "EUR" },
	{ code: "FR", label: "France", defaultCurrency: "EUR" },
	{ code: "OTHER", label: "Other / Not listed", defaultCurrency: "USD" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];
