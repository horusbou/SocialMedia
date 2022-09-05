import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  AlertDialogFooter,
  Avatar,
  Button,
  Textarea,
} from '@chakra-ui/react'
import { colors } from '../../lib'
import { SourceItem } from '../Retweet/sourceItem'
import { useContext, useRef, useEffect, useState } from 'react'
import { userContext } from '../context'
import './index.css'
import Client from '../../services/Client'



export function RetweetPopUp(props) {
  const { isOpen, cancelRef, onClose, tweet } = props
  const { userData: user } = useContext(userContext);
  const textareaRef = useRef(null);

  const [retweet, setRetweet] = useState('');

  const handleChange = (evt) => setRetweet(evt.target.value);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    Client.postRetweet(props.tweet.tweet_id, { tweet_body: { tweet: retweet } })
    setRetweet('');
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [retweet]);

  return (<AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={cancelRef}
    onClose={onClose}
  >
    <AlertDialogOverlay>
      <form onSubmit={handleSubmit}>
        <AlertDialogContent className="retweetPopUp" backgroundColor={colors.background} color={'white'}>
          <AlertDialogCloseButton _focus={{}} />
          <AlertDialogBody className='retweetPopUp-body'>

            <div className="avatar">
              <Avatar src={user.userAvatar} name={user.firstname + ' ' + user.lastname} />
            </div>
            <div className="content">
              <div className='textarea'>
                <Textarea
                  ref={textareaRef}
                  variant="filled"
                  _placeholder={{ color: '#B5B5B5' }}
                  style={{
                    padding: 5,
                    display: 'block',
                    resize: 'none',
                    overflow: 'hidden',
                    background: "#1C1C1C",
                    color: 'white',
                    border: 'none',
                  }}
                  value={retweet}
                  onChange={handleChange}
                  _hover={{}}
                  _focus={{}}
                  placeholder='Add a comment' />
              </div>
              <SourceItem user={tweet.user} tweetBody={tweet.tweetBody} />
            </div>

          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              type="submit"
              backgroundColor={colors.pink}
              color="white"
              _hover={{}}
              _focus={{}}
              _active={{}}
              isDisabled={
                !retweet
              }
              className="tweet"
            >
              Tweet
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialogOverlay>

  </AlertDialog>)
}
