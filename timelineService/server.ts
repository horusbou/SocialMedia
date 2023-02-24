import express from "express"
import { createConnection } from "typeorm"
import router from "./routes"
import { Tweet, Retweet, Like, User, Session, Comment, Timeline, Bookmark, Message, Room } from '../entity'

const app = express()
const main = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: 'localhost',
      port: 3306,
      username: "root",
      password: "compaq7550",
      database: "ensaTweet",
      entities: [User, Tweet, Like, Comment, Retweet, Session, Timeline, Bookmark, Room, Message],
      synchronize: true,
    })
    app.use(router)
    app.listen(8002, () => console.log('timeline Service is running!'))
  } catch (error) {
    console.log(error)
  }
}

main()
