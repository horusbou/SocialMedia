import { Tweet } from "../entity/tweet.entitie";
import { User as UserNeo4J } from "../entity/UserNeoModel";
import { User } from "../entity/user.entitie";

export class TweetService {
    static stackTweets: Tweet[] = [];
    constructor(tweet: Tweet) {
        TweetService.stackTweets.push(tweet)
    }
    peek() {
        return TweetService.stackTweets[TweetService.stackTweets.length - 1];
    }
    async getFollowers() {
        const tweet = this.peek();
        const relationship = await UserNeo4J.findRelationships({
            alias: 'Follows',
            where: {
                target: { user_id: tweet.timeline.user.user_id }
            },
        });

        const followersId = relationship.map((follow: any) => {
            return follow.source.dataValues.user_id;
        });
        const followers: User[] = [];
        for (let el of followersId) {
            const user = await User.findOne({ where: { user_id: el }, relations: ['timeline'] });
            if (user)
                followers.push(user)
        }
        return followers;
    }
    async addPostToFollowersTimeline() {
        const followersUsers = await this.getFollowers();
        const tweet = TweetService.stackTweets.pop();
        if (!tweet)
            return;
        for (let el of followersUsers) {
            const tweetInFollowerTimline = Tweet.create({
                tweet_body: {
                    tweet: tweet.tweet_body.tweet || undefined,
                    gifSrc: tweet.tweet_body.gifSrc || undefined,
                    filesSrc: tweet.tweet_body.filesSrc || undefined
                },
                timeline: el.timeline,
                user: tweet.user
            })
            await tweetInFollowerTimline.save();
        }
    }
}
