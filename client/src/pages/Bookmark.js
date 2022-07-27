import React,{ useEffect, useState} from 'react';
import {PageTitle} from '../compontents'
import Client from '../services/Client';
import { PostItem } from '../compontents';
export default function Bookmark() {

    const [postData, setPostData] = useState([]);
    // eslint-disable-next-line
    const [loadin,setLoading] = useState(false);

    useEffect(() => {
        document.title='Bookmarks'
    }, [])
    useEffect(() => {
        setLoading(true);
        Client.getBookmarks()
        .then((response) => {
            setPostData(response);
          }).then(()=>setLoading(false))
        }, []);
    return <div className='main'>
               <PageTitle title="Bookmarks"/>
               {postData.length>0 && postData.map(item=>
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
                )}
    </div>
}
