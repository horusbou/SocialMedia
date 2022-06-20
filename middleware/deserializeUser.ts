import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { decode } from '../util/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';

const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = get(req, 'headers.authorization', '').replace(
        /^Bearer\s/,
        ''
    );
    const refreshToken = get(req, 'headers.x-refresh');
    if (!refreshToken) return next();

    const { decoded, expired } = decode(accessToken);
    if (decoded) {
        //@ts-ignore
        req.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);
            const { decoded } = decode(newAccessToken);
            //@ts-ignore
            req.user = decoded;
        }
        return next();
    }
    return next();
};
export default deserializeUser;
