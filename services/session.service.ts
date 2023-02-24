import { sign, decode } from '../util/jwt.utils';
import { get } from 'lodash';
import { User, Session } from '../entity';
import { UserInterface, SessionInterface } from '../util/types';
import HttpException from '../util/HttpException';


export async function createSession(user_id: string, userAgent: string) {
    const user = await User.findOneBy({ user_id });
    if (!user)
        return null;
    try {
        const session = Session.create({
            valid: true,
            userAgent,
            user
        })
        await session.save();
        return session
    } catch (err) {
        return new HttpException(300, "user already connected")
    }

}
export function createAccessToken({
    user,
    session,
}: {
    user: UserInterface;
    session: SessionInterface;
}) {
    // Build and return the new access token
    const accessToken = sign(
        { ...user, session: session.session_id },
        {
            expiresIn: '15m',
        }
    );
    return accessToken;
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    const { decoded } = decode(refreshToken);
    if (!decoded || !get(decoded, 'session_id')) return false;

    //get session
    const session = await Session.findOne({
        where: { session_id: get(decoded, 'session_id') }, relations: ['user']
    });
    if (!session)
        return false;
    if (!session.valid) return false;

    const user = await User.findOneBy({ user_id: session.user.user_id });
    if (!user) return false;

    const accessToken = createAccessToken({ user, session });
    return accessToken;
}
