import './message.css'
import {PageTitle, userContext,LoadingSpinner} from "../compontents"
import ContactItem from '../compontents/Followers/contactItem'
import socket from '../compontents/socket'
import { useState } from 'react';
import { Input,Avatar } from '@chakra-ui/react';
import { useEffect } from 'react';
import Client from '../services/Client';
import { useContext,createRef } from 'react';
import {uniqueId} from 'lodash'

const MessageItem = ({mine=true,user,message})=>{
    return (<div className={mine?'mine message-item':'other message-item'}>
        <div className={mine?'mine message-body':'other message-body'}>
            {!mine?<div className="message-avatar">
                <Avatar size='md' src={user.userAvatar} name={user.firstname+' '+user.lastname} />
            </div>:null}
            <div className="message-data"><p>{message}</p></div>
        </div>

        </div>)
}

export default function MessagesPage(props){
    const {userData:user} = useContext(userContext)
    const [selectedUser,setSelectedUser]=useState(null)
    const [privateMessage,setPrivateMessage]=useState('')
    const [messages,setMessages]=useState([])
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(false)
    const [msgArrivied,setMesArrived]=useState([]);
    const messageRef = createRef()

const handlePrivateMessage=(e)=>{
        e.preventDefault();
        setMessages(e=>[...e,{
            message_id:uniqueId((Math.random().toString(36)+'00000000000000000').slice(2, 7)),
            created_at:Date.now(),
            message:privateMessage,
            user
        }])
        if (selectedUser) {
            socket.emit("private message", {
                content: {
                    message_id:uniqueId((Math.random().toString(36)+'00000000000000000').slice(2, 7)),
                    created_at:Date.now(),
                    message:privateMessage,
                    user
                },
                to: selectedUser.user_id,
            });
        Client.sendMessage({reciever_id:selectedUser.user_id,message:privateMessage})
        setPrivateMessage('')
    }
}
useEffect(()=>{
    document.title='Messages';
    setLoading(true)
    Client.getParticipent().then(res=>{
        setUsers(res.data);
        setLoading(false)
        return res.data
    }).then((users)=>{
        if(users.length>0 && props.location.state){
            console.log(users.filter(el=>el.user_id===props.location.state.user.user_id).length===0)
            if(users.filter(el=>el.user_id===props.location.state.user.user_id).length===0){
                setUsers(u=>[...u,props.location.state.user])
                setSelectedUser(props.location.state.user)
            }else{
                setSelectedUser(props.location.state.user)
            }
        }
    })
    console.log('getParticipent')
},[])
useEffect(()=>{
    if(selectedUser){
        Client.getMessages({reciever_id:selectedUser.user_id}).then(res=>{
            setMessages(res.data);
            setLoading(false)
        })
        setPrivateMessage('')
        setMessages([])
        document.title=selectedUser.username+ ' | Messages';
        console.log('getMessages',selectedUser)
        //socket
        socket.on("private message",(res)=>{
            if(selectedUser?.user_id === res.from)
            {
                setMessages(e=>[...e,{
                    message_id:res.content.message_id,
                    created_at:res.content.created_at,
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
    }
},[selectedUser])
useEffect(()=>{
    messageRef.current&&!privateMessage && (messageRef.current.scrollTop=messageRef.current.scrollHeight+180)
},[messageRef,privateMessage])


    return (<form className="main message" onSubmit={handlePrivateMessage}  style={{width:'76%'}} >
        <div className="messages-content" >
            <div className="users">
                <PageTitle title="Messages" />
                <div className={`allUsers ${!users.length?'loadingUsers':''}`}>
                    {
                        loading?<LoadingSpinner />:
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
                    }
                </div>
            </div>
                {
                !selectedUser?
                    <div className="message-body">
                    <div className="message-container">
                        <h3>Select a message</h3>
                        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                </div>
                :
                        <div className='message-user' ref={messageRef}>
                    <div className="message-content">
                        <div className="user-content">
                            <div className="user-avatar">
                                <Avatar src={selectedUser.userAvatar} name={selectedUser.firstname+' '+selectedUser.lastname}/>
                            </div>
                            <div className="user-details">
                                <p>{selectedUser.firstname} {selectedUser.lastname}</p>
                                <span>@{selectedUser.username}</span>
                            </div>
                        </div>
                        {
                            loading?<div className='loadingMessages'><LoadingSpinner/></div>:
                            <ul className="messageslist ">
                                {messages.map((el,i)=>{
                                    return <li key={el.message_id}><MessageItem  mine={el.user.user_id===user.user_id} message={el.message} user={el.user} /></li>
                                })}
                            </ul>
                        }
                    </div>
                    <div className="message-input">
                        <Input _focus={{}} placeholder="Your message..." value={privateMessage} onChange={(e)=>setPrivateMessage(e.target.value)}/>
                    </div>
                </div>
                }

        </div>
    </form>)
}
