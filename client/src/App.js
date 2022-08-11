import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import LoginSignUp from './pages/index'
import TweetPage from './pages/TweetPage'
import Bookmark from './pages/Bookmark';
import MessagesPage from './pages/Message'
import {Nav,Followers,UserDetailsProvider} from './compontents';
import Profile from './pages/Profile';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom';
import { useState } from 'react';
import Client from './services/Client';
import { Notifications } from './pages/Notification';

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
          !Client.isLoggedIn() ? (<Component {...rest} />) : (<Redirect to="/home" />)
        }
      />
    );
}

function App() {
    const [FetchFollowers,setFetchFollowers] = useState(false);
  const privateRoutes = ['/home', '/notifications', '/bookmarks','/messages',`/:username`, '/tweets/:tweet_id' ];
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
                path="/"
                Component={LoginSignUp}
           />
            <PrivateRoute
                exact
                path={`/messages`}
                Component={MessagesPage}
            />

            <PrivateRoute
              exact
              path="/home"
              Component={Home}
            />
            <PrivateRoute
              exact
              path="/notifications"
              Component={Notifications}
            />
             <PrivateRoute
              exact
              path="/bookmarks"
              Component={Bookmark}
            />

            <PrivateRoute
              exact
              path="/tweets/:tweet_id"
              Component={TweetPage}
            />
            <PrivateRoute
                exact
                path={`/:username`}
                FetchFollowers={()=>{setFetchFollowers(!FetchFollowers)}}
                Component={Profile}
            />

          </Switch>
          <PrivateRoute
            path={privateRoutes}
            Component={Followers}
            FetchFollowers={FetchFollowers}
          />
        </Router>
        </UserDetailsProvider>

      </ChakraProvider>
    </div>
    </div>

  );
}

export default App;
