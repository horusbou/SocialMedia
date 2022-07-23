import React, { useState, useRef, useEffect,useContext } from 'react';
import {colors} from '../../lib'
import {
	Textarea,
	Avatar,
	Button,
	Box,
	Image,
	Grid,
	GridItem,
	CloseButton,
	IconButton,
} from '@chakra-ui/react';
import { AiOutlineGif } from 'react-icons/ai';
import { BsCardImage } from 'react-icons/bs';
import {Gif} from './gif';
import './addPost.css';
import Client from '../../services/Client';
import { userContext } from '../context';
function getExtention(filename) {
	return (
		filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
		filename
	);
}
function tweetButtonTest(length) {
	if (length > 4) return true;
	if (length === 0) return true;
	else return false;
}
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
export const AddPost = (props) => {
	const [tweet, setTweet] = useState('');
	const [isGifOpen, setIsGifOpen] = useState(false);
	const [gifSrc, setGifSrc] = useState('');
	const imageRef = useRef(null);
	const textareaRef = useRef(null);
	const [previewImages, setPreviewImages] = useState([]);
	const [currentFiles, setCurrentFiles] = useState([]);
	const [maxFileWarning, setMaxFileWarning] = useState(false);
    const user = useContext(userContext);

	const handleChange = (evt) => setTweet(evt.target.value);
	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (currentFiles.length) {
			let formData = new FormData();
			formData.append('tweet', tweet);
			formData.append('gifSrc', gifSrc);
			for (let i = 0; i < currentFiles.length; i++)
				formData.append('file', currentFiles[i]);
			Client.postPost(formData).then(res=>{
                props.addToPost(res.data)});
		} else {
			Client.postPost({
				tweet,
				gifSrc,
			}).then(res=>{
            props.addToPost(res.data)});
		}

		setTweet('');
		setGifSrc('');
		setPreviewImages([]);
		setCurrentFiles([]);
	};
	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = '0px';
			const scrollHeight = textareaRef.current.scrollHeight;
			textareaRef.current.style.height = scrollHeight + 'px';
		}
	}, [tweet]);
	return (
		<>
			{maxFileWarning ? (
				<div className={`${maxFileWarning ? 'warningBlock' : 'hide'}`}>
					You are only allowed to upload a maximum of 2 files at a time
				</div>
			) : null}
			<form className="post-item" onSubmit={handleSubmit}>
				<div className="avatar">
					{user ? (
						<Avatar name={user.firstname + ' ' + user.lastname} src={user.userAvatar} />
					) : null}
				</div>
				<div className="post-body">
					<div className="post-content">
						<div className="conetnt-body">
							<Textarea
								ref={textareaRef}
								variant="filled"
								placeholder="What's happening"
                                _placeholder={{color:'#B5B5B5'}}
								style={{
									padding: 5,
									display: 'block',
									resize: 'none',
									overflow: 'hidden',
                                    background:"#1C1C1C",
                                    color:'white',
                                    border:'none',
								}}
								value={tweet}
								onChange={handleChange}
							/>
							{!!gifSrc || !!currentFiles.length > 0 ? (
								<Box className="image-container">
									{!!gifSrc ? (
										<Grid templateColumns="50%">
											<GridItem
												className="image-border image-border-fit-content"
												style={gridStryles(1, 0)}
											>
												<CloseButton
													size="sm"
													className="close-button"
													borderRadius="50%"
													backgroundColor="#25221e"
													color="white"
													_hover={{ opacity: 0.6 }}
													onClick={() => {
														if (!!gifSrc) setGifSrc('');
													}}
												/>
												<Image
													ref={imageRef}
													loading="lazy"
													borderRadius="15px"
													className="image-content"
													src={gifSrc}
													box-size="100px"
												/>
											</GridItem>
										</Grid>
									) : (
										<Grid
											templateRows={`repeat(${
												currentFiles.length > 2 ? 2 : 1
											}, ${currentFiles.length > 2 ? '200px' : '200px'})`}
											templateColumns={`repeat(${
												currentFiles.length === 1 ? 1 : 2
											}, ${currentFiles.length === 1 ? '50%' : '1fr'})`}
											gap={4}
										>
											{[...currentFiles].map((pic, i) => {
												let key = i;
												return (
													<GridItem
														style={gridStryles(currentFiles.length, key)}
														h={currentFiles.length === 4 ? '200px' : '100%'}
														className="image-border image-border-images"
														key={i}
													>
														<CloseButton
															size="sm"
															className="close-button"
															borderRadius="50%"
															backgroundColor="#25221e"
															color="white"
															_hover={{ opacity: 0.6 }}
															onClick={() => {
																if (!!currentFiles.length > 0) {
																	setCurrentFiles((prevState) => [
																		...Array.prototype.slice.call(
																			prevState,
																			0,
																			key
																		),
																		...Array.prototype.slice.call(
																			prevState,
																			key + 1
																		),
																	]);
																	setPreviewImages((prevState) => [
																		...prevState.slice(0, key),
																		...prevState.slice(key + 1),
																	]);
																}
															}}
														/>
														{getExtention(pic.name) === 'jpeg' ||
														getExtention(pic.name) === 'jpg' ||
														getExtention(pic.name) === 'png' ? (
															<Image
																ref={imageRef}
																loading="lazy"
																borderRadius="15px"
																className="image-content"
																box-size="100px"
																src={previewImages[i]}
															/>
														) : (
															<Image
																ref={imageRef}
																loading="lazy"
																borderRadius="15px"
																className="image-content"
																src="https://www.pngitem.com/pimgs/m/119-1190874_warning-icon-png-png-download-icon-transparent-png.png"
																box-size="100px"
															/>
														)}
													</GridItem>
												);
											})}
										</Grid>
									)}
								</Box>
							) : (
								''
							)}
						</div>
					</div>
					<div className="post-options">
						<div className="icons">
							<IconButton
								backgroundColor="transparent"
								colorScheme="transparent"
								isDisabled={!!currentFiles.length || !!gifSrc}
								aria-label="Search for Gif"
								icon={<AiOutlineGif color={colors.pink}/>}
								className="icon-item"
								onClick={() => setIsGifOpen(true)}
							/>
							{isGifOpen ? (
								<Gif
									handleClose={() => setIsGifOpen(false)}
									handleSelectedGif={(url) => {
										setGifSrc(url);
									}}
								/>
							) : (
								''
							)}
							<label className="icon-item" htmlFor="file">
								<BsCardImage color={colors.pink} />
							</label>
							<input
								type="file"
								name="file"
								accept="image/*"
								multiple
								id="file"
								onChange={(evt) => {
									console.log(evt.target.files.length > 4);
									if (evt.target.files.length > 4) {
										evt.preventDefault();
										setMaxFileWarning(true);
										return;
									}
									setMaxFileWarning(false);
									setCurrentFiles(evt.target.files);
									setPreviewImages(
										[...evt.target.files].map((file) =>
											URL.createObjectURL(file)
										)
									);
								}}
							/>
						</div>
						<div className="tweet-action">
							<Button
								type="submit"
								backgroundColor={colors.pink}
								color="white"
                                _hover={{}}
                                _focus={{}}
                                _active={{}}
								isDisabled={
									!tweet && !gifSrc && tweetButtonTest(currentFiles.length)
								}
								className="tweet"
							>
								Tweet
							</Button>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}
