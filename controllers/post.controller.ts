import { Response, Request, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { User, Like, Tweet, Retweet } from "../entity"
import HttpException from '../util/HttpException';
import { omit } from 'lodash';
import log from '../logger/log';
import { getFollowers } from '../services/userNeo.service';

export const getAllTweets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //@ts-ignore
    const user = await User.find({ where: { user_id: req.user.user_id }, relations: ['tweets', 'tweets.user', 'tweets.comments', 'tweets.comments.user', 'retweets', 'retweets.user', 'retweets.tweet', 'retweets.tweet.user', 'tweets.source', 'tweets.source.user'] });
    if (!user)
        return next(new HttpException(404, "user not found"));
    const tweets = [...user[0].tweets, ...user[0].retweets]

    tweets.sort(function (a, b) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    return res.status(200).json(tweets);
};

export const getRetweet = async (req: Request, res: Response) => {
    // const { postId } = req.params;
    // let foundedUser: any;
    // let retweetedPosts: any = [];
    // //@ts-ignore
    // User.findByPk(req.user.user_id)
    //     .then((user: any) => {
    //         if (!user) return res.json({ message: 'user not found' });
    //         return user.getRetweets({ raw: true });
    //     })
    //     .then((retweets: any[]) => {
    //         for (let retweet of retweets) {
    //             User.findByPk(retweet.userId, { raw: true }).then(
    //                 (user: UserInterface) => {
    //                     foundedUser = omit(
    //                         user,
    //                         'password',
    //                         'bio',
    //                         'createdAt',
    //                         'updatedAt'
    //                     );
    //                 }
    //             );
    //             return Post.findByPk(retweet.post_id, { raw: true }).then(
    //                 (post: PostIterface) => {
    //                     retweetedPosts.push({
    //                         isRetweeted: true,
    //                         post,
    //                         owner: foundedUser,
    //                     });
    //                 }
    //             );
    //         }
    //     })
    //     .then(() => {
    //         res.json(retweetedPosts);
    //     });
};

//[x] To post a retweet with a body
export const postRetweetBody = async (req: Request, res: Response, next: NextFunction) => {
    const { tweet_id } = req.params;
    //@ts-ignore
    const user_id = req.user.user_id
    const { tweet_body } = req.body;
    try {
        const user = await User.findOneBy({ user_id })
        const tweet = await Tweet.findOneBy({ tweet_id })

        if (!user) {
            return res.json({ message: 'user not found' })
        }
        if (!tweet) {
            return res.json({ message: 'tweet not found' })
        }
        const retweet = Tweet.create({ tweet_body, source: tweet, user })

        await retweet.save()
        return res.status(200).json(retweet);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
export const postRetweetNoBody = async (req: Request, res: Response, next: NextFunction) => {
    const { tweet_id } = req.params;
    //@ts-ignore
    const user = await User.findOneBy({ user_id: req.user.user_id });
    if (!user)
        return res.json("user not found");
    const tweet = await Tweet.findOneBy({ tweet_id: tweet_id })
    if (!tweet)
        return res.json("tweet not found");

    const retweet = Retweet.create({ user, tweet })
    await retweet.save();
    tweet.retweet_count++;
    await tweet.save();
    return res.json(tweet);
}
export const profileTweets = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const user = await User.findOne({
        where: { username },
        relations: ['tweets', 'tweets.user', 'tweets.comments', 'tweets.comments.user', 'retweets', 'retweets.user', 'retweets.tweet', 'retweets.tweet.user', 'tweets.source', 'tweets.source.user'],

    });
    if (!user)
        return next(new HttpException(404, "user not found"));
    const tweets = [...user.tweets, ...user.retweets]

    tweets.sort(function (a, b) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    return res.status(200).json(tweets);
};

export const postTweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pictures: string | string[] = '';
        if (req.files) {
            pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
        }
        const { tweet, gifSrc }: { tweet: string, gifSrc: string } = req.body;
        //@ts-ignore
        const user = await User.findOneBy({ user_id: req.user.user_id });
        if (!user)
            return res.json({ message: 'user not found!' });
        const tweetRow = Tweet.create({
            tweet_body: {
                tweet,
                gifSrc,
                filesSrc: pictures ? pictures : undefined
            },
            user
        });
        await tweetRow.save();
        return res.json({ tweet: tweetRow, message: 'done' })
    } catch (error) {
        return res.status(500).json({ error })
    }
};

export const deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
    const { tweet_id } = req.params;
    // console.log(req.params.postId);

    const tweet = await Tweet.findOneBy({ tweet_id });
    if (!tweet)
        return res.json('tweet not found');

    if (Array.isArray(tweet.tweet_body.filesSrc)) {
        tweet.tweet_body.filesSrc.forEach((fpath: string) =>
            fs.unlink(path.join(__dirname, '..', fpath))
        );
    } else {
        fs.unlink(path.join(__dirname, '..', tweet.tweet_body.filesSrc))
    }
    await tweet.remove();
    return res.json(tweet);

};
export const updatePost = (req: Request, res: Response, next: NextFunction) => {
    // const _id = req.params.postId;
    // // console.log(req.body);
    // Post.findByPk(_id)
    //     .then((postData: PostIterface | null) => {
    //         if (postData !== null) {
    //             let postedData = JSON.parse(`${postData.tweetBody}`);
    //             postedData.tweet = req.body.newTweet;
    //             let sPostData = JSON.stringify(postedData);
    //             postData.tweetBody = sPostData;
    //             return postData;
    //         } else throw new Error('Post Not found');
    //     })
    //     .then((post: PostIterface) => {
    //         if (post !== null) {
    //             //@ts-ignore
    //             return post.save();
    //         }
    //     })
    //     .then(() => res.json({ message: 'tweet is updated' }))
    //     .catch((err: Error) => console.log(err));
};
export const postLike = async (req: Request, res: Response) => {
    try {
        const { tweet_id } = req.params;
        //@ts-ignore
        const user = await User.findOneBy({ user_id: req.user.user_id });
        if (!user) {
            return res.json("user not found");
        }
        const tweet = await Tweet.findOneBy({ tweet_id });
        if (!tweet)
            return res.json("tweet not found");
        const like = Like.create({ tweet })
        tweet.like_count++;
        await tweet.save();
        await like.save();
        return res.json(like);
    } catch (error) {
        return res.status(400).json({ message: 'error ' + error });
    }
};
