import { sign, decode } from '../util/jwt.utils';
import { Session, SessionInterface } from '../models/SessionModel';
import { User, UserInterface } from '../models/UserModel';
import { get } from 'lodash';

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({
        userId,
        valid: true,
        userAgent,
    });
    return session.toJSON();
}
export function createAccessToken({
    user,
    session,
}: {
    user: Omit<UserInterface, 'password'>;
    session: SessionInterface;
}) {
    // Build and return the new access token
    const accessToken = sign(
        { ...user, session: session.sessionId },
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
    if (!decoded || !get(decoded, 'sessionId')) return false;


    //get session
    const session = await Session.findByPk(get(decoded, 'sessionId'));
    if (!session || !session?.valid) return false;

    const user = await User.findByPk(session.userId, { raw: true });
    if (!user) return false;
    const accessToken = createAccessToken({ user, session });
    return accessToken;
}
