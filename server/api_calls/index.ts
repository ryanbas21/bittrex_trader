import axios from 'axios';
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
	currentAccountCurrency,
	getAccountBalance,
	nonce
} from '../utils/private.api';
import { traceAccount, CurrencyData, reduceAccountData } from '../utils/index';
import { view } from 'ramda';
import { marketLens } from '../utils/lenses';

// public api stuff
type Public_Api = 'https://bittrex.com/api/v1.1/public/getmarkets';
const public_data: Public_Api = `https://bittrex.com/api/v1.1/public/getmarkets`;

// actual data stuff
export const marketData = from(axios.get(public_data)).pipe(
	map(view(marketLens))
);

export const currentAccountForCurrency = from(
	currentAccountCurrency('XVG')
).pipe(map(view(marketLens)), map(traceAccount));

export const currentAccountBalance = getAccountBalance(
	`https://bittrex.com/api/v1.1/account/getbalances?nonce=${nonce()}&apikey=${
		process.env.BITTREX_API_KEY
	}`
).pipe(
	map(view(marketLens)),
	filter((currency: CurrencyData) => currency.Balance > 0) as any,
	map(reduceAccountData)
);
