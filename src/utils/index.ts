import { compose, filter, reduce, curry } from 'ramda';
import { encaseP } from 'fluture';
import { marketData } from '../api_calls/index';

// utility for console.log in a composition
export const trace = (msg) => (data) => {
	console.log(`${msg} :`, data);
	return data;
};
export const traceLenses = trace('Lenses: ');
export const traceAccount = trace('Account: ');

// interface for a Market returned by API
export interface Market {
	MarketCurrency: string;
	BaseCurrency: string;
	MarketCurrencyLong: string;
	BaseCurrencyLong: string;
	MinTradeSize: number;
	MarketName: string;
	IsActive: boolean;
	Created: string;
	Notice?: boolean;
	IsSponsored?: boolean;
	LogoUrl: string;
}

type BaseCurrency = 'BTC' | 'ETH' | 'USD';
export const filterCurrency = curry((currency: string, base: BaseCurrency) =>
	filter(
		(market: Market) =>
			market.MarketCurrency === currency && market.BaseCurrency === base
	)
);
export interface CurrencyData {
	Balance: number;
	Currency: string;
	Available: number;
	Pending: number;
	CryptoAddress?: string;
}
export const filterZeroBalances = filter(
	(currency: CurrencyData) => currency.Balance > 0
);
export const reduceAccountData: any = reduce(
	(acc, curr: CurrencyData) => ({
		...acc,
		[curr.Currency]: { ...curr }
	}),
	{}
);
