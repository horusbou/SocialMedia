import React,{useState,useEffect} from 'react'
import { Header } from '../other'
import ContactItem from './contactItem'
import {colors} from '../../lib'
import './contact.css'
import Client from '../../services/Client';


export const Followers= (props)=>{
    const [followings,setFollowings] = useState([]);
    useEffect(()=>{
        Client.getFollowings().then(following=>{
            setFollowings(following.data.following);
        })
    },[props.FetchFollowers])

  return (<div className="contact-aside">
    <Header />
  <div className="header">
    <h1 color={colors.white}>Followers</h1>
  </div>

  {followings.length && followings.map((el,i)=>{
    return <ContactItem key={i}
    userAvatar={el?.avatar}
    username={el?.username}
    firstName={el?.firstName}
    lastName={el?.lastName} />
  })}

  </div>)
}
