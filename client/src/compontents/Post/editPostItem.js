import React, { useRef, useState } from 'react';
import axios from 'axios';
import {colors} from '../../lib'
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

export const AlertEditPostItem = (props)=> {
	const cancelRef = useRef();
	const [newTweet, setnewTweet] = useState(props.tweetBody.tweet);
	const handleChange = (evt) => setnewTweet(evt.target.value);
	const handleUpdatePost = (evt) => {
		props.onClose(evt);
		axios.put('/posts/' + props._id, { newTweet });
	};
	return (
		<AlertDialog colorScheme="blackAlpha"
			isOpen={props.isOpen}
			onClose={props.onClose}
			leastDestructiveRef={cancelRef}
		>
			<AlertDialogOverlay>
				<AlertDialogContent bg={colors.background} color={colors.white}>
					<AlertDialogHeader fontSize="lg" fontWeight="bold" >
						Edit Post
					</AlertDialogHeader>

					<AlertDialogBody className="conetnt-body">
						<Input value={newTweet} onChange={handleChange} />
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={props.onClose} colorScheme="red">
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
