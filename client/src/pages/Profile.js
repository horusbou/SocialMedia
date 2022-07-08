import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Heading, Flex, Box, Text,Button } from '@chakra-ui/react';
import {PostItem,PageTitle,LoadingSpinner} from '../compontents';
import './Profile.css';
import Client from '../services/Client';

export default function Profile() {

	const [userData, setUserData] = useState([]);
	const [profilePosts, setProfilePosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { username } = useParams();

	useEffect(() => {
		Client.getUserData(username).then((userData) => {
			setUserData(userData.data);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	useEffect(() => {
		if (!!username) {
			Client.getProfilePosts(username).then((posts) => {
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
							name={`${userData.firstName} ${userData.lastName}`}
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
								{userData.firstName} {userData.lastName}
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
                        // console.log(userData.user_id)
                    Client.postFollow(userData.user_id);
                }}>Follow</Button>
                </div>
			</div>
			<div className="profile-content">
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						{!!profilePosts
							? profilePosts.map((item, i) => (
									<PostItem
										key={item._id || i}
										_id={item._id}
										userId={userData.user_id}
										postOwner={userData.user_id}
										fullName={`${userData.firstName} ${userData.lastName}`}
										avatar={`${userData.userAvatar}`}
										username={`${userData.username}`}
										tweetBody={item.tweetBody}
										likes={item.like}
										retweet={item.retweet}
									/>
							  ))
							: null}
						{userData.user_id == null ? (
							<Flex mt="20px" justify="center" align="center">
								<Box className="content">
									<Heading>This account doesn’t exist</Heading>
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
