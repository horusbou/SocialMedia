import express from 'express';
import requiresUser from '../middleware/requiresUser';
import {
    postFollow,
    postUnfollow,
    getFollowers,
    getFollowings,
    SearchForUser,
    ChangeUserProfilePicture,
    ChangeUserProfileBanner
} from '../controllers/user.controller';
const router = express.Router();

router.post('/follow', requiresUser, postFollow);
router.post('/unfollow', requiresUser, postUnfollow);
router.get('/followings', requiresUser, getFollowers);
router.get('/followers', requiresUser, getFollowings);
router.get('/searchuser', SearchForUser)
router.post('/users/user/avatar', ChangeUserProfilePicture)

router.post('/users/user/banner', ChangeUserProfileBanner)
export default router;
