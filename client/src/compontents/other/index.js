import React,{useContext,useState} from "react"
import { colors } from "../../lib"
import './index.css'
import {Avatar,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Button
} from '@chakra-ui/react'
import { Redirect,useHistory } from "react-router-dom"
import Client from '../../services/Client'
import {MdOutlineMailOutline,MdNotifications} from 'react-icons/md'
import { userContext } from '../context'
import { PostDialog } from "../Post/postDialog"

export const Header =()=>{
const user = useContext(userContext);
const [redirect,setRedirect] = useState(false)
const history = useHistory()
if(redirect)
    return <Redirect to="/" />


return (<div className="options">
        <PostDialog />
        <Icon w={6} h={6} as={MdOutlineMailOutline} style={{cursor:'pointer'}} onClick={()=>{history.push('/messages')}} />
        <Icon w={5} h={5} as={MdNotifications} />
        <Popover _hover={{}} _focus={{}} _active={{}} matchWidth={true}>
            <PopoverTrigger >
                {Object.keys(user).length>0?<Avatar style={{cursor:'pointer'}} name={user.firstname + ' '+ user.lastname} src={user.userAvatar} />:<Avatar style={{cursor:'pointer'}} />}
            </PopoverTrigger>
        <PopoverContent  _hover={{}} _focus={{}} _active={{}} width={"200px"} textAlign="center" bgColor={colors.background}>
            <PopoverArrow />
            <PopoverBody>
                <Button onClick={()=>{
                    Client.logout()
                    .then(()=>{
                        setRedirect(true)
                    })
                }} _hover={{}} _focus={{}} _active={{}} variant='ghost'>Log out @{user.username}</Button>
            </PopoverBody>
        </PopoverContent>
        </Popover>
    </div>)
}
