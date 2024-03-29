import { Request, Response, NextFunction } from 'express';
import HttpException from '../util/HttpException';

const requiresUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    if (!user) {
        return next(new HttpException(403, "Forbidden: user not found"))
    }

    return next();
};

export default requiresUser;
