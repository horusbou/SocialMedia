import {useRef,useState,useEffect,useContext} from "react"
import { useDisclosure } from '@chakra-ui/react'
import { colors } from "../../lib"
import {Gif} from './gif';
import {
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    Button,
    Textarea,
	Avatar,
	Box,
	Image,
	Grid,
	GridItem,
	CloseButton,
	IconButton,
  } from '@chakra-ui/react'
import { AiOutlineGif } from 'react-icons/ai';
import { BsCardImage } from 'react-icons/bs';
import { userContext } from "../context"
import Client from '../../services/Client'


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


export function PostDialog(){
    const [tweet, setTweet] = useState('');
	const [isGifOpen, setIsGifOpen] = useState(false);
	const [gifSrc, setGifSrc] = useState('');
	const picRef = useRef(null);
	const textareaRef = useRef(null);
	const [previewPics, setPreviewPics] = useState([]);
	const [currentPics, setCurrentPics] = useState([]);
	const [maxFileWarning, setMaxFileWarning] = useState(false);
    const user = useContext(userContext);

	const handleChange = (evt) => setTweet(evt.target.value);
	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (currentPics.length) {
			let formData = new FormData();
			formData.append('tweet', tweet);
			formData.append('gifSrc', gifSrc);
			for (let i = 0; i < currentPics.length; i++)
				formData.append('file', currentPics[i]);
			Client.postPost(formData)
		} else {
			Client.postPost({
				tweet,
				gifSrc,
			})
		}

		setTweet('');
		setGifSrc('');
		setPreviewPics([]);
		setCurrentPics([]);
	};
	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = '0px';
			const scrollHeight = textareaRef.current.scrollHeight;
			textareaRef.current.style.height = scrollHeight + 'px';
		}
	}, [tweet]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    return (
        <>
          <Button backgroundColor={colors.pink}
            _hover={{backgroundColor:colors.pink}}
            height='38px'
            width='110px'
            _active={{}}
            _focus={{}}
            onClick={onOpen}>
            Post
          </Button>

          <Modal
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={()=>{onClose();setMaxFileWarning(false)}}
            size="lg"
          >
            <ModalOverlay />
            {maxFileWarning ? (
				<div className={`${maxFileWarning ? 'warningBlock' : 'hide'}`}>
					You are only allowed to upload a maximum of 4 files at a time
				</div>
			) : null}
              <ModalContent backgroundColor={colors.background}>

                <ModalBody padding={"20px 0 0"}>
                <>
			<form className="post-item" style={{borderBottom:'none'}} onSubmit={handleSubmit}>
				<div className="avatar">
                    {Object.keys(user).length>0?<Avatar name={user.firstname + ' '+ user.lastname} src={user.userAvatar} />:<Avatar bg={colors.background}/>}
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
							{!!gifSrc || !!currentPics.length > 0 ? (
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
													ref={picRef}
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
												currentPics.length > 2 ? 2 : 1
											}, ${currentPics.length > 2 ? '200px' : '200px'})`}
											templateColumns={`repeat(${
												currentPics.length === 1 ? 1 : 2
											}, ${currentPics.length === 1 ? '50%' : '1fr'})`}
											gap={4}
										>
											{[...currentPics].map((pic, i) => {
												let key = i;
												return (
													<GridItem
														style={gridStryles(currentPics.length, key)}
														h={currentPics.length === 4 ? '200px' : '100%'}
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
																if (!!currentPics.length > 0) {
																	setCurrentPics((prevState) => [
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
																	setPreviewPics((prevState) => [
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
																ref={picRef}
																loading="lazy"
																borderRadius="15px"
																className="image-content"
																box-size="100px"
																src={previewPics[i]}
															/>
														) : (
															<Image
																ref={picRef}
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
								isDisabled={!!currentPics.length || !!gifSrc}
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
							<label className="icon-item" htmlFor="fileDialog">
								<BsCardImage color={colors.pink} />
							</label>
							<input
								type="file"
								name="fileDialog"
								accept="image/*"
								multiple
								id="fileDialog"
								onChange={(evt) => {
									if (evt.target.files.length > 4) {
										evt.preventDefault();
										setMaxFileWarning(true);
										return;
									}
									setMaxFileWarning(false);
									setCurrentPics(evt.target.files);
									setPreviewPics(
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
									!tweet && !gifSrc && tweetButtonTest(currentPics.length)
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
                </ModalBody>
              </ModalContent>

          </Modal>
        </>
        )
}
