import {
    Avatar,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalBody,
    Image,
    Badge,
    Icon,
    Box,
    AspectRatio,
    Container,
    forwardRef,
    Heading,
    Input,
    Stack,
    Text,
    CloseButton,
    GridItem
  } from "@chakra-ui/react";
import { colors } from '../../lib'
import {BsCamera} from 'react-icons/bs'
import {motion,useAnimation} from 'framer-motion/dist/es/index'
import { useState } from "react";
import './index.css'


const first = {
    rest: {
      rotate: "-15deg",
      scale: 0.95,
      x: "-50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      x: "-70%",
      scale: 1.1,
      rotate: "-20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };

  const second = {
    rest: {
      rotate: "15deg",
      scale: 0.95,
      x: "50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      x: "70%",
      scale: 1.1,
      rotate: "20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };

  const third = {
    rest: {
      scale: 1.1,
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      scale: 1.3,
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };


  const PreviewImage = forwardRef((props, ref) => {
    return (
      <Box
        bg="white"
        top="0"
        height="100%"
        width="100%"
        position="absolute"
        borderWidth="1px"
        borderStyle="solid"
        rounded="sm"
        borderColor="gray.400"
        as={motion.div}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
        {...props}
        ref={ref}
      />
    );
  });

export const PopUpAvatar = ({userData})=>{
    const [previewPhoto,setPreviewPhoto]=useState([])
    const { isOpen:isOpenAvatar, onOpen:onOpenAvatar, onClose:onCloseAvatar } = useDisclosure()
    const { isOpen:isOpenUpdateAvatar, onOpen:onOpenUpdateAvatar, onClose:onCloseUpdateAvatar } = useDisclosure()
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();
    return (
        <div className="popupAvatar">
            {!!Object.keys(userData).length?
            <>
           <Avatar
                name={`${userData.firstname} ${userData.lastname}`}
                size="2xl"
                src={userData.userAvatar}
                onClick={onOpenAvatar}
				/>
                <Badge
                borderRadius={'50%'}
                width="50px"
                height="50px"
                display={'flex'}
                alignItems="center"
                justifyContent="center"
                onClick={onOpenUpdateAvatar}
                ><Icon as={BsCamera} w='25px' h='25px' /></Badge>
            </>
                :
            <Avatar
                size="2xl"
                    />}
            <Modal  isOpen={isOpenAvatar} onClose={onCloseAvatar}>
            <ModalOverlay />
            <ModalContent width={'100%'} bg={colors.background}>
                <ModalBody width={'100%'} >
                        <Image  width={'100%'} src={userData.userAvatar} />
                </ModalBody>
            </ModalContent>
            </Modal>
            <Modal isOpen={isOpenUpdateAvatar} onClose={()=>{
                onCloseUpdateAvatar();
                setPreviewPhoto([])
            }}>
            <ModalOverlay />
            <ModalContent width="100%" color={"white"} bg={colors.background}>
            <ModalHeader >Update profile picture</ModalHeader>
            <ModalCloseButton _focus={{}} _active={{}} />
            <ModalBody>
                {console.log(previewPhoto.length)}
                {/* {
                                       <GridItem className="image-border image-border-fit-content">
                        <CloseButton
                    size="sm"
                    className="close-button"
                    borderRadius="50%"
                    backgroundColor="#25221e"
                    color="white"
                    _hover={{ opacity: 0.6 }}
                    onClick={() => {setPreviewPhoto([])}}
                />
                    <Image
                        // ref={imageRef}
                        loading="lazy"
                        borderRadius="15px"
                        className="image-content"
                        box-size="100px"
                        src={previewPhoto}
                    />
                    </GridItem>
                } */}
                {previewPhoto.length>0?
                    <GridItem className="image-border image-border-fit-content">
                        <CloseButton
                    size="sm"
                    className="close-button"
                    borderRadius="50%"
                    backgroundColor="#25221e"
                    color="white"
                    _hover={{ opacity: 0.6 }}
                    onClick={() => {setPreviewPhoto([])}}
                />
                    <Image
                        // ref={imageRef}
                        loading="lazy"
                        borderRadius="15px"
                        className="image-content"
                        box-size="100px"
                        width={390}
                        height={'100%'}

                        src={previewPhoto}
                    />
                    </GridItem>
                :
                <Container my="12">
                <AspectRatio width="64" ratio={1} w="100%" >
                    <Box
                    borderColor="gray.300"
                    borderStyle="dashed"
                    borderWidth="2px"
                    rounded="md"
                    shadow="sm"
                    role="group"
                    transition="all 150ms ease-in-out"
                    _hover={{
                        shadow: "md"
                    }}
                    as={motion.div}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    >
                    <Box position="relative" height="100%" width="100%">
                        <Box
                        position="absolute"
                        top="0"
                        left="0"
                        height="100%"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                        >
                        <Stack
                            height="100%"
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justify="center"
                            spacing="4"
                        >
                            <Box height="16" width="12" position="relative">
                            <PreviewImage
                                variants={first}
                                backgroundImage="url('https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg')"
                            />
                            <PreviewImage
                                variants={second}
                                backgroundImage="url('https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2628&q=80')"
                            />
                            <PreviewImage
                                variants={third}
                                backgroundImage={`url("https://images.unsplash.com/photo-1563612116625-3012372fccce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2480&q=80")`}
                            />
                            </Box>
                            <Stack p="8" textAlign="center" spacing="1">
                            <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                                Drop images here
                            </Heading>
                            <Text fontWeight="light">or click to upload</Text>
                            </Stack>
                        </Stack>
                        </Box>
                        <Input
                        type="file"
                        height="100%"
                        width="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        opacity="0"
                        aria-hidden="true"
                        accept="image/*"
                        onDragEnter={startAnimation}
                        onDragLeave={stopAnimation}
                        onChange={(evt)=>{
                            console.log(evt.target.files)
                            setPreviewPhoto(URL.createObjectURL(evt.target.files[0]))
                        }}
                        />
                    </Box>
                    </Box>
                </AspectRatio>
                </Container>
                }
            </ModalBody>
            </ModalContent>
            </Modal>
        </div>
    )
}
