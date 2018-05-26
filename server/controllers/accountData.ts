import { config } from 'dotenv';
import * as express from 'express';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from 'ramda';
import { Market } from '../utils/index';
import { marketData, currentAccountBalance } from '../api_calls/index';

config();

export interface resWithData extends express.Response {
	data: R.Dictionary<Market>;
}
export function accountAndMarketData(
	req: express.Request,
	res: resWithData,
	next: express.NextFunction
) {
	console.log('hit');
	forkJoin(currentAccountBalance, marketData)
		.pipe(
			map((data: [any, R.Dictionary<Market>]) => {
				const [userBalance, currentMarket] = data;

				const coinsUserOwnsCurrentData = filter(
					(coin: Market) => userBalance[coin.MarketCurrency],
					currentMarket
				);
				return coinsUserOwnsCurrentData;
			}),
			map((data) => (res.data = data))
		)
		.subscribe();

	next();
}
