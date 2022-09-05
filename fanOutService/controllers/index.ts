import { Request, Response } from "express"
import * as redis from "redis"
import { User as UserNeo4J } from "../../entity/UserNeoModel";


const redisUrl = 'redis://127.0.0.1:6379';
let redisClient = redis.createClient({ url: redisUrl });
redisClient.connect()

const gettingUsersFollwers = async (user_id: string): Promise<string[] | null> => {
  const relationship = await UserNeo4J.findRelationships({
    alias: 'Follows',
    where: {
      target: { user_id }
    },
  });

  const followersId = relationship.map((follow: any) => {
    return follow.source.dataValues.user_id;
  });
  if (followersId.length > 0)
    return followersId;
  return null;
}

export const pushTweet = async (req: Request, res: Response) => {
  const { tweet_id, user_id } = req.params;
  redisClient.lPush(`${user_id}`, `${tweet_id}:${user_id}`)
  gettingUsersFollwers(user_id).then(data => {
    if (data) {
      data.forEach(user => redisClient.lPush(`${user}`, `${tweet_id}:${user_id}`))
    }
  })
  return res.send('done')
}
export const pushLike = async (req: Request, res: Response) => {
  const { tweet_id, user_id } = req.params;
  redisClient.lPush('likes', `${user_id}:likes:${tweet_id}`)

  return res.send('done')
}
export const deleteLike = (req: Request, res: Response) => {
  const { tweet_id, user_id } = req.params;
  redisClient.lRem('likes', 1, `${user_id}:likes:${tweet_id}`)
  return res.send("done")
}
