import "./index.css"
import {Avatar} from "@chakra-ui/react"
import {Link} from "react-router-dom"
export function Comment({CommentData}) {

    const {user} = CommentData;
    return (
        <div className="comment">
            <div className="container">
                <div className="leftSide">
                <div className="avatar">
                        <Avatar src={user.userAvatar} name={user.firstname+' '+user.lastname} />
                    </div>
                </div>
                <div className="commentContent">

                <div className="commentHeader">
                    <Link to={`/${user.username}`} className="userData">
                        <span className="name">{user.firstname+' '+user.lastname}</span>
                        <span className="username">@{user.username}</span>
                    </Link>
                </div>
                <div className="commentBody">
                    {CommentData.comment_body.comment}
                </div>
                </div>
            </div>
        </div>
    )
}
/**
 *

 */
