import {Avatar,Textarea,InputGroup,InputRightElement,Icon,Button} from "@chakra-ui/react"
import { userContext } from '../context'
import { useContext ,useState,useRef} from "react";
import { FiSend } from "react-icons/fi";
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import "./index.css"
import Client from "../../services/Client";

export function AddComment({tweet_id,showComment}) {
    const ref = useRef(null);

    const handleSubmit=(evt)=>{
        setLoading(true);
        const CommentData ={user,comment_body:{comment}};
       Client.postComment(tweet_id,{comment}).then(()=>{
        setLoading(false)
        setComment('');
        ref.current.value='';
    })
    showComment(CommentData)
    }
    const handleCommentChange =(evt)=>{
        const {value} = evt.target;
        setComment(value);
    }
    const {userData:user} = useContext(userContext);
    const [loading,setLoading] = useState(false);
    const [comment,setComment] = useState('');
    console.log('user addComent',user)
    return (
        <div className="comment">
            <div className="container">
                <div className="leftSide">
                <div className="avatar">
                        {Object.keys(user).length?<Avatar src={user.userAvatar} name={`${user.firstname} ${user.lastname}`} />:null}
                    </div>
                </div>
                <div className="commentContent">
                <div className="commentHeader">
                        <span className="name">{user.firstname +" "+user.lastname}</span>
                        <span className="username">@{user.username}</span>
                </div>
                <div className="commentBody">
                    <InputGroup>
                        <Textarea ref={ref} onChange={handleCommentChange} h="10px" variant='outline' _focus={{borderColor:"none"}} style={{borderColor:"#565656"}} placeholder='Add Comment' />
                        <InputRightElement style={{display:"flex",height:"100%",alignItems:'center',justifyContent:"center"}}
                        children={(loading?
                        <Icon className="loading-icon" as={AiOutlineLoading3Quarters} />:
                        <Button isDisabled={!comment.length} onClick={handleSubmit} style={{border:'none',}} _hover={{}} _focus={{}} _active={{}} variant='outline'><Icon as={FiSend} /></Button>
                        )} />
                    </InputGroup>
                </div>
                </div>
            </div>
        </div>
    )
}
/**
 *

 */
