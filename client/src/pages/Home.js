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
        { loading  && (<LoadingSpinner />)}
      {!!postData && !loading
        ? postData.map((item, i) => {
            if(item.source_id===null)
                {
                return (<PostItem
                key={item.tweet_id }
                tweet_id={item.tweet_id}
                user={item.user}
                tweetBody={item.tweet_body}
                likes={item.like_count}
                retweet={item.retweet_count}
                isLiked={item.is_liked}
            />)}else{
                return (<PostItem
                    key={item.tweet_id }
                    tweet_id={item.tweet_id}
                    userRetweeted={item.user}
                    user={item.source.timeline.user}
                    tweetBody={item.source.tweet_body}
                    likes={item.source.like_count}
                    retweet={item.source.retweet_count}
                    isLiked={item.is_liked}
                    isRetweeted={item.source.timeline.user.user_id === item.user.user_id}
                />)
            }

            })
        : null}
    </div>
  );
}
