import express from 'express';
import {
    createUserhandler,
    getUserData,
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


//register User
router.get('/users', getUserHandler);
//get userData
router.get('/users/:username', requiresUser, getUserData);
// routes.get('/users/:username', getUserData);

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
