import React from 'react'
import './Aside.css'
import {NavLink,Link} from 'react-router-dom'
import {Icon} from '@chakra-ui/react'
import {AiOutlineHome,AiOutlineBell,AiOutlineBook,AiOutlineUser} from "react-icons/ai";

export default function Aside({username}){
  return (
    <div className="aside">
    <div className="logo"><Link to="/home" ><Icon className="icon" /></Link></div>
    <div className="nav-contenent">
    <nav>
        <NavLink className="nav-item" activeClassName="selected" to="/home"><Icon className="icon" as={AiOutlineHome} />Home</NavLink>
        <NavLink className="nav-item" activeClassName="selected" to="/notifications"><Icon className="icon" as={AiOutlineBell} />Notification</NavLink>
        <NavLink className="nav-item" activeClassName="selected" to="/bookmarks"><Icon className="icon" as={AiOutlineBook} />Bookmarks</NavLink>
        <NavLink className="nav-item" activeClassName="selected" to={`/${username}`}><Icon className="icon" as={AiOutlineUser} />Profile</NavLink>
    </nav>
    {/* <div className="button">
    /*       <button>Tweet</button>
  /*</div>*/}
    </div>
  </div>)
}
