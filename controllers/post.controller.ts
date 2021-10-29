import { Response, Request, NextFunction } from 'express';
import { HasMany, Model, ModelDefined, Op, Sequelize } from 'sequelize';
import { Post, PostIterface } from '../models/PostModel';
import { Retweet } from '../models/RetweetModel';
import { Timeline } from '../models/TimelineModel';
import { omit } from 'lodash';
import {
	User,
	UserInterface,
	UserCreationAttributes,
} from '../models/UserModel';
import fs from 'fs/promises';
import path from 'path';
import { Like } from '../models/LikesModel';
import log from '../logger/log';

export const getAllPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//@ts-ignore
	const user = await User.findByPk(req.user.dataValues.user_id);
	const timeline = await user.getTimeline();

	const timelinePosts = await Timeline.findAll({
		raw: true,
		include: [
			{
				model: Post,
				as: 'Posts',
				include: [
					{
						model: Retweet,
						as: 'Retweets',
					},
				],
			},
		],
		order: [
			[Post, 'updatedAt', 'Desc'],
			[Post, Retweet, 'updatedAt', 'Desc'],
		],
		where: {
			// [Op.or]: [{ '$Posts.timelineId$': timeline.timelineId }],
			[Op.or]: [
				{ '$Posts.timelineId$': timeline.timelineId },
				{ '$Posts.Retweets.timelineId$': timeline.timelineId },
			],
		},
	});

	let editedPosts: any = [];
	for (let post of timelinePosts) {
		let userData = omit(
			await User.findByPk(post.userId, { raw: true }),
			'password',
			'bio',
			'createdAt',
			'updatedAt'
		);

		editedPosts.push({
			isRetweeted: post['Posts.Retweets.retweet_id'],
			tweetBody: JSON.parse(`${post['Posts.tweetBody']}`),
			post_id: post['Posts.post_id'],
			like: post['Posts.like'],
			retweet: post['Posts.retweet'],
			createdAt: post['Posts.createdAt'],
			updatedAt: post['Posts.updatedAt'],
			owner: userData,
		});
		if (
			post['Posts.Retweets.retweet_id'] &&
			editedPosts.find((el: any) => el.post_id !== post['Posts.post_id'])
		) {
			editedPosts.push({
				isRetweeted: null,
				tweetBody: JSON.parse(`${post['Posts.tweetBody']}`),
				post_id: post['Posts.post_id'],
				like: post['Posts.like'],
				retweet: post['Posts.retweet'],
				createdAt: post['Posts.createdAt'],
				updatedAt: post['Posts.updatedAt'],
				owner: userData,
			});
		}
	}
	// console.log('editedPosts==>', editedPosts.length);
	// console.log('timelinePosts==>', timelinePosts);
	res.status(200).json(editedPosts);
};

export const getRetweet = async (req: Request, res: Response) => {
	const { postId } = req.params;
	let foundedUser: any;
	let retweetedPosts: any = [];
	//@ts-ignore
	User.findByPk(req.user.user_id)
		.then((user: any) => {
			if (!user) return res.json({ message: 'user not found' });
			return user.getRetweets({ raw: true });
		})
		.then((retweets: any[]) => {
			for (let retweet of retweets) {
				User.findByPk(retweet.userId, { raw: true }).then(
					(user: UserInterface) => {
						foundedUser = omit(
							user,
							'password',
							'bio',
							'createdAt',
							'updatedAt'
						);
					}
				);
				return Post.findByPk(retweet.post_id, { raw: true }).then(
					(post: PostIterface) => {
						retweetedPosts.push({
							isRetweeted: true,
							post,
							owner: foundedUser,
						});
					}
				);
			}
		})
		.then(() => {
			res.json(retweetedPosts);
		});
};

export const postRetweet = async (req: Request, res: Response) => {
	const { postId } = req.params;
	try {
		//@ts-ignore
		const user = await User.findByPk(req.user.user_id);
		if (!user) return res.json({ message: 'user not found' });
		const timeline = await user.getTimeline();
		await timeline.createRetweet({ postId });
		return res.status(200).json({ message: 'done' });
	} catch (error) {
		res.status(400).json({ message: error });
	}
};

export const profilePosts = (req: Request, res: Response) => {
	const { username } = req.params;
	User.findOne({ where: { username } }).then((user: UserInterface) => {
		if (!user) return res.status(200).json([]);
		//@ts-ignore
		user.getPosts().then((posts: PostIterface[]) => {
			posts.map((post: PostIterface) => {
				post.tweetBody = JSON.parse(`${post.tweetBody}`);
			});
			res.json(posts);
		});
	});
};
export const postPost = (req: Request, res: Response, next: NextFunction) => {
	let pictures: string | string[];
	if (req.files) {
		pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
	} else {
		pictures = '';
	}
	const { tweet, gifSrc } = req.body;
	//@ts-ignore
	console.log('userData=>', req.user);
	//@ts-ignore
	User.findByPk(req.user.dataValues.user_id).then((user: any) => {
		if (!user) return res.send('user not found');
		user
			.getTimeline()
			.then((timeline: any) => {
				return timeline.createPost({
					tweetBody: JSON.stringify({ tweet, gifSrc, filesSrc: pictures }),
					//@ts-ignore
					userId: req.user.dataValues.user_id,
				});
			})
			.then(() => res.json({ message: 'done' }))
			.catch((err: Error) => res.status(500).json({ err: err }));
	});
};
export const deletePost = (req: Request, res: Response, next: NextFunction) => {
	// console.log(req.params.postId);
	Post.findByPk(req.params.postId)
		.then((postData: PostIterface | null) => {
			if (postData !== null) {
				let data = JSON.parse(`${postData.tweetBody}`);
				if (!data.filesSrc.length) return postData;
				data.filesSrc.forEach((fpath: string) =>
					fs.unlink(path.join(__dirname, '..', fpath))
				);
				return postData;
			} else throw new Error('cannot delete the post');
		})
		//@ts-ignore
		.then((postData: PostCreationAttributes) => postData.destroy())
		.then(() => {
			res.json({ message: 'tweet deleted' });
		});
};
export const updatePost = (req: Request, res: Response, next: NextFunction) => {
	const _id = req.params.postId;
	// console.log(req.body);
	Post.findByPk(_id)
		.then((postData: PostIterface | null) => {
			if (postData !== null) {
				let postedData = JSON.parse(`${postData.tweetBody}`);
				postedData.tweet = req.body.newTweet;
				let sPostData = JSON.stringify(postedData);
				postData.tweetBody = sPostData;
				return postData;
			} else throw new Error('Post Not found');
		})
		.then((post: PostIterface) => {
			if (post !== null) {
				//@ts-ignore
				return post.save();
			}
		})
		.then(() => res.json({ message: 'tweet is updated' }))
		.catch((err: Error) => console.log(err));
};
export const postLike = async (req: Request, res: Response) => {
	const { postId } = req.params;
	console.log('postId=>', postId);
	try {
		//@ts-ignore
		const userId = req.user.dataValues.user_id;
		const post = await Post.findByPk(postId);
		log.info('post=>', post);
		const likes = await post.getLikes({ raw: true });
		const found = likes.find(
			(el: any) => el.userId === userId && el.postId === postId
		);
		if (found?.likesId) {
			const like = await Like.findByPk(found.likesId);
			await post.update({ like: post.dataValues.like - 1 });
			await post.removeLike(like);
			await like.destroy();
			return res.json({ message: 'deleted' });
		} else {
			//@ts-ignore
			await post.createLike({ userId });
			await post.update({ like: post.dataValues.like + 1 });
			return res.status(200).json({ message: 'liked' });
		}
	} catch (error) {
		return res.status(400).json({ message: 'error ' + error });
	}
};
