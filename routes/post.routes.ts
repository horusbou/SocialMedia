import express from 'express';
import * as postController from '../controllers/post.controller';
import requiresUser from '../middleware/requiresUser';

const router = express.Router();

router.get('/tweets', requiresUser, postController.getAllTweets);
router.post('/tweet', requiresUser, postController.postTweet);
router.get('/tweets/profile/:username', requiresUser, postController.profileTweets);
router.post('/retweets/body/:tweet_id', requiresUser, postController.postRetweetBody);
router.post('/retweets/:tweet_id', requiresUser, postController.postRetweetNoBody);
router.post('/tweets/:tweet_id/like', requiresUser, postController.postLike);
router.delete('/tweets/:tweet_id/unlike', requiresUser, postController.deleteLike);
router.get('/tweets/:tweet_id', requiresUser, postController.getTweet);
router.get('/tweets/:tweet_id/comments', requiresUser, postController.getTweetComments)
router.get('/tweets/:tweet_id/comment', requiresUser, postController.postComment)
router.get('/tweets/:tweet_id/comments/:comment_id', requiresUser, postController.getComment)

// router.put('/tweets/:tweet_id', requiresUser, postController.updatePost);
// router.delete('/tweets/:tweet_id', requiresUser, postController.deleteTweet);
export default router;
