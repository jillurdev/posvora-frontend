import { httpClient } from "@/services/httpClient";
import type { Currency, ExchangeRateQuote } from "@/types/currency";

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
};
