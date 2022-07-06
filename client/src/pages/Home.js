import React,{ useEffect, useState} from 'react';
import {
    PostItem,
    AddPost,
    PageTitle,
    LoadingSpinner
} from '../compontents';
import Client from '../services/Client';

export default function Home() {

const [postData, setPostData] = useState([]);
const [isPosted, setIsPosted] = useState(false);
const [loading,setLoading] = useState(false);

//   useEffect(() => {
//     console.log('hit')
//     setLoading(true);
//     Client.getAllPosts()
//       .then((response) => {
//         setPostData(response);
//       }).then(()=>setLoading(false))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
useEffect(() => {
    document.title='Home'
}, [])


  useEffect(() => {
    if(!postData.length){
        setLoading(true);
    }
    Client.getAllPosts()
      .then((response) => {
        setPostData(response);
      }).then(()=>setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPosted]);
  return (
    <div className="home main">
        <PageTitle title="Home"/>
      <AddPost
        addPost={() => {
            setIsPosted(!isPosted);
        }}
      />
        { loading  && (<LoadingSpinner />)
  }
      {!!postData && !loading
        ? postData.map((item, i) => (
          <PostItem
            key={item.post_id + i}
            _id={item.post_id}
            isRetweeted={item.isRetweeted}
            userId={item.user_id}
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
