import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { reduce, filter, intersection } from 'ramda';
import { CurrencyData, Market } from './utils/index';
import { both } from 'fluture';
import {
	marketData,
	currentAccountForCurrency,
	currentAccountBalance
} from './api_calls/index';

const app = express();
config();
const polling_rate =
	process.env.production === undefined ? 5000 : process.env.POLLING_RATE;

app.use(bodyParser.json());

function pollBittrex() {
	both(marketData, currentAccountBalance)
		// .map((data: [R.Dictionary<Market>, CurrencyData]) => {
		// 	const [currentMarket, userBalance] = data;
		// 	return [
		// 		intersection(currentMarket[0] as any, userBalance as any),
		// 		userBalance
		// 	];
		// })
		.fork((e) => e, console.log);
}

setInterval(pollBittrex, polling_rate);
