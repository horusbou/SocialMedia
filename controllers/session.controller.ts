import { Response, Request, NextFunction } from 'express';
import { get } from 'lodash';
import { createSession, createAccessToken } from '../services/session.service';
import { sign } from '../util/jwt.utils';
import bcrypt from 'bcryptjs';
import { User as UserModel, UserInterface } from '../models/UserModel';
import HttpException from '../util/HttpException';

import {
    Session as SessionModel,
    SessionInterface,
} from '../models/SessionModel';

export async function createUserSessionhandler(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    //validate email and password
    const userData = await UserModel.findOne({ raw: true, where: { email } });
    if (!userData) {
        return next(new HttpException(404, "Invalid Email or Password"));
    }
    const matched = await bcrypt.compare(password, userData.password);
    if (!matched) {
        return next(new HttpException(404, "Invalid Email or Password"));
    }
    delete userData.password;
    const user = userData;
    //create Session
    const session = (await createSession(
        user.user_id,
        req.get('user-agent') || ''
    )) as SessionInterface;
    //create access token
    const accessToken = createAccessToken({
        user,
        session,
    });
    //create refresh token
    const refreshToken = sign(session, { expiresIn: '1y' });

    //send refresh access token
    res.json({ accessToken, refreshToken });
}
export async function invalidateUserSessionHandler(
    req: Request,
    res: Response
) {
    const sessionId = get(req, 'user.session');
    await SessionModel.update({ valid: false }, { where: { sessionId } });

    return res.sendStatus(200);
}
export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = get(req, 'user.user_id');
    const session = await SessionModel.findOne({
        where: { userId, valid: true },
    });
    return res.send(session);
}
export async function getUserHandler(req: Request, res: Response) {
    const user = get(req, 'user');
    //   console.log(user)
    return res.json(user);
}
