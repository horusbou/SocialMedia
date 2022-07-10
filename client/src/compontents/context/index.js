import React,{useEffect,useState} from "react";
import Client from "../../services/Client";

let userContext = React.createContext({});

const UserDetailsProvider = ({children})=>{
    const [userData,setUserData] = useState({});
    useEffect( () => {
        async function getUserData(){
            const user = await Client.getUser();
            setUserData(user);
        }
        getUserData();
      }, []);

    return (<userContext.Provider value={userData}>
        {children}
    </userContext.Provider>)
}
export {userContext,UserDetailsProvider};
