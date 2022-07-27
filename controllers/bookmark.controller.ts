import { Response, Request, NextFunction, Router } from 'express';
import { User, Tweet, Bookmark } from "../entity"
import HttpException from '../util/HttpException';

export const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneBy({ user_id: req.user.user_id });
    if (!user)
        return next(new HttpException(404, "user not found in Bookmark"));
    const bookmarks = await Bookmark.find({ where: { user: { user_id: req.user.user_id } }, order: { created_at: 'DESC' }, relations: ['tweet', 'tweet.user'] })
    return res.json(bookmarks.map(el => el.tweet))
}

export const bookmarkATweet = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneBy({ user_id: req.user.user_id });
    const { tweet_id } = req.params;
    if (!user)
        return next(new HttpException(404, "user not found in Bookmark"));
    const tweet = await Tweet.findOneBy({ tweet_id });
    if (!tweet)
        return next(new HttpException(404, "tweet not found in Bookmark"));

    const bookmark = Bookmark.create({ tweet, user });
    await bookmark.save();
    return res.json(user.bookmarks)
}
export const deleteBookmarkedTweet = async (req: Request, res: Response, next: NextFunction) => {
    const { tweet_id } = req.params;
    const user = await User.findOneBy({ user_id: req.user.user_id });
    if (!user)
        return next(new HttpException(404, "user not found in Bookmark"));
    const bookmark = await Bookmark.findOne({ where: { user: { user_id: req.user.user_id }, tweet: { tweet_id } } });
    if (!bookmark)
        return next(new HttpException(404, "bookmark not found"));
    await bookmark.remove()
    return res.json(user.bookmarks)
}
