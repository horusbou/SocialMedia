import React,{useState,useEffect} from 'react'
import { Header } from '../other'
import ContactItem from './contactItem'
import {colors} from '../../lib'
import './contact.css'
import Client from '../../services/Client';
import {SearchBar} from "../Search"
import { useHistory } from 'react-router-dom'

export const Followers= (props)=>{
    const history = useHistory()
    const [followings,setFollowings] = useState([]);
    useEffect(()=>{
        Client.getFollowings().then(following=>{
            setFollowings(following.data.following);
        })
    },[props.FetchFollowers])
if(history.location.pathname==='/messages')
    return null
  return (<div className="contact-aside">
    <SearchBar />
    <Header />
  <div className="header">
    <h1 color={colors.white}>Followers</h1>
  </div>

  { followings.length>0 && followings.map((el,i)=>{
    return <ContactItem key={i}
    userAvatar={el?.avatar}
    username={el?.username}
    firstName={el?.firstName}
    lastName={el?.lastName} />
  })}


  </div>)
}
