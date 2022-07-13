import express from 'express';
import * as postController from '../controllers/post.controller';
import requiresUser from '../middleware/requiresUser';

const router = express.Router();

router.get('/tweets', requiresUser, postController.getAllTweets);
router.post('/tweet', requiresUser, postController.postTweet);
router.get('/tweets/profile/:username', requiresUser, postController.profileTweets);
router.post('/retweets/body/:postId', requiresUser, postController.postRetweetBody);
router.post('/retweets/:postId', requiresUser, postController.postRetweetNoBody);
// router.get('/retweets/:postId', requiresUser, postController.getRetweet);
// router.post('/like/:postId', requiresUser, postController.postLike);
// router.put('/tweets/:tweet_id', requiresUser, postController.updatePost);
// router.delete('/tweets/:tweet_id', requiresUser, postController.deleteTweet);
export default router;
