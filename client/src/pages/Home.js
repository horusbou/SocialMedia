import React from 'react';
import AddPost from '../compontents/addPost';
import PostItem from '../compontents/postItem';
import { useEffect, useState } from 'react';
import Client from '../services/Client';


export default function Home(props) {
  // eslint-disable-next-line
//   const { userData, postData, isLoading } = props;

const [postData, setPostData] = useState([]);
const [userData, setUserData] = useState({});
const [isPosted, setIsPosted] = useState(false);

useEffect(() => {
    Client.getUser().then((userData) => {
      if (userData){
          setUserData(userData);
        props.getUserName(userData?.username)
    }
      else setUserData({});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Client.getAllPosts()
      .then((response) => {
        setPostData(response);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPosted]);
  return (
    <div className="home body">
      <div
        className="pageTitle"
        style={{
          borderBottom: 'solid black 1px',
          fontSize: 19,
          fontWeight: 700,
          marginBottom: 5,
          padding: '5px 5px 5px 10px',
        }}
      >
        Home
      </div>
      <AddPost
        fullName={`${userData.firstName} ${userData.lastName}`}
        avatar={`${userData.userAvatar}`}
        addPost={() => {
            setIsPosted(!false);
        }}
      />
      {!!postData
        ? postData.map((item, i) => (
          <PostItem
            key={item.post_id + i}
            _id={item.post_id}
            isRetweeted={item.isRetweeted}
            userId={userData.user_id}
            postOwner={item.owner.user_id}
            fullName={`${item.owner.firstName} ${item.owner.lastName}`}
            avatar={`${item.owner.userAvatar}`}
            username={`${item.owner.username}`}
            tweetBody={item.tweetBody}
            likes={item.like}
            retweet={item.retweet}
            userLiked={item.userLikedPost}
          />
        ))
        : null}
    </div>
  );
}
