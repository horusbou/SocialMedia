import React from 'react';
import AddPost from '../compontents/addPost';
import PostItem from '../compontents/postItem';
// eslint-disable-next-line
import { Spinner, Center } from '@chakra-ui/react';

export default function Home(props) {
	// eslint-disable-next-line
	const { userData, postData, isLoading } = props;

	return (
		<div className="home body">
			<div
				className="pageTitle"
				style={{
					borderBottom: 'solid black 1px',
					fontSize: 19,
					fontWeight: 700,
					marginBottom: 5,
					padding: '5px 5px 5px 10px',
				}}
			>
				Home
			</div>
			<AddPost
				fullName={`${userData.firstName} ${userData.lastName}`}
				avatar={`${userData.userAvatar}`}
				addPost={() => {
					props.setIsPosted(true);
				}}
			/>
			{/* {!!postData & !isLoading ? (
				<Center w="100%" h="200px">
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="blue.500"
						size="xl"
					/>
				</Center>
			) : null} */}
			{!!postData
				? postData.map((item, i) => (
						<PostItem
							key={item.post_id + i}
							_id={item.post_id}
							isRetweeted={item.isRetweeted}
							userId={userData.user_id}
							postOwner={item.owner.user_id}
							fullName={`${item.owner.firstName} ${item.owner.lastName}`}
							avatar={`${item.owner.userAvatar}`}
							username={`${item.owner.username}`}
							tweetBody={item.tweetBody}
							likes={item.like}
							retweet={item.retweet}
							userLiked={item.userLikedPost}
						/>
				  ))
				: null}
		</div>
	);
}
