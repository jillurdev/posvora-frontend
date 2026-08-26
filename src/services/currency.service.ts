import { httpClient } from "@/services/httpClient";
import type { Currency, ExchangeRateFreshness, ExchangeRateQuote } from "@/types/currency";

export const currencyService = {
  list(): Promise<Currency[]> {
    return httpClient.get<Currency[]>("/currencies");
  },
  get(code: string): Promise<Currency> {
    return httpClient.get<Currency>(`/currencies/${encodeURIComponent(code)}`);
  },
  quote(fromCurrency: string, toCurrency: string, amount: number): Promise<ExchangeRateQuote> {
    return httpClient.get<ExchangeRateQuote>("/currencies/rates/quote", {
      from: fromCurrency,
      to: toCurrency,
      amount,
    });
  },
  // Reports how old the latest stored rate for a currency pair is, so
  // money-moving UI (POS foreign-currency sales, pricing) can warn the
  // user before they trust a quote that may be badly out of date.
  freshness(fromCurrency: string, toCurrency: string): Promise<ExchangeRateFreshness> {
    return httpClient.get<ExchangeRateFreshness>("/currencies/rates/freshness", {
      from: fromCurrency,
      to: toCurrency,
    });
  },
};
