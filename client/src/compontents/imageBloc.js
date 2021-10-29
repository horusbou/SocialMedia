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
			return { gridRowStart: '2', gridRowEnd: '3' };
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
export default function PictureGif(props) {
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
				<Box w="200px" className="image-border">
					<Image
						loading="lazy"
						borderRadius="15px"
						className="image-content"
						src={gifSrc}
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
							<AlertDialogContent>
								<AlertDialogBody>
									<Image src={selectedImage} />
								</AlertDialogBody>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
					<Grid
						h="300px"
						templateRows={`repeat(${filesSrc.length > 2 ? 2 : 1}, ${
							filesSrc.length > 2 ? '50%' : '50%'
						})`}
						templateColumns={`repeat(${filesSrc.length === 1 ? 1 : 2}, ${
							filesSrc.length === 1 ? '50%' : '80%'
						})`}
						gap={4}
					>
						{filesSrc.map((pic, i) => {
							return (
								<GridItem
									w="100%"
									style={gridStryles(filesSrc.length, i)}
									className="image-border  image-border-images"
									key={i}
									onClick={(evt) => {
										//	console.log('hit', evt.target.src);
										setSelectedImage(evt.target.src);
										setIsImageOpen(true);
									}}
								>
									<Image
										style={{ cursor: 'pointer', zIndex: 0 }}
										loading="lazy"
										borderRadius="15px"
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
