import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface DashboardProps extends RouteComponentProps<any> {}
interface DashboardState {}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
	render() {
		return <div>Dashboard</div>;
	}
}

export default Dashboard;
