import express from 'express';
import { createUserhandler,getUserData } from '../controllers/user.controller';
import {
	createUserSessionhandler,
	invalidateUserSessionHandler,
	getUserSessionsHandler,
	getUserHandler,
} from '../controllers/session.controller';
import requiresUser from '../middleware/requiresUser';
const routes = express.Router();

//register User
routes.get('/users', getUserHandler);
//get userData
routes.get('/users/:username',requiresUser,getUserData)

//  POST /user
routes.post('/users', createUserhandler);

//Get the user's session
//  GET /sessions
routes.get('/sessions', requiresUser, getUserSessionsHandler);
routes.post('/sessions', createUserSessionhandler);
//logout
// DELETE /sessions
routes.delete('/sessions', requiresUser, invalidateUserSessionHandler);

export default routes;
