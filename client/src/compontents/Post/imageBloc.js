import React, { useState, useRef } from 'react';
import {
	Box,
	Image,
	Grid,
	GridItem,
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogOverlay,
} from '@chakra-ui/react';

function gridStryles(length, index) {
	if (length === 4) {
		if (index === 0) {
			return {
				gridRowStart: '1',
				gridRowEnd: '2',
			};
		} else if (index === 2) {
			return { gridRowStart: '2', gridRowEnd: '3'};
		} else if (index === 3) {
			return { gridRowStart: '2', gridRowEnd: '3' };
		} else {
			return {
				gridRowStart: '1',
				gridRowEnd: '2',
			};
		}
	} else if (length === 3) {
		if (index === 0) {
			return {
				gridRowStart: '1',
				gridRowEnd: '3',
			};
		} else if (index === 1) {
			return {
				gridRowStart: '1',
				gridRowEnd: '2',
			};
		}
	} else {
		return {
			gridRowStart: '1',
			gridRowEnd: '2',
		};
	}
}
export const PictureGif = (props)=> {
	const [isImageOpen, setIsImageOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');
	const onClose = () => {
		setIsImageOpen(false);
		setSelectedImage('');
	};
	const cancelRef = useRef();

	let gifSrc = props.gifSrc;
	let filesSrc = props.filesSrc;
	return !!gifSrc || !!filesSrc.length > 0 ? (
		<Box className="image-container">
			{!!gifSrc ? (
				<Box w="100%" className="image-border" >
					<Image
						loading="lazy"
						borderRadius="15px"
						className="image-content"
                        border={"solid 1px rgba(255, 255, 255, 0.3)"}
						src={gifSrc}
                        width="100%"
						box-size="100px"
					/>
				</Box>
			) : (
				<>
					<AlertDialog
						isOpen={isImageOpen}
						leastDestructiveRef={cancelRef}
						onClose={onClose}
					>
						<AlertDialogOverlay>
							<AlertDialogContent margin={"auto"} borderRadius="20px">
								<AlertDialogBody padding="0" margin="0">
									<Image src={selectedImage} borderRadius="15px" />
								</AlertDialogBody>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
					<Grid
						h="100%"
						// templateRows={`repeat(${filesSrc.length > 2 ? 2 : 1}, ${
						// 	filesSrc.length > 2 ? '50%' : '100%' // change it from 50 to 100
						// })`}
						// templateColumns={`repeat(${filesSrc.length === 1 ? 1 : 2}, ${
						// 	filesSrc.length === 1 ? '100%' : '49%'
						// })`}
						gap={2}
					>
						{filesSrc.map((pic, i) => {
							return (
								<GridItem
									w="100%"
                                    h="100%"
									style={{width:'100%',...gridStryles(filesSrc.length, i)}}
									className="image-border  image-border-images"
                                    key={i}
									onClick={(evt) => {
											// console.log('hit', evt.target.src);
										setSelectedImage(evt.target.src);
										setIsImageOpen(true);
									}}
								>
									<Image
										style={{ cursor: 'pointer', zIndex: 0 }}
										loading="lazy"
										borderRadius="15px"
                                        border={"solid 1px rgba(255, 255, 255, 0.3)"}
										className="image-content"
										src={'/' + pic}
										box-size="100px"
									/>
								</GridItem>
							);
						})}
					</Grid>
				</>
			)}
		</Box>
	) : (
		''
	);
}
