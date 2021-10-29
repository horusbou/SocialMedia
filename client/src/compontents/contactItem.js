import React from 'react'
import {Link} from 'react-router-dom'
import {Avatar,Box} from '@chakra-ui/react'
import './contactItem.css'

export default function ContactItem(props) {

  const {userAvatar,username}=props;
  return (
<Link to={`/${username}`}>
    <Box boxShadow="xs" className="contact-item">
    <Avatar src={userAvatar} />
    <span className="username">{username}</span>
  </Box>
  </Link>
)
}
