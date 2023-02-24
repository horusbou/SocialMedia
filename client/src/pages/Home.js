import React, { useEffect, useState } from 'react';
import {
  RetweetNoBody,
  PostItem,
  AddPost,
  PageTitle,
  LoadingSpinner
} from '../compontents';
import Client from '../services/Client';
import { RetweetItem } from '../compontents/Retweet';

export default function Home() {

  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    document.title = 'Home'
    setLoading(true);
    Client.getAllPosts()
      .then((response) => {
        setPostData(response);
        console.log('posts', response)
      }).then(() => setLoading(false))
      .catch(() => setLoading(true))
  }, []);

  return (
    <div className="home main">
      <PageTitle title="Home" />
      <AddPost
        addToPost={(post) => { setPostData([post, ...postData]) }}
      />
      {loading && (<LoadingSpinner />)}
      {/* {!!postData && !loading ?<RetweetItem user={postData[0].user} tweetBody={postData[0].tweet_body} />:null} */}
      {!!postData && !loading
        ? postData.map((item, i) => {
          if (item.source_id === null) {
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
                isRetweeted={item.is_retweeted}
              />

            )
          } else if (item.source_id !== null && Object.keys(item.tweet_body).length > 0) {
            console.log('item with retweet', item)
            return <RetweetItem key={item.tweet_id + i} user={item.user} tweetBody={item.tweet_body} source={item.source} />
          }
          else {
            return <RetweetNoBody
              key={item.tweet_id}
              tweet_id={item.tweet_id}
              userRetweeted={item.user}
              user={item.source.user}
              tweetBody={item.source.tweet_body}
              likes={item.like_count}
              retweet={item.source.retweet_count + item.retweet_count}
              isLiked={item.is_liked}
              isRetweeted={item.is_retweeted}
            />
            // return (<PostItem
            // key={item.tweet_id}
            // tweet_id={item.source.tweet_id}
            // userRetweeted={item.user}
            // user={item.source.timeline.user}
            // tweetBody={item.source.tweet_body}
            // likes={item.source.like_count + item.like_count}
            // retweet={item.source.retweet_count + item.retweet_count}
            // isLiked={item.is_liked}
            // isRetweeted={item.is_retweeted}
            // />)
          }

        })
        : null}
    </div>
  );
}
