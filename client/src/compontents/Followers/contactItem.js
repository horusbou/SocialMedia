import React from 'react'
import {Link} from 'react-router-dom'
import {Avatar,Box} from '@chakra-ui/react'
import './contactItem.css'
import { useHistory } from 'react-router-dom'
export default function ContactItem(props) {
    const history = useHistory()
  const {userAvatar,username,firstName,lastName}=props;
  return (
        <div className="contact-item" >
        <Link to={`/${username}`} >
            <Box className="item-body">
                <div className="userDataContainer">
                    <Avatar className="avatar" src={userAvatar} name={firstName+' '+ lastName} />
                    <div className="userData">
                        <span className="username">
                            {firstName+' '+ lastName}
                        </span>
                        <span className="online">active</span>
                    </div>
                </div>
                <div className="departement">
                    <span>Info</span>
                </div>
        </Box>

        </Link>
        </div>
)
}
