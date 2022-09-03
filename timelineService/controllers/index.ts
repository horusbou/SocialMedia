import { Request, Response } from "express"
import * as redis from "redis"
import { Tweet, User } from "../../entity"
import { User as UserNeo4J } from "../../entity/UserNeoModel"
import { omit } from "lodash"

const redisUrl = 'redis://127.0.0.1:6379';
const redisClient = redis.createClient({ url: redisUrl })
redisClient.connect()

//those i Follow
const usersFollowings = async (user_id: string): Promise<string[] | null> => {
  const relationship = await UserNeo4J.findRelationships({ alias: 'Follows', where: { source: { user_id } } })
  const followingsId = relationship.map((following: any) => following.target.dataValues.user_id)
  if (followingsId.length)
    return followingsId
  return null

}
const gettingTweetData = async (data: string[]) => {
  if (data.length) {
    const feed = [];
    for (let item of data) {
      const user_id = item.split(':')[1];
      const tweet_id = item.split(':')[0];
      const tweet = await Tweet.findOneBy({ tweet_id });
      feed.push(
        {
          ...tweet,
          source: tweet?.source_id && await Tweet.findOneBy({ tweet_id: tweet?.source_id }),
          is_liked: false,
          is_retweeted: false,
          user: omit(await User.findOneBy({ user_id }), 'password')
        }
      )

    }
    return feed
  }
  return []
}
export const hydrateTimeline = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const data = await redisClient.lRange(user_id, 0, -1)
  if (data.length) {
    const feed = [];
    for (let item of data) {
      const user_id = item.split(':')[1];
      const tweet_id = item.split(':')[0];
      const tweet = await Tweet.findOneBy({ tweet_id });
      feed.push(
        {
          ...tweet,
          source: tweet?.source_id && await Tweet.findOneBy({ tweet_id: tweet?.source_id }),
          is_liked: false,
          is_retweeted: false,
          user: omit(await User.findOneBy({ user_id }), 'password')
        }
      )

    }
    return res.send(feed)
  } else {
    const follwingsId = await usersFollowings(user_id);
    if (follwingsId && follwingsId.length) {
      const data = [];
      for (let follower of follwingsId) {
        data.push(...await redisClient.lRange(follower, 0, -1))
      }
      return res.send(await gettingTweetData(await pushingToCache(user_id, data)));
    }
    return res.send([])
  }
}

const pushingToCache = (user: string, data: string[]): Promise<string[]> => {
  return new Promise((resolve, _reject) => {
    for (let el of data) {
      const tweet_id = el.split(':')[0]
      const user_id = el.split(':')[1];
      redisClient.rPush(user, `${tweet_id}:${user_id}`)
    }
    resolve(redisClient.lRange(user, 0, -1))
  })
}