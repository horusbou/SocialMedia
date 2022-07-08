import React,{useEffect,useState} from "react";
import Client from "../../services/Client";
let userContext = React.createContext({});

const UserDetailsProvider = ({children})=>{
    const [userData,setUserData] = useState({});
    useEffect(() => {
        Client.getUser()
        .then((userData) => {
          if (userData){
              setUserData(userData);
        }
        })
      }, []);

    return (<userContext.Provider value={userData}>
        {children}
    </userContext.Provider>)
}
export {userContext,UserDetailsProvider};
