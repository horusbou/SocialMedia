import express from 'express';
import {
    createUserhandler,
    getUserData,
    getAllUsers
} from '../controllers/user.controller';
import {
    createUserSessionhandler,
    invalidateUserSessionHandler,
    getUserSessionsHandler,
    getUserHandler,
} from '../controllers/session.controller';
import requiresUser from '../middleware/requiresUser';
import { body } from 'express-validator';
const router = express.Router();


//get connected User
router.get('/user', getUserHandler);
//get Allusers
router.get('/users', requiresUser, getAllUsers)
//get userData
router.get('/users/:username', requiresUser, getUserData);

//  POST /user
router.post(
    '/users',
    [
        body('username').not().isEmpty().trim().escape(),
        body('firstname').not().isEmpty().trim().escape(),
        body('lastname').not().isEmpty().trim().escape(),
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        body('confirmedPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ],
    createUserhandler
);

//Get the user's session
//  GET /sessions
router.get('/sessions', requiresUser, getUserSessionsHandler);
router.post('/sessions', createUserSessionhandler);
//logout
// DELETE /sessions
router.delete('/sessions', requiresUser, invalidateUserSessionHandler);

export default router;
