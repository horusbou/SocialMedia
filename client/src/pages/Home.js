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
const [loading,setLoading] = useState(false);


useEffect(() => {
    document.title='Home'
}, [])


useEffect(() => {
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
                return (
                <PostItem
                key={item.tweet_id}
                tweet_id={item.tweet_id}
                user={item.user}
                tweetBody={item.tweet_body}
                likes={item.like_count}
                retweet={item.retweet_count}
                comments={item.comments_count}
                isLiked={item.is_liked}
                />

            )}else{
                console.log(item)
                return (<PostItem
                    key={item.tweet_id }
                    tweet_id={item.tweet_id}
                    userRetweeted={item.user}
                    user={item.source.timeline.user}
                    tweetBody={item.source.tweet_body}
                    likes={item.source.like_count + item.like_count}
                    retweet={item.source.retweet_count+item.retweet_count}
                    isLiked={item.is_liked}
                    isRetweeted={item.is_retweeted}
                />)
            }

            })
        : null}
    </div>
  );
}
