import React,{useState} from 'react'
import ContactItem from './contactItem'
import {Center,Heading} from '@chakra-ui/react'
import './contact.css'

export default function Contact(props){
    const [userData, setUserData] = useState({});

  return (<div className="contact-aside">
  <Center p="4" className="header">
    <Heading size="md">Contact</Heading>
  </Center>
    <ContactItem userAvatar={props.userAvatar} username={props.username} />
  </div>)
}
