import React, { useState } from "react"
import { MenuItem, Avatar } from '@chakra-ui/react';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlineRetweet,
} from 'react-icons/ai';
import { HoverUser } from '../Hover';
import { FaRegComment } from 'react-icons/fa';
// import {PictureGif} from '../Post/imageBloc';
import { MoreOption } from '../Post/moreOption';
// import {AlertEditPostItem} from '../Post/editPostItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Client from '../../services/Client';
import { useHistory } from "react-router-dom";
import { SourceItem } from "../Retweet/sourceItem";


export function RetweetItem(props) {
  const { user, tweetBody, source } = props
  const [isLiked, setLike] = useState(props.isLiked);
  const [isRetweeted, setIsRetweeted] = useState(props.isRetweeted);
  const [likeCountes, setLikeCountes] = useState(props.likes);
  const [retweetCountes, setretweetCountes] = useState(props.retweet);
  const [isEdited, setisEdited] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false)
  const history = useHistory();
  return (<div className="container">
    <div className={`post-item ${isMouseOver ? 'relative' : ''}`}>
      {isMouseOver ? <HoverUser onMouseLeave={() => setIsMouseOver(false)} username={''} /> : null}
      <div className="avatar" >
        <Avatar name={user.firstname + " " + user.lastname} src={user.userAvatar} >
        </Avatar>
      </div>
      <div className="post-body">
        <div className="post-content">
          <div className="content-header">
            <Link to={`/${''}`} className="header-data" >
              <span className="name">{user.firstname + " " + user.lastname}</span>
              <span className="username">@{user.username}</span>
            </Link>
            {true ? (
              <MoreOption Icon="..." children={['Edit', 'Delete']}>
                <MenuItem _hover={{ color: 'black' }} onClick={() => setisEdited(true)}>
                  <p>Edit Post</p>
                </MenuItem>
                <MenuItem _hover={{ color: 'black' }}
                  onClick={() => {
                    axios.delete('/posts/' + props.tweet_id);
                  }}
                >
                  Delete Post
                </MenuItem>
              </MoreOption>
            ) : null}
          </div>
          <div className="content-body" onClick={() => history.push("/tweets/" + props.tweet_id)}>
            <p>{tweetBody.tweet}</p>
            <SourceItem
              tweetBody={source.tweet_body}
              user={source.user}
            />
          </div>
        </div>
        <div className="post-actions">
          <div className="comments icon">
            <FaRegComment className="icon-item" color="#a9b9b9" />
            <span
              className={'countes'}
            >
              {props.comments || ''}
            </span>
          </div>
          <div className="retweet icon">
            {isRetweeted ? (
              <AiOutlineRetweet
                className="icon-item"
                color="green"
                onClick={() => {
                  setretweetCountes(retweetCountes - 1);
                  return setIsRetweeted(!isRetweeted);
                }}
              />
            ) : (
              <AiOutlineRetweet
                className="icon-item"
                color="#a9b9b9"
                onClick={() => {
                  Client.postRetweet(props.tweet_id, { tweet_body: {} })
                  setretweetCountes(retweetCountes + 1);
                  return setIsRetweeted(!isRetweeted);
                }}
              />
            )}
            <span
              className={isRetweeted ? 'countes retweetcolor' : 'countes'}
            >
              {!retweetCountes ? '' : retweetCountes}
            </span>
          </div>
          <div className="heart icon">
            {isLiked ? (
              <AiFillHeart
                className="icon-item liked"
                color="#f91880"
                onClick={() => {
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
            <MoreOption Icon={<AiOutlineShareAlt className="icon-item" color="#a9b9b9" />}>
              <MenuItem>Share It</MenuItem>
              <MenuItem>Bookmake it</MenuItem>
            </MoreOption>
          </div>
        </div>
      </div>
    </div>
  </div>)
}
