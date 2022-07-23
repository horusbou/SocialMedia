import React,{useContext} from "react"
import './index.css'
import {Avatar,Icon} from '@chakra-ui/react'
import {MdOutlineMailOutline,MdNotifications} from 'react-icons/md'
import { userContext } from '../context'
import { PostDialog } from "../Post/postDialog"

export const Header =()=>{

const user = useContext(userContext);

return (<div className="options">
        <PostDialog />
        {/* addToPost={(post)=>{setPostData([post,...postData])}} */}
        <Icon w={6} h={6} as={MdOutlineMailOutline} />
        <Icon w={5} h={5} as={MdNotifications} />
        {/* <Link to={user.username?`${user.username}`:`/`}> */}
       <Avatar name={user.firstname + ' '+ user.lastname} src={user.userAvatar} />
        {/* </Link> */}
    </div>)
}
