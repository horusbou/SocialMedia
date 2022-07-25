import React, { useState } from 'react';
import './sourceItem.css';
import { MenuItem, Avatar } from '@chakra-ui/react';
import { HoverUser } from '../Hover';
import {PictureGif} from '../Post/imageBloc';
import {MoreOption} from '../Post/moreOption';
import {AlertEditPostItem} from '../Post/editPostItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

export const SourceItem = (props) => {
  const [isEdited, setisEdited] = useState(false);
  const [isMouseOver,setIsMouseOver] = useState(false)

  const handleEnter = () => {
    setIsMouseOver(true)
  }


  const history = useHistory();


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

      <div className="source-container" onMouseLeave={()=>setIsMouseOver(false)}>
        <div className={`source-item ${isMouseOver?'relative':''}`}>
                {isMouseOver?<HoverUser onMouseLeave={()=>setIsMouseOver(false)} username={props.user.username}/>:null}
            <div className="avatar" >
                <Avatar name={props.user.firstname + ' '+ props.user.lastname} src={props.user.userAvatar} size="xs">
                </Avatar>
            </div>
            <div className="source-body">
            <div className="source-content">
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
                        Delete Post
                    </MenuItem>
                    </MoreOption>
                ) : null}
                </div>
            </div>
            </div>
        </div>
        <div className="source-content-body" onClick={()=>history.push("/tweets/"+props.tweet_id)}>
                {props.tweetBody.tweet && <h3 style={{ whiteSpace: 'pre-line' }}>
                    {props.tweetBody.tweet}
                </h3>}
                <PictureGif
                    gifSrc={props.tweetBody.gifSrc}
                    filesSrc={props.tweetBody.filesSrc || []}
                />
                </div>
      </div>

    </>
  );
}
