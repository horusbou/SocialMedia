import express from 'express';
import * as bookmarkController from '../controllers/bookmark.controller';
import requiresUser from '../middleware/requiresUser';

const router = express.Router();
router.get('/bookmarks', requiresUser, bookmarkController.getBookmarks)
router.post('/bookmarks/:tweet_id', requiresUser, bookmarkController.bookmarkATweet);
router.delete('/bookmarks/:tweet_id', requiresUser, bookmarkController.deleteBookmarkedTweet);

export default router;
