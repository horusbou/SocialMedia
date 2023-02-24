import React, { useContext, useState } from 'react'
import { BsCamera } from "react-icons/bs"
import { userContext } from '../context';
import Client from "../../services/Client";
import toBlob from "canvas-to-blob";
import uploadFileToBlob from "../../azure-storage-blob"

import {
  Box,
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
} from "@chakra-ui/react";
import AvatarEditor from 'react-avatar-editor'
import { colors } from '../../lib'
import './index.css'



export const Banner = ({ username, userData }) => {
  var editor = '';
  const { userData: userConnected } = useContext(userContext)
  const { isOpen: isOpenUpdateAvatar, onOpen: onOpenUpdateAvatar, onClose: onCloseUpdateAvatar } = useDisclosure()

  const handleCancel = () => {
    setCurrentBanner('')
    setPicture({
      ...picture,
      cropperOpen: false
    });
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = (e) => {
    e.preventDefault()
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      const blobImage = toBlob(croppedImg)
      setCurrentBanner(croppedImg)
      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg
      });
      let formData = new FormData();
      //formData.append('file', blobImage, 'myimage.png')
      uploadFileToBlob(blobImage, userConnected.user_id, "Banner")
      Client.changeBanner(formData)
    }
  };
  const handleFileChange = (e) => {

    let url = URL.createObjectURL(e.target.files[0]);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
    setCurrentBanner(e.target.files[0])
  };
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  });
  const [currentBanner, setCurrentBanner] = useState('')

  return (
    <div className="profile-header-bg-image">
      {currentBanner && !picture.cropperOpen ? <Image src={currentBanner} alt="" /> : userData.profileBanner ? <Image src={userData.profileBanner} alt="" /> : null}

      {userConnected.username === username ?
        <Badge
          _hover={{
            boxShadow: '1px 1px 10px 10px',
          }}
          cursor={"pointer"}
          borderRadius={'50%'}
          width="50px"
          height="50px"
          position={"absolute"}
          bottom="20px"
          right="20px"
          display={'flex'}
          alignItems="center"
          justifyContent="center"
          border="solid black 2px"
          background={"transparent"}
          onClick={onOpenUpdateAvatar}
        >
          <Icon as={BsCamera} w='25px' h='25px' color="black" />
        </Badge>
        : null}
      <Modal isOpen={isOpenUpdateAvatar} onClose={() => {
        onCloseUpdateAvatar();
      }}>
        <ModalOverlay />
        <ModalContent width="100%" color={"white"} bg={colors.background}>
          <ModalHeader >Update banner picture</ModalHeader>
          <ModalCloseButton _focus={{}} _active={{}} />
          <ModalBody height="400px">
            {!picture.cropperOpen ?
              <Box style={{
                border: "2px white dashed",
                height: "200px"
              }} htmlFor="file">
                <label htmlFor="file" style={{
                  width: "100%",
                  cursor: "pointer",
                  height: "100%",
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <BsCamera htmlFor="file" fontSize="30px" />
                </label>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="file"
                  accept="image/*"
                  multiple
                  id="file" onChange={handleFileChange} />
              </Box>
              : null}
            <AvatarEditor width={0} height={0} border={0} />
            {picture.cropperOpen && (
              <Box display="block">
                <AvatarEditor
                  ref={setEditorRef}
                  image={picture.img}
                  width={598}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]}
                />
                <Box>
                  <Button variant="contained" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
