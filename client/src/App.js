import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Aside from './compontents/Aside';
import Contact from './compontents/Contact';
import Profile from './pages/Profile';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Client from './services/Client';

function App() {
	const [postData, setPostData] = useState([]);
	const [userData, setUserData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isPosted, setIsPosted] = useState(false);
	// eslint-disable-next-line
	const [isLoggedIn, setIsLoggedIn] = useState(true);

	useEffect(() => {
		Client.getAllPosts()
			.then((response) => {
				setIsLoading(true);
				setPostData(response);
			})
			.then((data) => {
				setIsLoading(false);
				setIsPosted(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPosted]);

	useEffect(() => {
		Client.getUser().then((userData) => {
			if (userData) setUserData(userData);
			else setUserData({});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const privateRoutes = ['/home', '/:username'];
	return (
		<div className="app">
			<ChakraProvider>
				<Router>
					<Route
						path={privateRoutes}
						render={() => <Aside username={userData.username} />}
					/>
					<Switch>
						<Route exact path="/">
							<SignIn />
						</Route>
						<Route exact path="/signup">
							<div>
								<Link to="/">Login</Link>
							</div>
						</Route>

						<Route exact path="/home">
							<Home
								isLoading={isLoading}
								userData={userData}
								postData={postData}
								setIsPosted={setIsPosted}
							/>
						</Route>

						<Route path="/:username" component={Profile} />
					</Switch>
					<Route
						path={privateRoutes}
						render={() => (
							<Contact
								userAvatar={userData.userAvatar}
								username={userData.username}
							/>
						)}
					/>
				</Router>
			</ChakraProvider>
		</div>
	);
}

export default App;
