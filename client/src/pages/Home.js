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

useEffect(() => {
    document.title='Home'
}, [])


//   useEffect(() => {
//     if(!postData.length){
//         setLoading(true);
//     }
//     Client.getAllPosts()
//       .then((response) => {
//         setPostData(response);
//       }).then(()=>setLoading(false))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPosted]);

useEffect(() => {
    console.log("loading tweets")
    setLoading(true);
    Client.getAllPosts()
      .then((response) => {
        setPostData(response);
      }).then(()=>setLoading(false))
  }, []);

return (
    <div className="home main">
        <PageTitle title="Home"/>
      <AddPost
        addToPost={(post)=>{setPostData([post,...postData])}}

      />
        { loading  && (<LoadingSpinner />)
  }
      {!!postData && !loading
        ? postData.map((item, i) => (
          <PostItem
            key={item.tweet_id }
            tweet_id={item.tweet_id}
            isRetweeted={item.retweet_id}
            user={item.user}
            tweetBody={item.tweet_body}
            likes={item.like_count}
            retweet={item.retweet_count}
            isLiked={item.is_liked}
          />
        ))
        : null}
    </div>
  );
}
