import { compose, filter, curry } from 'ramda';
import { encaseP } from 'fluture';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
dotenv.config();
export const nonce = () => Math.floor(new Date().getTime() / 1000);

export type PRIVATE_API =
	| 'https://bittrex.com/api/v1.1/account/getbalances?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getbalance?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getdepositaddress?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/withdraw?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getorder?nonce=${nonce()}&currency=${currency}&apikey=';

// Signing API Signatures
const signedApi = (api: PRIVATE_API) =>
	crypto
		.createHmac('sha512', `${process.env.BITTREX_SECRET}`)
		.update(api)
		.digest('hex');

// Getting Account Balance For Currency
const account_balance_for_currency = (currency) =>
	`https://bittrex.com/api/v1.1/account/getbalance?nonce=${nonce()}&currency=${currency}&apikey=${
		process.env.BITTREX_API_KEY
	}`;

const signedApiForCurrency = compose(signedApi, account_balance_for_currency);

const getAccountBalanceForCurrency = encaseP(
	axios.create({
		headers: {
			apisign: signedApiForCurrency('XVG')
		}
	})
);
export const currentAccountCurrency = compose(
	getAccountBalanceForCurrency,
	account_balance_for_currency
);

// Getting Account Balance
const accountBalance = (): PRIVATE_API =>
	`https://bittrex.com/api/v1.1/account/getbalances?nonce=${nonce()}&apikey=${
		process.env.BITTREX_API_KEY
	}` as PRIVATE_API;
const signedApiForAccountBalance = compose(signedApi, accountBalance);

export const getAccountBalance = encaseP(
	axios.create({
		headers: {
			apisign: signedApiForAccountBalance(null)
		}
	})
);
