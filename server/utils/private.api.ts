import { compose } from 'ramda';
import { from } from 'rxjs';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as crypto from 'crypto';

dotenv.config();

export const nonce = (): number => Math.floor(new Date().getTime() / 1000);
export type PRIVATE_API =
	| 'https://bittrex.com/api/v1.1/account/getbalances?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getbalance?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getdepositaddress?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/withdraw?nonce=${nonce()}&currency=${currency}&apikey='
	| 'https://bittrex.com/api/v1.1/account/getorder?nonce=${nonce()}&currency=${currency}&apikey=';

// Signing API Signatures
const signedApi = (api: PRIVATE_API): string =>
	crypto
		.createHmac('sha512', `${process.env.BITTREX_SECRET}`)
		.update(api)
		.digest('hex');

// Getting Account Balance For Currency
const account_balance_for_currency = (currency: string): string =>
	`https://bittrex.com/api/v1.1/account/getbalance?nonce=${nonce()}&currency=${currency}&apikey=${
		process.env.BITTREX_API_KEY
	}`;

const signedApiForCurrency = compose(signedApi, account_balance_for_currency);

const getAccountBalanceForCurrency = (currency: string) =>
	axios
		.create({
			headers: {
				apisign: signedApiForCurrency(currency)
			}
		})
		.get(account_balance_for_currency(currency));

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

export const getAccountBalance = (url: string) =>
	from(
		axios
			.create({
				headers: {
					apisign: signedApiForAccountBalance({})
				}
			})
			.get(url)
	);
