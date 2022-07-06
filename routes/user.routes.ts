import express from 'express';
import requiresUser from '../middleware/requiresUser';
import {
    postFollow,
    postUnfollow,
    getFollowers,
    getFollowings,
} from '../controllers/user.controller';
const router = express.Router();
router.post('/follow', requiresUser, postFollow);
router.post('/unfollow', requiresUser, postUnfollow);
router.get('/followings', requiresUser, getFollowers);
router.get('/followers', requiresUser, getFollowings);
export default router;
