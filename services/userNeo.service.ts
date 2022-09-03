import { User as UserInstance } from '../entity/UserNeoModel';

//those who follow me
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
  // console.log(following);
  return following;
}
//those i Follow
const usersFollowings = async (user_id: string): Promise<string[] | null> => {
  const relationship = await UserInstance.findRelationships({ alias: 'Follows', where: { source: { user_id } } })
  const followingsId = relationship.map((following: any) => following.target.dataValues.user_id)
  if (followingsId.length)
    return followingsId
  return null

}
