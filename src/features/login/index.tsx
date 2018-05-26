import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface LoginProps extends RouteComponentProps<any> {}
interface LoginState {}

class Login extends React.Component<LoginProps, LoginState> {
	render() {
		return <div> Login </div>;
	}
}

export default Login;
