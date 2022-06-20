import express from 'express';
import { createUserhandler, getUserData } from '../controllers/user.controller';
import {
	createUserSessionhandler,
	invalidateUserSessionHandler,
	getUserSessionsHandler,
	getUserHandler,
} from '../controllers/session.controller';
import requiresUser from '../middleware/requiresUser';
import { body } from 'express-validator';
const routes = express.Router();

//register User
routes.get('/users', getUserHandler);
//get userData
routes.get('/users/:username', requiresUser, getUserData);

//  POST /user
routes.post(
	'/users',
	[
		body('username').not().isEmpty().trim().escape(),
		body('firstName').not().isEmpty().trim().escape(),
		body('lastName').not().isEmpty().trim().escape(),
		body('email').isEmail(),
		body('password').isLength({ min: 5 }),
		body('rePassword').custom((value, { req }) => {
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
routes.get('/sessions', requiresUser, getUserSessionsHandler);
routes.post('/sessions', createUserSessionhandler);
//logout
// DELETE /sessions
routes.delete('/sessions', requiresUser, invalidateUserSessionHandler);

export default routes;
