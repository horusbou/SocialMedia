import {useState,useEffect  } from "react"
import './index.css'
import { Avatar,Button } from "@chakra-ui/react"
import Client from "../../services/Client";
export function HoverUser({username,onMouseLeave}) {
    const [loading,setLoading] = useState(true);
    const [userData,setUserData]= useState({});
    useEffect(()=>{
       Client.getUserData(username).then(res=>{
        setUserData(res.data);
        setLoading(false)
    })
    },[username])

    if(loading)
        return <></>
    return (
        <div className="hoverCard container" onMouseLeave={onMouseLeave}>
            <div className="card">
                <div className="profile-card">
                    <div className="avatar-profile">
                        <Avatar src={(userData&&userData.userAvatar)||''} name={(userData&&userData.firstname+" "+userData.lastname)||''}/>
                    </div>
                    <div className="data-profile">
                        <div className="main-profile">
                            <div className="user-info">
                                <div className="user-data">
                                <h3>{userData.firstname+' '+ userData.lastname}</h3>
                                <p>active 1 day ago</p>
                                </div>
                                <Button variant='outline' style={{color:"white",fontFamily:"OpenSansBold"}} _hover={{}} _focus={{}} _active={{}} className="follow-btn">
                                    Following
                                </Button>
                            </div>
                        </div>
                        <div className="user-bio">
                            <p>{userData.bio}</p>
                        </div>
                        <div className="user-follows">
                            <p><b>{userData.followers}</b> Followers</p>
                            <p><b>{userData.followings}</b> Following</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
