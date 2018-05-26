import * as express from 'express';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import { accountAndMarketData } from './controllers/accountData';

config();
const app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.get(
	'/dashboard',
	accountAndMarketData,
	(req: express.Request, res: express.Response) =>
		res.send(accountAndMarketData)
);

app.listen(process.env.PORT, () =>
	console.log('running on ' + process.env.PORT)
);
