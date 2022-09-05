import {
  AiOutlineRetweet,
} from 'react-icons/ai';
import './index.css'
import { useState, useRef } from "react"
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { MoreOption } from '../Post/moreOption';
import { RetweetPopUp } from '../RetweetPopUp';
import Client from '../../services/Client';

export function RetweetButton({ count = 0, userRetweeted, tweet }) {

  const [retweetCountes, setretweetCountes] = useState(count);
  const [isRetweeted, setIsRetweeted] = useState(userRetweeted);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  return <>
    {!isRetweeted ?
      <MoreOption Icon={<AiOutlineRetweet className="icon-item" color="rgb(169, 185, 185)" />}>
        <MenuItem onClick={() => {
          setIsRetweeted(!isRetweeted);
          setretweetCountes(retweetCountes + 1)
          Client.postRetweet(tweet.tweet_id, undefined)
        }
        }
          _hover={{ color: "black" }}>
          <p>Retweet</p>
        </MenuItem>
        <MenuItem onClick={() => {
          onOpen();
          setIsRetweeted(!isRetweeted);
          setretweetCountes(retweetCountes + 1)
        }}
          _hover={{ color: "black" }}>
          <p>Retweet with quote</p>
        </MenuItem>
        <RetweetPopUp isOpen={isOpen} cancelRef={cancelRef} onClose={onClose} tweet={tweet} />
      </MoreOption>
      :
      <AiOutlineRetweet
        className="icon-item"
        color="green"
        onClick={() => {
          setIsRetweeted(!isRetweeted);
          setretweetCountes(retweetCountes - 1)
          Client.deleteRetweet(tweet.tweet_id)
        }}
      />}
    <span
      className={isRetweeted ? 'countes retweetcolor' : 'countes'}
    >
      {!retweetCountes ? '' : retweetCountes}
    </span>
  </>

}

/*
    /*
    <div className='retweet-button'>
    {isRetweeted ? (
        <AiOutlineRetweet
        className="icon-item"
        color="green"
        onClick={() => {
            // setretweetCountes(retweetCountes - 1);
            // return setIsRetweeted(!isRetweeted);
        }}
        />
    ) : (
        <AiOutlineRetweet
        className="icon-item"
        // color="#a9b9b9"
        color="green"
        onClick={() => {
            // Client.postRetweet(props.tweet_id,{tweet_body:{}})
            // setretweetCountes(retweetCountes + 1);
            // return setIsRetweeted(!isRetweeted);
        }}
        />
    )}
    <span
        className={isRetweeted ? 'countes retweetcolor' : 'countes'}
    >
        {!retweetCountes ? '' : retweetCountes}
    </span>
    </div>
    */
