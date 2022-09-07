import { Response, Request, NextFunction, Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { User, Like, Tweet, Retweet, Comment, Timeline } from "../entity"
import HttpException from '../util/HttpException';
import log from '../logger/log';
import { at, omit, sortBy } from 'lodash';
import { getFollowers } from '../services/userNeo.service';
import { TweetService } from '../services/postTweets.service';
import axios from 'axios';

const timelineService = 'http://localhost:8002/'
const fanoutService = "http://localhost:8001/"

export const getAllTweets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resp = await axios.get(timelineService + `${req.user.user_id}`)
    //const resp = await axios.get(timelineService + '5fbfbd22-8517-49c2-87be-64d680bd8f8e')
    res.send(resp.data)
  } catch (e) {
    console.log(e)
  }
}
// export const getAllTweets = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = await User.findOne({ where: { user_id: req.user.user_id } });
//   if (!user)
//     return next(new HttpException(404, "user not found"));
//   const timeline = await Timeline.findOneBy({ user: { user_id: req.user.user_id } });
//   if (!timeline)
//     return next(new HttpException(404, "timeline not found"));
//   const tweetsOfTimeline = await Tweet.find({
//     where: {
//       timeline: {
//         timeline_id: timeline.timeline_id
//       }
//     },
//     relations: ['timeline', 'source', 'source.timeline', 'comments', 'user'],
//     order: {
//       created_at: 'DESC'
//     }
//   })
//
//   const tweets: any = [];
//   for (let el of tweetsOfTimeline) {
//
//     tweets.push({
//       tweet_id: el.tweet_id,
//       tweet_body: el.tweet_body,
//       like_count: el.like_count,
//       retweet_count: el.retweet_count,
//       comments_count: el.comments.length,
//       created_at: el.created_at,
//       updated_at: el.updated_at,
//       source_id: el.source_id,
//       source: el.source,
//       user: el.user,
//       is_liked: (await Like.findOneBy({
//         tweet: { tweet_id: el.tweet_id },
//         user: { user_id: req.user.user_id }
//       })) !== null ? true : false,
//       is_retweeted: (await Tweet.findOneBy({
//         source_id: el.source?.tweet_id,
//       })) !== null ? true : false
//     })
//   }
//
//   return res.status(200).json(tweets);
// };
//
export const getRetweet = async (req: Request, res: Response) => {
};

//[x] To post a retweet with a body
export const postRetweet = async (req: Request, res: Response, next: NextFunction) => {
  console.log("testing this")
  const { tweet_id } = req.params;
  const user_id = req.user.user_id
  const { tweet_body } = req.body;
  try {
    const user = await User.findOneBy({ user_id })

    if (!user) {
      return res.json({ message: 'user not found' })
    }
    const tweet = await Tweet.findOneBy({ tweet_id })
    if (!tweet) {
      return res.json({ message: 'tweet not found' })
    }
    const timeline = await Timeline.findOneBy({ user: { user_id: req.user.user_id } });
    if (!timeline)
      return next(new HttpException(404, "timeline not found"));

    if (tweet.source_id) {
      const sourceTweet = await Tweet.findOneBy({ tweet_id: tweet.source_id })
      if (!sourceTweet)
        return next(new HttpException(404, "source Tweet not found"))
      const retweet = Tweet.create({ tweet_body, source: sourceTweet, timeline, user })
      sourceTweet.retweet_count++;
      await sourceTweet.save();
      await retweet.save()
      await axios.post(fanoutService + `postTweet/${retweet.tweet_id}/${req.user.user_id}`)
      return res.status(200).json(retweet);
    }
    const retweet = Tweet.create({ tweet_body: tweet_body, source: tweet, timeline, user })
    tweet.retweet_count++;
    await tweet.save();
    await retweet.save()
    await axios.post(fanoutService + `postTweet/${retweet.tweet_id}/${req.user.user_id}`)
    return res.status(200).json(retweet);
  } catch (error) {
    throw new HttpException(404, "something went wrong")
  }
};

export const deleteRetweet = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;
  const user_id = req.user.user_id

  try {
    const user = await User.findOneBy({ user_id })

    if (!user) {
      return res.json({ message: 'user not found' })
    }
    const tweet = await Tweet.findOneBy({ tweet_id })
    if (!tweet) {
      return res.json({ message: 'tweet not found' })
    }
    const source = await tweet.source;
    if (!source)
      return next(new HttpException(404, "source tweet not found"));

    source.retweet_count--;
    await source.save();
    await tweet.remove();
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const postRetweetNoBody = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;
  const user_id = req.user.user_id
  try {
    const user = await User.findOneBy({ user_id })

    if (!user) {
      return res.json({ message: 'user not found' })
    }
    const tweet = await Tweet.findOneBy({ tweet_id })

    if (!tweet) {
      return res.json({ message: 'tweet not found' })
    }
    const timeline = await Timeline.findOneBy({ user: { user_id: req.user.user_id } });
    if (!timeline)
      return next(new HttpException(404, "timeline not found"));
    let retweet: Tweet;
    if (!tweet.source_id) {
      retweet = Tweet.create({ tweet_body: {}, source: tweet, timeline, user })
      tweet.retweet_count++;
      await tweet.save();
      await retweet.save()
    } else {
      const source = await Tweet.findOneBy({ tweet_id: tweet.source_id })
      if (!source) {
        return new HttpException(404, "source tweet not found")
      }
      retweet = Tweet.create({ tweet_body: {}, source, timeline, user })
      source.retweet_count++;
      await source.save();
      await retweet.save();
    }
    await axios.post(fanoutService + `postTweet/${retweet.tweet_id}/${req.user.user_id}`)
    return res.status(200).json(retweet);
  } catch (error) {
    throw new HttpException(404, "something went wrong")
  }
}
// export const postRetweetNoBody = async (req: Request, res: Response, next: NextFunction) => {
//   const { tweet_id } = req.params;
//
//   const user = await User.findOneBy({ user_id: req.user.user_id });
//   if (!user)
//     return res.json("user not found");
//   const tweet = await Tweet.findOneBy({ tweet_id: tweet_id })
//   if (!tweet)
//     return res.json("tweet not found");
//
//   const retweet = Retweet.create({ user, tweet })
//   await retweet.save();
//   tweet.retweet_count++;
//   await tweet.save();
//   return res.json(tweet);
// }
export const profileTweets = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const user = await User.findOne({
    where: { username },
    relations: ['timeline']
  });
  if (!user)
    return next(new HttpException(404, "user not found"));
  const tweetsOfTimeline = await Tweet.find({
    where: {
      timeline: {
        timeline_id: user.timeline.timeline_id
      }
    },
    relations: ['timeline', 'source', 'source.timeline', 'comments'],
    order: {
      created_at: 'DESC'
    }
  })
  const tweets: any = [];
  for (let el of tweetsOfTimeline) {
    tweets.push({
      tweet_id: el.tweet_id,
      tweet_body: el.tweet_body,
      like_count: el.like_count,
      retweet_count: el.retweet_count,
      comments_count: el.comments.length,
      created_at: el.created_at,
      updated_at: el.updated_at,
      source_id: el.source_id,
      source: el.source,
      user: el.timeline.user,
      is_liked: (await Like.findOneBy({ tweet: { tweet_id: el.tweet_id }, user: { user_id: req.user.user_id } })) !== null ? true : false,
      is_retweeted: true
    })
  }
  return res.status(200).json(tweets);
};

export const postTweet2 = async (req: Request, res: Response) => {
  try {
    let pictures: string | string[] = '';
    if (req.files) {
      pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
    }
    const { tweet, gifSrc }: { tweet: string, gifSrc: string } = req.body;
    const { user_id } = req.user;
    const user = await User.findOneBy({ user_id });
    if (!user)
      return new HttpException(404, "user not found")
    const timeline = await Timeline.findOneBy({ user: { user_id } });
    if (!timeline)
      return new HttpException(404, "timeline not found")
    const tweetRow = Tweet.create({
      tweet_body: {
        tweet: tweet ? tweet : undefined,
        gifSrc: gifSrc ? gifSrc : undefined,
        filesSrc: pictures ? pictures : undefined
      },
      timeline,
      user
    });
    await tweetRow.save();
    return res.json(
      {
        tweet_id: tweetRow.tweet_id,
        tweet_body: tweetRow.tweet_body,
        like_count: tweetRow.like_count,
        retweet_count: tweetRow.retweet_count,
        created_at: tweetRow.created_at,
        updated_at: tweetRow.updated_at,
        source_id: tweetRow.source_id,
        source: tweetRow.source,
        user: tweetRow.timeline.user,
        is_liked: false
      }
    )

  } catch (error) {
    return new HttpException(404, "something went wrong", error.toString())
  }
};
export const postTweet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pictures: string | string[] = '';
    if (req.files) {
      pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
    }
    const { tweet, gifSrc }: { tweet: string, gifSrc: string } = req.body;
    const { user_id } = req.user;
    const user = await User.findOneBy({ user_id });
    if (!user)
      return res.json({ message: 'user not found!' });

    const timeline = await Timeline.findOneBy({ user: { user_id } });
    if (!timeline)
      return res.json({ message: 'user not found!' });

    const tweetRow = Tweet.create({
      tweet_body: {
        tweet: tweet ? tweet : undefined,
        gifSrc: gifSrc ? gifSrc : undefined,
        filesSrc: pictures ? pictures : undefined
      },
      timeline,
      user
    });
    await tweetRow.save();
    await axios.post(fanoutService + `postTweet/${tweetRow.tweet_id}/${req.user.user_id}`)
    return res.json(
      {
        tweet_id: tweetRow.tweet_id,
        tweet_body: tweetRow.tweet_body,
        like_count: tweetRow.like_count,
        retweet_count: tweetRow.retweet_count,
        created_at: tweetRow.created_at,
        updated_at: tweetRow.updated_at,
        source_id: tweetRow.source_id,
        source: tweetRow.source,
        user: tweetRow.timeline.user,
        is_liked: false,
        is_retweeted: false,
      }
    )
  } catch (error) {
    return res.status(500).json({ error })
  }
};
// export const postTweet = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let pictures: string | string[] = '';
//     if (req.files) {
//       pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
//     }
//     const { tweet, gifSrc }: { tweet: string, gifSrc: string } = req.body;
//     const { user_id } = req.user;
//     const user = await User.findOneBy({ user_id });
//     if (!user)
//       return res.json({ message: 'user not found!' });
//
//     const timeline = await Timeline.findOneBy({ user: { user_id } });
//     if (!timeline)
//       return res.json({ message: 'user not found!' });
//
//     const tweetRow = Tweet.create({
//       tweet_body: {
//         tweet: tweet ? tweet : undefined,
//         gifSrc: gifSrc ? gifSrc : undefined,
//         filesSrc: pictures ? pictures : undefined
//       },
//       timeline,
//       user
//     });
//     await tweetRow.save();
//     const service: TweetService = new TweetService(tweetRow);
//     console.log("service.getFollowers", await service.addPostToFollowersTimeline())
//     return res.json(
//       {
//         tweet_id: tweetRow.tweet_id,
//         tweet_body: tweetRow.tweet_body,
//         like_count: tweetRow.like_count,
//         retweet_count: tweetRow.retweet_count,
//         created_at: tweetRow.created_at,
//         updated_at: tweetRow.updated_at,
//         source_id: tweetRow.source_id,
//         source: tweetRow.source,
//         user: tweetRow.timeline.user,
//         is_liked: false
//       }
//     )
//   } catch (error) {
//     return res.status(500).json({ error })
//   }
// };

export const deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;

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
export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;

  // const user = await User.findOneBy({ user_id: req.user.user_id });
  // if (!user)
  //     return next(new HttpException(404, "User not found"));
  const tweet = await Tweet.findOneBy({ tweet_id });
  if (!tweet)
    return next(new HttpException(404, "Tweet not found"));

  const like = await Like.findOne({ where: { tweet: { tweet_id }, user: { user_id: req.user.user_id } } });
  if (!like)
    return next(new HttpException(404, "like not found"));
  await like.remove();
  tweet.like_count--;
  if (tweet.source_id) {
    const sourceTweet = await Tweet.findOneBy({ tweet_id: tweet.source_id })
    if (!sourceTweet)
      return new HttpException(404, "source tweet not found")
    sourceTweet.like_count--;
    await sourceTweet.save()
  }
  axios.delete(fanoutService + `likes/${tweet_id}/${req.user.user_id}`)
  await tweet.save();
  return res.status(200).json(tweet)
}
export const postLike = async (req: Request, res: Response) => {
  try {
    const { tweet_id } = req.params;

    const user = await User.findOneBy({ user_id: req.user.user_id });
    if (!user) {
      return res.json("user not found");
    }
    const tweet = await Tweet.findOneBy({ tweet_id });
    if (!tweet)
      return res.json("tweet not found");
    const like = Like.create({ tweet, user })
    tweet.like_count++;
    await tweet.save();
    await like.save();
    if (tweet.source_id) {
      const sourceTweet = await Tweet.findOneBy({ tweet_id: tweet.source_id })
      if (!sourceTweet)
        return new HttpException(404, "source tweet not found")

      sourceTweet.like_count++;
      await sourceTweet.save()
    }
    axios.post(fanoutService + `likes/${tweet_id}/${user.user_id}`)
    return res.json(like);
  } catch (error) {
    return res.status(400).json({ message: 'error ' + error });
  }
};

export const getTweet = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;
  const tweet = await Tweet.findOne({
    where: { tweet_id },
    relations: [
      'timeline.user',
      'comments',
      'comments.user',
      'likes',
      'source'
    ],
    order: { comments: { created_at: 'ASC' } }
  })
  if (!tweet)
    return next(new HttpException(404, 'tweet not found'))

  const user = await User.findOneBy({ user_id: req.user.user_id });
  if (!user)
    return next(new HttpException(404, "user not found"));
  if (Object.keys(tweet.tweet_body).length === 0) {
    const sourceTweet = await Tweet.findOne({
      where: { tweet_id: tweet.source_id },
      relations: ['timeline.user', 'comments', 'comments.user', 'likes', 'source'],
      order: { comments: { created_at: 'ASC' } }
    })
    if (!sourceTweet)
      return new HttpException(404, "source Tweet not found")
    return res.status(200).json({
      tweet_id: sourceTweet.tweet_id,
      tweet_body: sourceTweet.tweet_body,
      like_count: sourceTweet.like_count,
      retweet_count: sourceTweet.retweet_count,
      comments_count: sourceTweet.comments.length,
      created_at: sourceTweet.created_at,
      updated_at: sourceTweet.updated_at,
      source_id: sourceTweet.source_id,
      source: sourceTweet.source,
      user: sourceTweet.timeline.user,
      is_liked: false,
      is_retweeted: true
    })
  }
  return res.status(200).json({
    tweet_id: tweet.tweet_id,
    tweet_body: tweet.tweet_body,
    like_count: tweet.like_count,
    retweet_count: tweet.retweet_count,
    comments_count: tweet.comments.length,
    created_at: tweet.created_at,
    updated_at: tweet.updated_at,
    source_id: tweet.source_id,
    source: tweet.source,
    user: tweet.timeline.user,
    is_liked: (await Like.findOneBy({ tweet: { tweet_id: tweet.tweet_id }, user: { user_id: req.user.user_id } })) !== null ? true : false,
    is_retweeted: Object.keys(tweet.tweet_body).length === 0 ? (tweet.timeline.timeline_id === user.timeline.timeline_id ? true : false) : false
  }
  );
}
export const getTweetComments = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;
  const comments = await Comment.findBy({ tweet: { tweet_id } });
  if (!comments)
    return next(new HttpException(404, "comments not found"));
  log.info(comments);
  return res.status(200).json(comments);
}
export const getComment = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id, comment_id } = req.params;
  const comment = await Comment.findOneBy({ tweet: { tweet_id }, comment_id });
  if (!comment)
    return next(new HttpException(404, 'comment not found'));
  return res.status(200).json(comment);
}
export const postComment = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params;

  let pictures: string | string[] = '';
  if (req.files) {
    pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
  }
  const { comment, gifSrc }: { comment: string, gifSrc: string } = req.body;

  const user = await User.findOneBy({ user_id: req.user.user_id });
  if (!user)
    return next(new HttpException(404, "user not found"));
  const tweet = await Tweet.findOneBy({ tweet_id });
  if (!tweet)
    return next(new HttpException(404, "tweet not found"));

  const commentData = Comment.create({
    comment_body: {
      comment,
      gifSrc,
      filesSrc: pictures
    },
    tweet,
    user
  })
  tweet.comment_count++;
  await tweet.save();
  await commentData.save();
  return res.status(200).json(tweet);
}
