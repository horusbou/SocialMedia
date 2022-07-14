# Routes 
## Tweets
✔️ **/tweets** [GET]  all Tweets + Retweets of user and it's Follower's
✔️ **/tweet** [POST] post a tweet
✔️ **/tweets/profile/:username** [GET] all tweets of a user
✔️ **/tweets/:tweet_id** [GET] a given tweet with its comments/retweets
✔️ **/tweets/:tweet_id/like** [POST] like a given tweet
✔️ **/tweets/:tweet_id/unlike** [DELETE] unlike a given tweet
✔️ **/tweets/:tweet_id/comments** [GET] all comments of a tweet  
✔️ **/tweets/:tweet_id/comments/:comment_id** [GET] a given comment
✔️ **/tweets/:tweet_id/comment** [POST] a comment


## Retweets
✔️ **/retweets/body/:tweet_id** [POST] retweet with body
✔️ **/retweets/:twee_id** [POST] retweet with no body
