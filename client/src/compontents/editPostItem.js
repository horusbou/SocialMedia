import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	Input,
} from '@chakra-ui/react';
// import PictureGif from './imageBloc';

export default function AlertEditPostItem(props) {
	const cancelRef = useRef();
	const [newTweet, setnewTweet] = useState(props.tweetBody.tweet);
	const handleChange = (evt) => setnewTweet(evt.target.value);
	const handleUpdatePost = (evt) => {
		props.onClose(evt);
		axios.put('/posts/' + props._id, { newTweet });
	};
	return (
		<AlertDialog
			isOpen={props.isOpen}
			onClose={props.onClose}
			leastDestructiveRef={cancelRef}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Edit Post
					</AlertDialogHeader>

					<AlertDialogBody className="conetnt-body">
						<Input value={newTweet} onChange={handleChange} />
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={props.onClose}>
							Cancel
						</Button>
						<Button onClick={handleUpdatePost} colorScheme="green" ml={3}>
							Update
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
