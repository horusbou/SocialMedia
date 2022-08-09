import React,{useContext} from 'react'
import './Aside.css'
import {NavLink,Link,useLocation} from 'react-router-dom'
import {Icon} from '@chakra-ui/react'
import {
    HiUser,
    HiOutlineUser
} from "react-icons/hi"
import {AiOutlineHome,
    AiOutlineBell,
    AiOutlineBook,
    AiFillHome,
    AiFillBell,
    AiFillBook,
} from "react-icons/ai";
import { userContext } from '../context'

export const Nav = ()=>{
    const location = useLocation();
    const user = useContext(userContext);
  return (
    <div className="aside">
    <div className="logo">
        <Link to="/home" ><Icon className="icon" /></Link>
        </div>
    <div className="nav-contenent">
    <nav>
        <NavLink className="nav-item" to="/home">
            {'/home'===location.pathname ?
            <Icon className="icon" as={AiFillHome} />:
            <Icon className="icon" as={AiOutlineHome} />}
            Home
            </NavLink>
        <NavLink className="nav-item" to="/notifications">

            {'/notifications'===location.pathname ?
            <Icon className="icon" as={AiFillBell} />:
            <Icon className="icon" as={AiOutlineBell} />}
            Notification</NavLink>
        <NavLink className="nav-item"  to="/bookmarks">
            {'/bookmarks'===location.pathname ?
            <Icon className="icon" as={AiFillBook} />:
            <Icon className="icon" as={AiOutlineBook} />}
            Bookmarks</NavLink>
        <NavLink className="nav-item"  to={user.username?`/${user.username}`:`/`}>
            {`/${user.username}`===location.pathname ?
            <Icon className="icon" as={HiUser}/>:
            <Icon className="icon" as={HiOutlineUser} />}
            Profile</NavLink>
    </nav>
    </div>
  </div>)
}
