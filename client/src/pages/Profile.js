import React, { useState, useEffect, useContext} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {  Heading, Flex, Box, Text,Button } from '@chakra-ui/react';
import {PostItem,PageTitle,LoadingSpinner,PopUpAvatar, userContext} from '../compontents';
import { AiOutlineLeft} from "react-icons/ai"
import './Profile.css';
import Client from '../services/Client';

export default function Profile(props) {

	const [userData, setUserData] = useState([]);
	const [profilePosts, setProfilePosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
    const [showTweets,setShowTweets]=useState(true);
    const [userLikes ,setUserLike] = useState([]);
	const { username } = useParams();
    const userConnected = useContext(userContext);
    const [shouldRedirectToMessages,setShouldRedirectToMessages] = useState(false)

	useEffect(() => {
        document.title = `${username}`;
		Client.getUserData(username).then((userData) => {
			setUserData(userData.data);
		});
			Client.getProfilePosts(username).then((posts) => {
				setProfilePosts(posts.data);
				setIsLoading(false);
			});

        Client.getUserLikes(username).then(data=>{
            setUserLike(data)
        })
    }, [username]);
    if(shouldRedirectToMessages)
        return <Redirect to={{
            pathname:"/messages",
            state: { user: userData }
        }} />
	return (
		<div className="profile main">
            <PageTitle title={"Posted"} to="/home" icon={AiOutlineLeft} />
			<div className="profile-header">
				<div className="profile-header-bg-image"></div>
				<div className="profile-header-content">
					<div className="avatar">
                        <PopUpAvatar userData={userData} />
                        <div className="avatar-footer">
                            <div className='items'>
                                {userConnected.username === username?<Button _active={{}} _focus={{}}>Edit profile</Button>:
                                <>
                                    <Button onClick={()=>setShouldRedirectToMessages(true)}>Message</Button>
                                    <Button onClick={()=>{Client.postFollow(userData.user_id).then(()=>props.FetchFollowers());}}>Follow</Button>
                                </>
                                }
                             </div>
                        </div>

					</div>
					<div className="userData">
						<div className="header">
                            <div className="fullname">
                                <span>
                                    {userData.firstname} {userData.lastname}
                                </span>
                            </div>
                            <div className="userame">
							    <span>@{userData.username}</span>
						    </div>
						</div>
						<div className="bio">
							<span>{userData.bio||'bio'}</span>
						</div>
                        <div className="counts">
                        <div className="followers">50 <span>Followers</span> </div>
                        <div className="following">7 <span>Following</span> </div>
                        <div className="posts">50 <span>Posts</span> </div>

                        </div>
					</div>
                    <div className="footer">
                        <div className="button" onClick={()=>setShowTweets(true)}>
                            <Button _active={{}} _focus={{}}>Tweets</Button>
                            {showTweets?<span></span>:null}
                        </div>
                        <div className="button" onClick={()=>setShowTweets(false)}>
                        <Button _active={{}} _focus={{}}>Likes</Button>
                        {!showTweets?<span></span>:null}
                        </div>
                    </div>
				</div>
			</div>
            {showTweets?
                    <div className="profile-content">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {!!profilePosts
                                ? profilePosts.map((item, i) => {
                                    if(item.source_id===null){
                                        return <PostItem
                                        key={item.tweet_id}
                                        tweet_id={item.tweet_id}
                                        user={item.user}
                                        tweetBody={item.tweet_body}
                                        likes={item.like_count}
                                        retweet={item.retweet_count}
                                        comments={item.comments_count}
                                        isLiked={item.is_liked}
                                        />
                                    }else{

                                    return (<PostItem
                                        key={item.tweet_id }
                                        tweet_id={item.tweet_id}
                                        userRetweeted={item.user}
                                        user={item.source.timeline.user}
                                        tweetBody={item.source.tweet_body}
                                        likes={item.source.like_count}
                                        retweet={item.source.retweet_count}
                                        isLiked={item.is_liked}
                                        isRetweeted={true}
                                    />)
                                    }

                                })
                                : null
                                }
                            {userData.user_id == null ? (
                                <Flex mt="20px" justify="center" align="center">
                                    <Box className="content">
                                        <Heading>This account doesn't exist</Heading>
                                        <Text className="subHeading" color="gray.500">
                                            Try searching for another.
                                        </Text>
                                    </Box>
                                </Flex>
                            ) : null}
                        </>
                    )}
                </div>
            :
                <div>
                    {userLikes.map((item)=>{
                    if(item.source_id===null){
                        return <PostItem
                        key={item.tweet_id}
                        tweet_id={item.tweet_id}
                        user={item.user}
                        tweetBody={item.tweet_body}
                        likes={item.like_count}
                        retweet={item.retweet_count}
                        comments={item.comments_count}
                        isLiked={item.is_liked}
                        />
                    }else{

                    return (<PostItem
                        key={item.tweet_id }
                        tweet_id={item.tweet_id}
                        userRetweeted={item.user}
                        user={item.source.timeline.user}
                        tweetBody={item.source.tweet_body}
                        likes={item.source.like_count}
                        retweet={item.source.retweet_count}
                        isLiked={item.is_liked}
                        isRetweeted={true}
                    />)
                    }
                    })}
                </div>
            }

		</div>
	);
}
