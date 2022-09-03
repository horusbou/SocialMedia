import express from "express"
import { pushTweet } from "../controllers"
const router = express.Router();

router.post('/postTweet/:tweet_id/:user_id', pushTweet)


export default router
