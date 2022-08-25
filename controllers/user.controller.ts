import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { omit, sample } from 'lodash';
import log from '../logger/log';
import { writeFile } from 'node:fs/promises'
import { QueryBuilder, QueryRunner } from 'neogma';
import neogma from '../util/neo4j';
import { User as UserNeo4J } from '../entity/UserNeoModel';
import { validationResult } from 'express-validator';
import HttpException from '../util/HttpException';
import { Like, Tweet, User } from '../entity'
import { UserInterface } from '../util/types'
import { Like as likeOperator } from "typeorm";

const queryRunner = new QueryRunner({
    /* --> a driver needs to be passed */
    driver: neogma.driver,
    /* --> (optional) logs every query that this QueryRunner instance runs, using the given function */
    // logger: console.log,
});

export const createUserWithNeo4j = async (userData: UserInterface) => {
    try {
        const user = await UserNeo4J.createOne({
            user_id: userData.user_id,
            username: userData.username,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            bio: userData.bio || '',
            userAvatar: userData.userAvatar,
        });
        await user.save();
    } catch (error) {
        console.log(error)
    }

};
export async function createUserhandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let userByEmail = await User.findOne({ where: { email: req.body.email } });
    if (userByEmail !== null) {
        return next(new HttpException(404, "Email already used", { "field": "email" }))
    }
    let userByUsername = await User.findOne({ where: { username: req.body.username } });
    if (userByUsername !== null) {
        return next(new HttpException(404, "Username already used", { field: "username" }))
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const userData = { ...req.body };
    // log.info(userData);
    userData.username = userData.username.toLowerCase();
    userData.userAvatar = `https://robohash.org/${userData.firstname + userData.lastname + userData.username}.png`;
    userData.password = hashed;
    try {
        const user = User.create(userData);
        await user.save();
        createUserWithNeo4j(user);
        return res.send(omit(user, 'password'));
    } catch (error) {
        log.error(error);
        return res.status(409).send(error.message);
    }
}


export async function getUserData(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    const user = await User.findOneBy({ username });
    if (!user) {
        const options = {
            user_id: null,
            username: 'untrovable',
            firstname: 'untrovable',
            lastname: 'untrovable',
            userAvatar: '',
            email: 'untrovable',
            bio: 'untrovable',
        };
        return next(new HttpException(404, "username not found", options))
    }
    const userNeo4j = await UserNeo4J.findOne({ where: { user_id: user.user_id } });
    // console.log({ ...user, followers: userNeo4j.followers, followings: userNeo4j.following })
    const isFollowing = '';
    return res.json(omit({ ...user, followers: userNeo4j.followers || 0, followings: userNeo4j.following || 0 }, 'password', 'createdAt', 'updatedAt'));
}

export async function postFollow(req: Request, res: Response) {
    const { targetId } = req.body;

    const user_id = req.user.user_id;

    try {
        await UserNeo4J.relateTo({
            alias: 'Follows',
            where: {
                source: { user_id: user_id },
                target: { user_id: targetId },
            },
        });
        const userNeo4j = await UserNeo4J.findOne({ where: { user_id } });
        userNeo4j.followers++;
        await userNeo4j.save();

        return res.status(200).json({ message: 'user Followed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}

export async function postUnfollow(req: Request, res: Response) {
    const { target_id } = req.body;

    const user_id = req.user.user_id;
    if (target_id === user_id) {
        return res.json({ message: "you can't follow this account" });
    }
    try {
        await UserNeo4J.findOne({
            where: { user_id: user_id },
        });
        const queryBuilder = new QueryBuilder().raw(
            `match (n:User {user_id:'${user_id}'})-[f:Follows]->(u:User {user_id:'${target_id}'}) delete f`
        );
        queryBuilder.run(queryRunner);
        const userNeo4j = await UserNeo4J.findOne({ where: { user_id } });
        userNeo4j.followers--;
        await userNeo4j.save();
        return res.status(200).json({ message: 'user Unfollowed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}
export async function getFollowers(req: Request, res: Response) {
    const userId = req.user.user_id;

    const user = await UserNeo4J.findOne({
        where: {
            user_id: userId
        },
    });

    const relationship = await user.findRelationships({
        alias: 'Follows',
    });
    const following = relationship.map((follow: any) => {
        return follow.target.dataValues;
    });
    res.json({ following, count: following.length });
}
//should change it with getFollowers
export async function getFollowings(req: Request, res: Response) {
    const user_id = req.user.user_id;

    const relationships = await UserNeo4J.findRelationships({
        alias: 'Follows',
        where: {
            target: { user_id },
        },
    });
    const followers = relationships.map(
        (follow: any) => {
            return follow.source.dataValues;
        }
    );
    res.json({
        followers,
        count: followers.length
    });
}
export async function userLikedPost(req: Request, res: Response) {
    const { username } = req.params;

    const postLiked = await Like.find({ where: { user: { username } }, relations: ['tweet', 'tweet.user'] })
    const posts = postLiked.map(el => { return { ...el.tweet, is_liked: true } })
    return res.json(posts)
}
export async function SearchForUser(req: Request, res: Response) {

    const username = req.query.username as string;

    const users = await User.find({
        where: [{ username: likeOperator(`%${username}%`) },
        { email: likeOperator(`${username}`) },
        { firstname: likeOperator(`%${username}%`) },
        { lastname: likeOperator(`%${username}%`) }
        ]
    });
    if (!users) {
        return new HttpException(404, "user not found")
    }
    const fetchedUsers = users.map(el => ({
        user_id: el.user_id,
        userAvatar: el.userAvatar,
        username: el.username,
        firstname: el.firstname,
        lastname: el.lastname
    }))
    return res.json(fetchedUsers)
}
export async function getAllUsers(req: Request, res: Response) {
    const users = await User.find();
    return res.json(users)
}
export async function ChangeUserProfilePicture(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user.user_id;
    const { imageUrl } = req.body;
    const user = await User.findOne({ where: { user_id } })
    if (!user)
        return next(new HttpException(404, "user not found"))

    let base64Data = imageUrl.replace(/^data:image\/png;base64,/, "");
    const picName = `./uploads/${user.username}/${Date.now()}.png`
    try {
        await writeFile(picName, base64Data, 'base64');
        user.userAvatar = picName;
        await user.save()
    } catch (error) {
        return next(new HttpException(404, error.toString()))
    }

    return res.status(200).json({ cropedPicture: picName })
}
export async function ChangeUserProfileBanner(req: Request, res: Response, next: NextFunction) {
    let pictures: string | string[] = '';
    if (req.files) {
        pictures = (req.files as Express.Multer.File[]).map((file) => file.path);
    }
    const { user_id } = req.user;
    const user = await User.findOneBy({ user_id });
    if (!user)
        return res.json({ message: 'user not found!' });
    user.profileBanner = pictures[0];
    await user.save();
    return res.status(200).json({ cropedBanned: pictures[0] })
}
