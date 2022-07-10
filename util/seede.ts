import { UserI, User as UserModel } from '../models/UserModel'
import { createUserWithNeo4j } from '../controllers/user.controller'
import bcrypt from 'bcryptjs';


let userArr: UserI[] = [{
    user_id: '12098130912830213802183',
    username: 'azer18',
    firstName: 'hamza',
    lastName: 'bouqal',
    userAvatar: '',
    email: 'tahaya4625@gmail.com',
    password: 'compaq7550',
    bio: "first bouqal's Bio"
}, {
    user_id: '0983948897328907987212231123',
    username: 'ziad',
    firstName: 'ziad',
    lastName: 'mid',
    userAvatar: '',
    email: 'ziadmid@gmail.com',
    password: 'compaq7550',
    bio: "first ziad's Bio"
}]

async function setUsersInDb() {
    const salt = await bcrypt.genSalt(10);

    userArr.forEach(async (userData) => {
        try {
            userData.password = await bcrypt.hash(userData.password, salt);
            const user = await UserModel.create(userData);
            await user.createTimeline();
            createUserWithNeo4j(userData);
        } catch (error) {
            console.error(error)
        }
    })

}
setUsersInDb()
