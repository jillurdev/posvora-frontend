export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  minorUnit: number;
  decimalPlaces: number;
  isActive: boolean;
}

export interface ExchangeRateQuote {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  convertedAmount: number;
}
