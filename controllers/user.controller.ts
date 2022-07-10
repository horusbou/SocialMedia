import { Response, Request, NextFunction } from 'express';
import { User as UserModel, UserInterface, UserI } from '../models/UserModel';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import log from '../logger/log';
import { QueryBuilder, QueryRunner } from 'neogma';
import neogma from '../util/neo4j';
import { User as UserInstance } from '../models/UserNeoModel';
import { body, validationResult } from 'express-validator';

const queryRunner = new QueryRunner({
    /* --> a driver needs to be passed */
    driver: neogma.driver,
    /* --> (optional) logs every query that this QueryRunner instance runs, using the given function */
    logger: console.log,
});

export const createUserWithNeo4j = async (userData: UserI) => {
    try {
        const user = await UserInstance.createOne({
            user_id: userData.user_id,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            bio: userData.bio || '',
            userAvatar: userData.userAvatar,
        });
        await user.save();
    } catch (error) {
        console.log(error)
    }

};
export async function createUserhandler(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const userData: UserI = { ...req.body };
    userData.username = userData.username.toLowerCase();
    userData.userAvatar = `https://robohash.org/${userData.firstName + userData.lastName + userData.username}.png`;
    userData.password = hashed;
    console.log({ userData })
    try {
        const user = await UserModel.create(userData);
        console.log({ user })
        await user.createTimeline();
        createUserWithNeo4j(userData);
        return res.send(omit(user.toJSON(), 'password'));
    } catch (error) {
        log.error(error);
        return res.status(409).send(error.message);
    }
}

export async function getUserData(req: Request, res: Response) {
    const { username } = req.params;

    const user = await UserModel.findOne({
        raw: true,
        where: { username: `${username}` },
    });
    if (!user)
        return res.status(200).json({
            user_id: null,
            username: 'untrovable',
            firstName: 'untrovable',
            lastName: 'untrovable',
            userAvatar: '',
            email: 'untrovable',
            bio: 'untrovable',
        });
    return res.json(omit(user, 'password', 'createdAt', 'updatedAt'));
}

export async function postFollow(req: Request, res: Response) {
    const { targetId } = req.body;
    console.log("req.body", req.body)
    //@ts-ignore
    const user_id = req.user.user_id;
    console.log(targetId, user_id);
    try {
        const user = await UserModel.findByPk(user_id);
        await UserInstance.relateTo({
            alias: 'Follows',
            where: {
                source: { user_id: user_id },
                target: { user_id: targetId },
            },
        });

        return res.status(200).json({ message: 'user Followed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}

export async function postUnfollow(req: Request, res: Response) {
    const { targetId } = req.body;
    //@ts-ignore
    const userId = req.user.user_id;
    if (targetId === userId) {
        return res.json({ message: "you can't follow this account" });
    }
    try {
        const user = await UserModel.findByPk(userId);
        const userNeo4j = await UserInstance.findOne({
            where: { user_id: user.user_id },
        });
        const queryBuilder = new QueryBuilder().raw(
            `match (n:User {user_id:'${userId}'})-[f:Follows]->(u:User {user_id:'${targetId}'}) delete f`
        );
        queryBuilder.run(queryRunner);
        return res.status(200).json({ message: 'user Unfollowed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}
export async function getFollowers(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.user_id;
    const user = await UserInstance.findOne({
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
export async function getFollowings(req: Request, res: Response) {
    //@ts-ignore
    const user_id = req.user.user_id;
    const relationships = await UserInstance.findRelationships({
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
