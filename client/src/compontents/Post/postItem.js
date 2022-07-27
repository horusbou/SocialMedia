import React, { useState } from 'react';
import './postItem.css';
import { MenuItem, Avatar } from '@chakra-ui/react';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShareAlt,
//   AiOutlineRetweet,
} from 'react-icons/ai';

import { HoverUser } from '../Hover';
import {FaRegComment} from 'react-icons/fa';
import {PictureGif} from './imageBloc';
import {MoreOption} from './moreOption';
import {AlertEditPostItem} from './editPostItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Client from '../../services/Client';
import { useHistory } from "react-router-dom";
import { RetweetButton } from '../RetweetButton';

export const PostItem = (props) => {
  const [isLiked, setLike] = useState(props.isLiked);
//   const [isRetweeted, setIsRetweeted] = useState(props.isRetweeted);
  const [likeCountes, setLikeCountes] = useState(props.likes);
//   const [retweetCountes, setretweetCountes] = useState(props.retweet);
  const [isEdited, setisEdited] = useState(false);
  const [isMouseOver,setIsMouseOver] = useState(false)

  const handleEnter = () => {
    setIsMouseOver(true)
  }


  const history = useHistory();

//   if(redirect)
//   return <Redirect to={"/tweets/"+props.tweet_id} />

  return (
    <>
      {isEdited && (
        <AlertEditPostItem
          _id={props.tweet_id}
          tweetBody={props.tweetBody}
          isOpen={isEdited}
          onClose={() => setisEdited(false)}
        />
      )}

      <div className="container" onMouseLeave={()=>setIsMouseOver(false)}>
      {props.userRetweeted? <div className="retweet"><Link to={`/${props.userRetweeted.username}`}>{props.userRetweeted.username} retweted</Link></div>:null}
        <div className={`post-item ${isMouseOver?'relative':''}`}>
                {isMouseOver?<HoverUser onMouseLeave={()=>setIsMouseOver(false)} username={props.user.username}/>:null}
            <div className="avatar" >
            <Avatar name={props.user.firstname + ' '+ props.user.lastname} src={props.user.userAvatar} >
            </Avatar>
            </div>
            <div className="post-body">
            <div className="post-content">
                <div className="content-header">
                <Link to={`/${props.user.username}`} className="header-data" onMouseEnter={handleEnter} >
                    <span className="name">{props.user.firstname}</span>
                    <span className="username">@{props.user.username}</span>
                </Link>
                {true? (
                    <MoreOption  Icon="..." children={['Edit', 'Delete']}>
                    <MenuItem  _hover={{color:'black'}} onClick={() => setisEdited(true)}>
                        <p>Edit Post</p>
                    </MenuItem>
                    <MenuItem _hover={{color:'black'}}
                        onClick={() => {
                        axios.delete('/posts/' + props.tweet_id);
                        }}
                    >
                        <p>Delete Post</p>
                    </MenuItem>
                    </MoreOption>
                ) : null}
                </div>
                <div className="content-body" onClick={()=>history.push("/tweets/"+props.tweet_id)}>
                {props.tweetBody.tweet && <h3 style={{ whiteSpace: 'pre-line' }}>
                    {props.tweetBody.tweet}
                </h3>}
                <PictureGif
                    gifSrc={props.tweetBody.gifSrc}
                    filesSrc={props.tweetBody.filesSrc || []}
                />
                </div>
            </div>
            <div className="post-actions">
                <div className="comments icon">
                <FaRegComment className="icon-item" color="#a9b9b9"/>
                <span
                    className={'countes'}
                >
                    {props.comments||''}
                </span>
                </div>
                <div className="retweet-icon icon">
                    <RetweetButton tweet={props} />
                </div>

                <div className="heart icon">
                {isLiked ? (
                    <AiFillHeart
                    className="icon-item liked"
                    color="#f91880"
                    onClick={ () => {
                        setLikeCountes(likeCountes - 1);
                        setLike(!isLiked);
                        Client.unlikePost(props.tweet_id);
                    }}
                    />
                ) : (
                    <AiOutlineHeart
                    className="icon-item"
                    color="#a9b9b9"
                    onClick={() => {
                        setLikeCountes(likeCountes + 1);
                        setLike(!isLiked);
                        Client.likePost(props.tweet_id);
                    }}
                    />
                )}
                <span className={isLiked ? 'countes likecolor' : 'countes'}>
                    {!likeCountes ? '' : likeCountes}
                </span>
                </div>
                <div className="share icon">
                <MoreOption  Icon={<AiOutlineShareAlt className="icon-item" color="#a9b9b9"/>}>
                    <MenuItem>Share It</MenuItem>
                    <MenuItem>Bookmake it</MenuItem>
                </MoreOption>
                </div>
            </div>
            </div>
        </div>
      </div>

    </>
  );
}
