import React, { useState } from 'react';
import './postItem.css';
import { MenuItem, Avatar } from '@chakra-ui/react';
import {
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineComment,
	AiOutlineShareAlt,
	AiOutlineRetweet,
} from 'react-icons/ai';
import PictureGif from './imageBloc';
import MoreOption from './moreOption';
import AlertEditPostItem from './editPostItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Client from '../services/Client';

export default function PostItem(props) {
	const [isLiked, setLike] = useState(false || props.userLiked);
	const [isRetweeted, setIsRetweeted] = useState(false);
	const [likeCountes, setLikeCountes] = useState(props.likes);
	const [retweetCountes, setretweetCountes] = useState(props.retweet);
	const [isEdited, setisEdited] = useState(false);
	const [postId, setPostId] = useState(null);
	async function like(postId) {
		await Client.likePost(postId);
	}
	// useEffect(() => {
	// 	// axios.post(`/like/${postId}`);
	// 	like();
	// 	//eslint-disable-next-line
	// 	setPostId(null);
	// }, [isLiked, postId]);
	return (
		<>
			{isEdited && (
				<AlertEditPostItem
					_id={props._id}
					tweetBody={props.tweetBody}
					isOpen={isEdited}
					onClose={() => setisEdited(false)}
				/>
			)}
			{props.isRetweeted !== null ? (
				<div className="retweeted">
					<p>retweeted !</p>
				</div>
			) : null}
			<div className="post-item">
				<div className="avatar">
					<Avatar name={props.fullName} src={props.avatar} />
				</div>
				<div className="post-body">
					<div className="post-content">
						<div className="content-header">
							<Link to={`/${props.username}`} className="header-data">
								<span className="name">{props.fullName}</span>
								<span className="username">@{props.username}</span>
							</Link>
							{props.postOwner === props.userId ? (
								<MoreOption Icon="..." children={['Edit', 'Delete']}>
									<MenuItem onClick={() => setisEdited(true)}>
										<p>Edit Post</p>
									</MenuItem>
									<MenuItem
										onClick={() => {
											axios.delete('/posts/' + props._id);
										}}
									>
										Delete Post
									</MenuItem>
								</MoreOption>
							) : null}
						</div>
						<div className="conetnt-body">
							<h3 style={{ whiteSpace: 'pre-line' }}>
								{props.tweetBody.tweet}
							</h3>
							<PictureGif
								gifSrc={props.tweetBody.gifSrc}
								filesSrc={props.tweetBody.filesSrc}
							/>
						</div>
					</div>
					<div className="post-actions">
						<div className="comments icon">
							<AiOutlineComment className="icon-item" />
						</div>
						<div className="retweet icon">
							{isRetweeted ? (
								<AiOutlineRetweet
									className="icon-item"
									color="green"
									onClick={() => {
										setretweetCountes(retweetCountes - 1);
										return setIsRetweeted(!isRetweeted);
									}}
								/>
							) : (
								<AiOutlineRetweet
									className="icon-item"
									onClick={() => {
										setretweetCountes(retweetCountes + 1);
										return setIsRetweeted(!isRetweeted);
									}}
								/>
							)}
							<span
								className={isRetweeted ? 'countes retweetcolor' : 'countes'}
							>
								{!retweetCountes ? '' : retweetCountes}
							</span>
						</div>
						<div className="heart icon">
							{isLiked ? (
								<AiFillHeart
									className="icon-item liked"
									color="#f91880"
									onClick={() => {
										setLikeCountes(likeCountes - 1);
										// axios.put(`/likes/${props._id}`);
										// console.log('Props Id==>\n', props._id, '\n');
										Client.likePost(props._id);
										setPostId(props._id);
										return setLike(!isLiked);
									}}
								/>
							) : (
								<AiOutlineHeart
									className="icon-item"
									onClick={() => {
										setLikeCountes(likeCountes + 1);
										//  axios.post(`/likes/${props._id}`);
										// await Client.likePost(props._id);
										Client.likePost(props._id);
										setPostId(props._id);
										return setLike(!isLiked);
									}}
								/>
							)}
							<span className={isLiked ? 'countes likecolor' : 'countes'}>
								{!likeCountes ? '' : likeCountes}
							</span>
						</div>
						<div className="share icon">
							<MoreOption Icon={<AiOutlineShareAlt className="icon-item" />}>
								<MenuItem>Share It</MenuItem>
								<MenuItem>Bookmake it</MenuItem>
							</MoreOption>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
