import express from "express"
import { pushTweet, pushLike, deleteLike } from "../controllers"
const router = express.Router();

router.post('/postTweet/:tweet_id/:user_id', pushTweet)
router.post('/likes/:tweet_id/:user_id', pushLike)
router.delete('/likes/:tweet_id/:user_id', deleteLike)


export default router
