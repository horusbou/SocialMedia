import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import LoginSignUp from './pages/index'
import TweetPage from './pages/TweetPage'
import Bookmark from './pages/Bookmark';
import MessagesPage from './pages/Message'
import {Nav,Followers,UserDetailsProvider, userContext} from './compontents';
import Profile from './pages/Profile';
import socket from "./compontents/socket";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useState,useEffect,useContext } from 'react';
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
const HandleSocketConnection=()=>{
    const {userData:user} = useContext(userContext)

    useEffect(()=>{
        if(Object.keys(user).length>0){
            socket.on('session',({session_id,user_id})=>{
                socket.user_id = user_id;
                socket.session_id=session_id
            })
            socket.auth = { user }
            socket.connect();
          }
    },[user])
    return <></>
}
function App() {
    const [FetchFollowers,setFetchFollowers] = useState(false);
  const privateRoutes = ['/home', '/notifications', '/bookmarks','/messages',`/:username`, '/tweets/:tweet_id' ];

  return (
    <div className="app">
    <div className="appBody">
      <ChakraProvider>
        <UserDetailsProvider>
            <HandleSocketConnection />
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
