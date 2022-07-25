import {
    AiOutlineRetweet,
  } from 'react-icons/ai';
import {useState} from "react"
import { MenuItem } from '@chakra-ui/react';
import { MoreOption } from '../Post/moreOption';
import './index.css'
export function RetweetButton(props){
    const [retweetCountes, setretweetCountes] = useState(0);
    const [isRetweeted, setIsRetweeted] = useState(0);

    return <>
    {!isRetweeted?
            <MoreOption Icon={<AiOutlineRetweet className="icon-item" color="rgb(169, 185, 185)"/>}>
                    <MenuItem _hover={{color:"black"}}><p>Retweet</p></MenuItem>
                    <MenuItem _hover={{color:"black"}}><p>Retweet with quote</p></MenuItem>
            </MoreOption>
            :
            <AiOutlineRetweet
            className="icon-item"
            color="green"
        />}
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
