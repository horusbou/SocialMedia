import React, { useState } from 'react';
import './postItem.css';
import { MenuItem, Avatar } from '@chakra-ui/react';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineRetweet,
} from 'react-icons/ai';
import {PictureGif} from './imageBloc';
import {MoreOption} from './moreOption';
import {AlertEditPostItem} from './editPostItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Client from '../../services/Client';

export const PostItem = (props) => {
  const [isLiked, setLike] = useState(false || props.userLiked);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCountes, setLikeCountes] = useState(props.likes);
  const [retweetCountes, setretweetCountes] = useState(props.retweet);
  const [isEdited, setisEdited] = useState(false);
  //eslint-disable-next-line
  const [postId, setPostId] = useState(null);
  //eslint-disable-next-line
  async function like(postId) {
    console.log("POST ID", postId)
    await Client.likePost(postId);
  }

  return (
    <>
      {isEdited && (
        <AlertEditPostItem
          _id={props._id}
          tweetBody={props.tweetBody}
          isOpen={isEdited}
          onClose={() => setisEdited(false)}
        />
      )}

      <div className="post-item">
        <div className="avatar">
          <Avatar name={props.fullName} src={props.avatar} />
        </div>
        <div className="post-body">
          <div className="post-content">
            <div className="content-header">
              <Link to={`/${props.username}`} className="header-data">
                <span className="name">{props.fullName}</span>
                <span className="username">@{props.username}</span>
              </Link>
              {props.postOwner === props.userId ? (
                <MoreOption Icon="..." children={['Edit', 'Delete']}>
                  <MenuItem onClick={() => setisEdited(true)}>
                    <p>Edit Post</p>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      axios.delete('/posts/' + props._id);
                    }}
                  >
                    Delete Post
                  </MenuItem>
                </MoreOption>
              ) : null}
            </div>
            <div className="content-body">
              {props.tweetBody.tweet && <h3 style={{ whiteSpace: 'pre-line' }}>
                {props.tweetBody.tweet}
              </h3>}
              <PictureGif
                gifSrc={props.tweetBody.gifSrc}
                filesSrc={props.tweetBody.filesSrc}
              />
            </div>
          </div>
          <div className="post-actions">
            <div className="comments icon">
              <AiOutlineComment className="icon-item" color="#a9b9b9"/>
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
                    // axios.put(`/likes/${props._id}`);
                    Client.likePost(props._id);
                    setPostId(props._id);
                    return setLike(!isLiked);
                  }}
                />
              ) : (
                <AiOutlineHeart
                  className="icon-item"
                  color="#a9b9b9"
                  onClick={() => {
                    console.log(props)
                    setLikeCountes(likeCountes + 1);
                    //  axios.post(`/likes/${props._id}`);
                    // await Client.likePost(props._id);
                    Client.likePost(props._id);
                    setPostId(props._id);
                    return setLike(!isLiked);
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
    </>
  );
}
