import express from 'express';
import * as postController from '../controllers/post.controller';
import requiresUser from '../middleware/requiresUser';

const router = express.Router();

router.get('/posts', requiresUser, postController.getAllPosts);
router.post('/post', requiresUser, postController.postPost);
router.delete('/posts/:postId', requiresUser, postController.deletePost);
router.put('/posts/:postId', requiresUser, postController.updatePost);
router.get('/p/:username', requiresUser, postController.profilePosts);
router.post('/retweets/:postId', requiresUser, postController.postRetweet);
router.get('/retweets/:postId', requiresUser, postController.getRetweet);
router.post('/like/:postId', requiresUser, postController.postLike);
export default router;
