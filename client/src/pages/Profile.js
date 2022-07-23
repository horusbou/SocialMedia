import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Heading, Flex, Box, Text,Button } from '@chakra-ui/react';
import {PostItem,PageTitle,LoadingSpinner} from '../compontents';
import './Profile.css';
import Client from '../services/Client';

export default function Profile(props) {

	const [userData, setUserData] = useState([]);
	const [profilePosts, setProfilePosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { username } = useParams();

	useEffect(() => {
		Client.getUserData(username).then((userData) => {
            console.log('getUserData=>',userData)
			setUserData(userData.data);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	useEffect(() => {
		if (!!username) {
			Client.getProfilePosts(username).then((posts) => {
                console.log('getProfilePosts=>',posts)
                console.log(posts.data.filter(el=>el.source_id!=null))
				setProfilePosts(posts.data);
				setIsLoading(false);
			});
		}
	}, [username]);
    useEffect(() => {
        document.title = `${username}`;
      },[username]);


	return (
		<div className="profile main">
            <PageTitle title="Profile"/>
			<div className="profile-header">
				<div className="profile-header-bg-image"></div>
				<div className="profile-header-content">
					<div className="avatar">
                        {userData.firstName?
                        <Avatar
							name={`${userData.firstname} ${userData.lastname}`}
							size="2xl"
							src={userData.userAvatar}
						/>:<Avatar
                        size="2xl"
                    />}

					</div>
					<div className="userData">
						<div className="userame">
							<span>{userData.username}</span>
						</div>
						<div className="fullname">
							<span>
								{userData.firstname} {userData.lastname}
							</span>
						</div>
						<div className="bio">
							<span>{userData.bio}</span>
						</div>
					</div>
				</div>
				<div className="profile-header-footer">
                    <Button>Contact</Button>
                    <Button onClick={()=>{
                        Client.postFollow(userData.user_id).then(()=>props.FetchFollowers());
                }}>Follow</Button>
                </div>
			</div>
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
                                    console.log('retweeted',item,item.is_retweeted);
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
		</div>
	);
}
