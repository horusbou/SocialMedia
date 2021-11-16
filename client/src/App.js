import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Aside from './compontents/Aside';
import Contact from './compontents/Contact';
import Profile from './pages/Profile';
import { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Link,
	Redirect,
} from 'react-router-dom';
import Client from './services/Client';
const PrivateRoute = ({ Component, ...rest }) => {
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /signin page
		<Route
			{...rest}
			render={(props) =>
				Client.isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />
			}
		/>
	);
};
// function PrivateRoute(props) {
// 	const { Component, ...rest } = props;
// 	const render = (props) => {
// 		if (Client.isLoggedIn()) {
// 			return <Redirect to="/" />;
// 		}

// 		return <Component {...props} />;
// 	};
// 	return <Route {...rest} render={render} />;
// }
function App() {
	const [postData, setPostData] = useState([]);
	const [userData, setUserData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isPosted, setIsPosted] = useState(false);
	// eslint-disable-next-line
	const [isLoggedIn, setIsLoggedIn] = useState(true);

	// useEffect(() => {
	// 	Client.getAllPosts()
	// 		.then((response) => {
	// 			setIsLoading(true);
	// 			setPostData(response);
	// 		})
	// 		.then((data) => {
	// 			setIsLoading(false);
	// 			setIsPosted(false);
	// 		});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isPosted]);

	// useEffect(() => {
	// 	Client.getUser().then((userData) => {
	// 		if (userData) setUserData(userData);
	// 		else setUserData({});
	// 	});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	const privateRoutes = ['/home'];
	return (
		<div className="app">
			<ChakraProvider>
				<Router>
					<PrivateRoute
						path={privateRoutes}
						username={userData.username}
						Component={Aside}
						// render={() => <Aside username={userData.username} />}
					/>
					<Switch>
						<Route exact path="/">
							<SignIn />
						</Route>
						<Route exact path="/signup">
							<SignUp />
						</Route>

						<PrivateRoute
							exact
							path="/home"
							isLoading={isLoading}
							userData={userData}
							postData={postData}
							setIsPosted={setIsPosted}
							Component={Home}
						/>

						{/* </PrivateRoute> */}

						<PrivateRoute path="/:username" Component={Profile} />
					</Switch>
					<PrivateRoute
						path={privateRoutes}
						userAvatar={userData.userAvatar}
						username={userData.username}
						Component={Contact}
					/>
				</Router>
			</ChakraProvider>
		</div>
	);
}

export default App;
