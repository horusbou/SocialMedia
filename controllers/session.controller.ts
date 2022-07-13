import { Response, Request, NextFunction } from 'express';
import { get, omit } from 'lodash';
import { createSession, createAccessToken } from '../services/session.service';
import { sign } from '../util/jwt.utils';
import bcrypt from 'bcryptjs';
import HttpException from '../util/HttpException';
import { User, Session } from '../entity'


export async function createUserSessionhandler(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await User.findOneBy({ email })
    if (!user) {
        return next(new HttpException(404, "Invalid Email or Password"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        return next(new HttpException(404, "Invalid Email or Password"));
    }

    const session = (await createSession(
        user.user_id,
        req.get('user-agent') || ''
    ));
    if (!session)
        return next(new HttpException(404, "something went wrong"));
    //create access token
    const accessToken = createAccessToken({
        user,
        session,
    });
    //create refresh token
    const refreshToken = sign(omit(session, "user"), { expiresIn: '1y' });

    //send refresh access token
    res.json({ accessToken, refreshToken });
}
export async function invalidateUserSessionHandler(
    req: Request,
    res: Response
) {
    const session_id = get(req, 'user.session');
    const session = await Session.findOneBy({ session_id });
    if (!session)
        return res.json("session not found");
    session.valid = false;
    await session.save();
    return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const user_id = get(req, 'user.user_id');
    const session = await Session.findOne({ where: { user: { user_id }, valid: true } })
    return res.send(session);
}

export async function getUserHandler(req: Request, res: Response) {
    const user = get(req, 'user');
    return res.json(user);
}
