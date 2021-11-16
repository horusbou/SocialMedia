import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Spinner, Heading, Flex, Box, Text } from '@chakra-ui/react';
import PostItem from '../compontents/postItem';
import './Profile.css';
import Client from '../services/Client';

export default function Profile(props) {
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

	return (
		<div className="profile body">
			<div className="profile-header">
				<div className="profile-header-bg-image"></div>
				<div className="profile-header-content">
					<div className="avatar">
						<Avatar
							name={`${userData.firstName} ${userData.lastName}`}
							size="2xl"
							src={userData.userAvatar}
						/>
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
							<span>{userData.bio || "here i'm"}</span>
						</div>
					</div>
				</div>
				<div className="profile-header-footer"></div>
			</div>
			<div className="profile-content">
				{isLoading ? (
					<div className="spinner">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="md"
						/>
					</div>
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
