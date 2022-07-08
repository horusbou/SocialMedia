import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import {Nav,Followers,UserDetailsProvider} from './compontents';
import Profile from './pages/Profile';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Client from './services/Client';

const PrivateRoute = (props) => {
  const { Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(props) =>
        Client.isLoggedIn() ? (<Component {...rest} />) : (<Redirect to="/" />)
      }
    />
  );
};

const PublicRoute = (props)=>{
    const { Component, ...rest } = props;
    return (
      <Route
        {...rest}
        render={(props) =>
          !Client.isLoggedIn() ? (<Component {...rest} />) : (<Redirect to="/" />)
        }
      />
    );
}

function App() {


  const privateRoutes = ['/home', '/notifications', '/bookmarks', `/:username`];

  return (
    <div className="app">
    <div className="appBody">
      <ChakraProvider>
        <UserDetailsProvider>
        <Router>
        <PrivateRoute
            path={privateRoutes}
            Component={Nav}
            />
          <Switch>
          <PublicRoute
                exact
                path="/signup"
                Component={SignUp}
           />

          <PublicRoute
                exact
                path="/"
                Component={SignIn}
           />

            <PrivateRoute
              exact
              path="/home"
              Component={Home}
            />
            <PrivateRoute exact path={`/:username`} Component={Profile} />
          </Switch>
          <PrivateRoute
            path={privateRoutes}
            Component={Followers}
          />
        </Router>
        </UserDetailsProvider>

      </ChakraProvider>
    </div>
    </div>

  );
}

export default App;
