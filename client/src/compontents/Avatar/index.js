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
    Button,
    ModalFooter
  } from "@chakra-ui/react";
import Client from "../../services/Client";
import {default as AvatarEdit} from 'react-avatar-edit'
import { colors } from '../../lib'
import {BsCamera} from 'react-icons/bs'
import { useState,useContext,useEffect } from "react";
import './index.css'
import { userContext } from "../context";


export const PopUpAvatar = ({userData})=>{
    const [previewPhoto,setPreviewPhoto]=useState('');
    const [srcPhoto,setSrcPhoto]=useState('')
    const { isOpen:isOpenAvatar, onOpen:onOpenAvatar, onClose:onCloseAvatar } = useDisclosure()
    const { isOpen:isOpenUpdateAvatar, onOpen:onOpenUpdateAvatar, onClose:onCloseUpdateAvatar } = useDisclosure()
    const user = useContext(userContext);
    let croped='';

    const onClose =()=> {
        setPreviewPhoto('')
        setSrcPhoto('')
      }
      const onCrop = (preview)=> {
        setPreviewPhoto(preview)
      }
      const onBeforeFileLoad=(elem)=> {
        if(elem.target.files[0].size > 716800){
          alert("File is too big!");
          elem.target.value = "";
        };
      }
      useEffect(()=>{
        if(croped.length>0)
            userData.userAvatar = croped;
      },[userData,croped])
    return (
        <div className="popupAvatar">
            {!!Object.keys(userData).length?
            <>
           <Avatar
                name={`${userData.firstname} ${userData.lastname}`}
                size="2xl"
                cursor={"pointer"}
                src={userData.userAvatar}
                onClick={onOpenAvatar}
				/>
                {user?.userData.user_id === userData.user_id?
                    <Badge
                    cursor={"pointer"}
                    borderRadius={'50%'}
                    width="50px"
                    height="50px"
                    display={'flex'}
                    alignItems="center"
                    justifyContent="center"
                    onClick={onOpenUpdateAvatar}
                    >
                        <Icon as={BsCamera} w='25px' h='25px' />
                    </Badge>
                :null}

            </>
                :
            <Avatar
                size="2xl"
                    />}
            <Modal isOpen={isOpenAvatar} onClose={onCloseAvatar}>
            <ModalOverlay />
            <ModalContent width={'100%'} bg={colors.background}>
                <ModalBody width={'100%'} >
                        <Image  width={'100%'} src={userData.userAvatar} />
                </ModalBody>
            </ModalContent>
            </Modal>
            <Modal isOpen={isOpenUpdateAvatar} onClose={()=>{
                onCloseUpdateAvatar();
                setPreviewPhoto('')
                setSrcPhoto('')
            }}>
            <ModalOverlay />
            <ModalContent  width="100%" color={"white"} bg={colors.background}>
            <ModalHeader >Update profile picture</ModalHeader>
            <ModalCloseButton _focus={{}} _active={{}} />
            <ModalBody>
                <AvatarEdit
                            width={"100%"}
                            labelStyle={{width:"100%"}}
                            height={295}
                            onCrop={onCrop}
                            onClose={onClose}
                            onBeforeFileLoad={onBeforeFileLoad}
                            src={srcPhoto}
                            label={<span className="iconLabel"><BsCamera /></span>}
                            />
                </ModalBody>
            {previewPhoto &&<ModalFooter>
                <Button backgroundColor={colors.background} onClick={async ()=>{
                    const croped = await Client.changeAvatar(previewPhoto)
                    onCloseUpdateAvatar();
                    setPreviewPhoto('')
                    setSrcPhoto('')
                    userData.userAvatar=croped;
                    user.setUserData(prev=>({...prev.userData,userAvatar:croped}))
                }} border='solid white 1px' _focus={{}} _hover={{}}>Upload</Button>
            </ModalFooter>}
            </ModalContent>
            </Modal>
        </div>
    )
}
