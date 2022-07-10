import { UserI } from '../models/UserModel';
import { User as UserInstance } from '../models/UserNeoModel';

export async function getFollowers(user_id: string) {
    const user = await UserInstance.findOne({
        where: { user_id },
    });

    const relationship = await user.findRelationships({
        alias: 'Follows',
    });
    const following = relationship.map((follow: any) => {
        return follow.target.dataValues;
    });
    console.log(following);
    return following;
}
