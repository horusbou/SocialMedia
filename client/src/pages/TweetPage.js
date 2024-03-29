import { PageTitle } from "../compontents"
import { AiOutlineLeft, AiOutlineRetweet, AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { BiShare } from "react-icons/bi";
import { Avatar, MenuItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MoreOption } from "../compontents/Post/moreOption";
import { PictureGif } from "../compontents/Post/imageBloc";
import { Comment, AddComment, RetweetButton } from "../compontents";
import './tweetPage.css'
import { useEffect, useState } from "react";
import Client from "../services/Client";
import { LoadingSpinner } from "../compontents";
import { useHistory } from "react-router-dom";

export default function TweetPage() {
  const { location } = useHistory();
  const tweet_id = location.pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [PostData, setPostData] = useState({});
  const [comments, setComments] = useState([]);
  const [likeCountes, setLikeCountes] = useState(0)
  const [retweetCountes, setRetweetCountes] = useState(0)
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    Client.getTweet(tweet_id)
      .then(res => {
        console.log(res.data)
        setPostData(res.data);
        setComments(res.data.comments);
        setLikeCountes(res.data.like_count)
        setRetweetCountes(res.data.retweet_count)
        setIsLiked(res.data.is_liked);
        setLoading(false);
      })
  }, [tweet_id]);

  if (loading)
    return <LoadingSpinner />


  return (<div className="tweetPage main">
    <PageTitle title={"Posted"} to="/home" icon={AiOutlineLeft} />
    <div className="container">
      <div className="post-item">
        <div className="avatar">
          <Avatar name={PostData.user.firstname + ' ' + PostData.user.lastname} src={PostData.user.userAvatar} />
        </div>
        <div className="post-body">
          <div className="post-content">
            <div className="content-header">
              <Link to={`/${PostData.user.username}`} className="header-data">
                <span className="name">{PostData.user.firstname}</span>
                <span className="username">@{PostData.user.username}</span>
              </Link>
              {true ? (
                <MoreOption Icon="..." children={['Edit', 'Delete']}>
                  <MenuItem _hover={{ color: 'black' }}>
                    <p>Edit Post</p>
                  </MenuItem>
                  <MenuItem _hover={{ color: 'black' }}>
                    Delete Post
                  </MenuItem>
                </MoreOption>
              ) : null}
            </div>
            <div className="content-body">
              {PostData.tweet_body.tweet && <h3 style={{ whiteSpace: 'pre-line' }}>
                {PostData.tweet_body.tweet}
              </h3>}
              <PictureGif
                gifSrc={PostData.tweet_body.gifSrc}
                filesSrc={PostData.tweet_body.filesSrc || []}
              />
            </div>
            <div className="content-footer">
              <div className="created_at"><p>{new Date(PostData.created_at).toISOString().slice(0, 16).replace('T', ' ')}</p></div>
              <div className="countes">
                <div className="likes"><p>{likeCountes || 0} Like</p></div>
                <div className="repost"><p>{retweetCountes || 0} Repost</p></div>
              </div>
            </div>
          </div>
          <div className="post-actions">
            <div className="comments icon">
              <FaRegComment className="icon-item" color="#a9b9b9" />
            </div>
            <div className="retweet icon">
              <RetweetButton count={PostData.retweetCountes} userRetweeted={PostData.is_retweeted} tweet={PostData} />
              {/* isRetweeted 
              {PostData.is_retweeted ? (
                <AiOutlineRetweet
                  className="icon-item"
                  color="green" />
              ) : (
                <BiShare
                  className="icon-item"
                  color="#a9b9b9"
                />
              )}
              <span
                className={{ isRetweeted: false } ? 'countes retweetcolor' : 'countes'}
              >
                {!retweetCountes ? '' : retweetCountes}
              </span> */}
            </div>
            <div className="heart icon">
              {/* isLiked */}
              {isLiked ? (
                <AiFillHeart
                  className="icon-item liked"
                  color="#f91880"
                  onClick={() => {
                    setLikeCountes(likeCountes - 1);
                    setIsLiked(!isLiked);
                    Client.unlikePost(tweet_id);
                  }}

                />
              ) : (
                <AiOutlineHeart
                  className="icon-item"
                  color="#a9b9b9"
                  onClick={() => {
                    setLikeCountes(likeCountes + 1);
                    setIsLiked(!isLiked);
                    Client.likePost(tweet_id);
                  }}

                />
              )}
              <span className={isLiked ? 'countes likecolor' : 'countes'}>
                {!likeCountes ? '' : likeCountes}
              </span>
            </div>
            <div className="share icon">
              <MoreOption Icon={<AiOutlineShareAlt className="icon-item" color="#a9b9b9" />}>
                <MenuItem>Share It</MenuItem>
                <MenuItem>Bookmake it</MenuItem>
              </MoreOption>
            </div>
          </div>
        </div>
      </div>
      {/*comment Section*/}
      <div className="comments">
        {comments && comments.map((el, i) => <Comment CommentData={el} key={el.comment_id || i} />)}
        <AddComment tweet_id={tweet_id} showComment={(commentData) => setComments([...comments, commentData])} />
      </div>
    </div>
  </div>)
}
