import { Tweet, User } from "../../entity";
const redis = require('redis');

async function subToSetOfFollowers(user_id: string, followers: User[] | []) {
    const client = redis.createClient();

    const subscriber = client.duplicate();

    await subscriber.connect();

    await subscriber.subscribe(user_id, (tweets: Tweet[]) => {
        console.log(tweets);
    });
}
subToSetOfFollowers('hamzaBouqal', [])
