import {useRef} from "react"
import { useDisclosure } from '@chakra-ui/react'
import { colors } from "../../lib"
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    AlertDialogCloseButton
  } from '@chakra-ui/react'
import {AddPost} from "../Post/addPost"

export function PostDialog(){
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

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            size="lg"
          >
            <AlertDialogOverlay>
              <AlertDialogContent backgroundColor={colors.background}>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  <AlertDialogCloseButton color={colors.pink}
                  _active={{}}
                  _focus={{}} />
                </AlertDialogHeader>

                <AlertDialogBody>
                <AddPost addToPost={()=>{}} />
                </AlertDialogBody>

                {/* <AlertDialogFooter>
                </AlertDialogFooter> */}
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
        )
}
