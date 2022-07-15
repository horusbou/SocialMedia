import React,{useContext} from "react"
import {Link} from 'react-router-dom'
import './index.css'
import {Avatar,Button,Icon} from '@chakra-ui/react'
import {colors} from '../../lib'
import {MdOutlineMailOutline,MdNotifications} from 'react-icons/md'
//MdOutlineMarkEmailUnread
import { userContext } from '../context'

export const Header =()=>{

const user = useContext(userContext);

return (<div className="options">
     <Button backgroundColor={colors.pink}
        _hover={{backgroundColor:colors.pink}}
        height='38px'
        width='110px'
        _active={{backgroundColor:'red'}}
           >Post</Button>
        <Icon w={6} h={6} as={MdOutlineMailOutline} />
        <Icon w={5} h={5} as={MdNotifications} />
        <Link to={user.username?`${user.username}`:`/`}>
       <Avatar name={user.firstname + ' '+ user.lastname} src={user.userAvatar} />
        </Link>
    </div>)
}
