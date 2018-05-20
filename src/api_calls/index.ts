import axios from 'axios';
import { both, encaseP } from 'fluture';
import {
	currentAccountCurrency,
	getAccountBalance,
	nonce
} from '../utils/private.api';
import {
	traceLenses,
	filterCurrency,
	traceAccount,
	filterZeroBalances,
	reduceAccountData
} from '../utils/index';
import { view, compose } from 'ramda';
import { dataLens, resultLens, marketLens } from '../utils/lenses';

// public api stuff
const getPublicData = encaseP(axios);
const public_data = `https://bittrex.com/api/v1.1/public/getmarkets`;

// actual data stuff
export const marketData = getPublicData(public_data)
	.map(view(marketLens))
	.map(filterCurrency('XLM', 'BTC'));

export const currentAccountForCurrency = currentAccountCurrency('XVG')
	.map(traceLenses)
	.map(view(marketLens))
	.map(traceAccount);

export const currentAccountBalance = getAccountBalance(
	`https://bittrex.com/api/v1.1/account/getbalances?nonce=${nonce()}&apikey=${
		process.env.BITTREX_API_KEY
	}`
)
	.map(view(marketLens))
	.map(filterZeroBalances)
	.map(reduceAccountData);
