import * as React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Dashboard, Login } from '../';

export default () => (
	<Router>
		<div>
			<ul>
				<li>
					<Link to="/">Login</Link>
				</li>
				<li>
					<Link to="/dashboard">Dashboard</Link>
				</li>
			</ul>
			<Route exact path="/" component={Login} />
			<Route exact path="/dashboard" component={Dashboard} />
		</div>
	</Router>
);
