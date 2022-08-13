import './message.css'
import {PageTitle, userContext} from "../compontents"
import ContactItem from '../compontents/Followers/contactItem'
import socket from '../compontents/socket'
import { useState } from 'react';
import { Input,Avatar } from '@chakra-ui/react';
import { useEffect } from 'react';
import Client from '../services/Client';
import { useContext } from 'react';


const MessageItem = ({mine=true,user,message})=>{
    return (<div className={mine?'mine message-item':'other message-item'}>
        <div className="message-avatar">
            <Avatar src={user.userAvatar} name={user.firstname+' '+user.lastname}/>
        </div>
        <div className="message-data">{message}</div>

        </div>)
}

export default function MessagesPage(){
    const user = useContext(userContext)
    const [selectedUser,setSelectedUser]=useState(null)
    const [privateMessage,setPrivateMessage]=useState('')
    const [messages,setMessages]=useState([])
    const [users,setUsers]=useState([]);
    const [msgArrivied,setMesArrived]=useState([]);

    const handlePrivateMessage=(e)=>{
        e.preventDefault();
        setMessages(e=>[...e,{
            message_id:'',
            created_at:Date.now(),
            message:privateMessage,
            user
        }])
        if (selectedUser) {
        socket.emit("private message", {
              content: {
                message_id:'',
                created_at:Date.now(),
                message:privateMessage,
                user
            },
              to: selectedUser.user_id,
        });
        Client.sendMessage({reciever_id:selectedUser.user_id,message:privateMessage})
        // setSelectedUser(selectedUser)
        setPrivateMessage('')
    }
}
useEffect(()=>{
    Client.getParticipent().then(res=>setUsers(res.data))
},[])
useEffect(()=>{
    if(selectedUser){
        Client.getMessages({reciever_id:selectedUser.user_id}).then(res=>setMessages(res.data))
        setPrivateMessage('')
    }
    setMessages([])
},[selectedUser])
useEffect(() => {
    socket.on("private message",(res)=>{
        // const data =Object.entries(res);
        // const result=Object.fromEntries(data.filter((el)=>el[0]!=='from' && el[0]!=='to'))
        if(selectedUser.user_id === res.to)
        {
            setMessages(e=>[...e,{
                message_id:'',
                created_at:res.content,
                message:res.content.message,
                user:res.content.user
            }])
        }else{
            setMesArrived(el=>[...el,{
                user_id:res.to,
                seen:false
            }])
        }
    })

  return () => {
    socket.off('private message')
  }
})

    return (<form className="main message" onSubmit={handlePrivateMessage}  style={{width:'76%'}} >
        <div className="messages-content">
            <div className="users">
            <PageTitle title="Messages" />
            <div className='allUsers'>
                <ul className='usersList'>
                    {users.map(el=><li key={el.user_id} onClick={()=>{
                        setSelectedUser(el)
                    }} >
                        <ContactItem
                            userAvatar={el.userAvatar}
                            username={el.username}
                            firstName={el.firstname}
                            lastName={el.lastname}
                            />
                    </li> )}
                </ul>
            </div>
            </div>
            {/* {console.log(messages)}s */}
                {
                !selectedUser?
                    <div className="message-body">
                    <div className="message-container">
                        <h3>Select a message</h3>
                        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                </div>
                :
                <div className='message-user'>
                    <div className="message-content">
                        {selectedUser.username}
                        <ul>
                            {messages.map((el,i)=>{
                                return <MessageItem key={i} mine={el.user.user_id===user.user_id} message={el.message} user={el.user} />
                            })}
                        </ul>
                    </div>
                    <div className="message-input">
                        <Input _focus={{}} placeholder="Your message..." value={privateMessage} onChange={(e)=>setPrivateMessage(e.target.value)}/>
                    </div>
                </div>
                }

        </div>
    </form>)
}
