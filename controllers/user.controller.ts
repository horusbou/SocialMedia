import { Response, Request, NextFunction } from 'express';
import { User as UserModel, UserInterface } from '../models/UserModel';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import log from '../logger/log';
import { QueryBuilder, QueryRunner } from 'neogma';
import neogma from '../util/neo4j';
import { User as UserInstance } from '../models/UserNeoModel';
import { body, validationResult } from 'express-validator';

const createUserWithNeo4j = async (userData: UserInterface) => {
    const user = await UserInstance.createOne({
        user_id: userData.user_id,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
    });
    await user.save();
};
export async function createUserhandler(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const userData = { ...req.body };
    userData.password = hashed;
    try {
        const user = await UserModel.create(userData);
        await user.createTimeline();
        console.log('user sent to NEO4J\n\n', user, '\n\n\n');
        createUserWithNeo4j(user.dataValues);
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
    try {
        //@ts-ignore
        const user = await UserModel.findByPk(req.user.user_id);
        await UserInstance.relateTo({
            alias: 'Follows',
            where: {
                source: { user_id: '91097394-0fe4-4ba1-8cef-77e143a63657' },
                // source: { user_id: user.dataValues.user_id },
                //91097394-0fe4-4ba1-8cef-77e143a63657
                //1ee64b3a-3f1f-4ae6-95d5-d88ab060b481
                target: { user_id: targetId },
            },
        });
        return res.status(200).json({ message: 'user Followed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}
const queryRunner = new QueryRunner({
    /* --> a driver needs to be passed */
    driver: neogma.driver,
    /* --> (optional) logs every query that this QueryRunner instance runs, using the given function */
    logger: console.log,
});
export async function postUnfollow(req: Request, res: Response) {
    const { targetId } = req.body;
    try {
        //@ts-ignore
        const user = await UserModel.findByPk(req.user.user_id);

        const userNeo4j = await UserInstance.findOne({
            where: { user_id: user.user_id },
        });
        const queryBuilder = new QueryBuilder().raw(
            `match (n:User {user_id:'${user.user_id}'})-[f:Follows]->(u:User {user_id:'${targetId}'}) delete f`
        );
        queryBuilder.run(queryRunner);
        return res.status(200).json({ message: 'user Unfollowed!' });
    } catch (error) {
        return res.status(400).json({ message: 'ERROR : ', error });
    }
}
export async function getFollowers(req: Request, res: Response) {
    const { targetId } = req.body;

    const user = await UserInstance.findOne({
        where: {
            //@ts-ignore
            // user_id:req.user.dataValues.user_id,
            user_id: '1ee64b3a-3f1f-4ae6-95d5-d88ab060b481',
        },
    });
    const relationship = await user.findRelationships({
        alias: 'Follows',
    });
    const following = relationship.map((follow: any) => follow.target);
    res.json({ following, count: following.length });
}
export async function getFollowings(req: Request, res: Response) {
    // const user = await UserInstance.findOne({
    // 	where: {
    // 		//@ts-ignore
    // 		// user_id:req.user.dataValues.user_id,
    // 		user_id: '1ee64b3a-3f1f-4ae6-95d5-d88ab060b481',
    // 	},
    // });
    // const relationships = await user.findRelationships({
    // 	alias: 'Follows',
    // 	where: {
    // 		source: {},
    // 		target: { user_id: '1ee64b3a-3f1f-4ae6-95d5-d88ab060b481' },
    // 	},
    // });
    // /**
    //  * match (source:User {user_id:''})-[relationship:Follows]->(target:User {user_id:''})
    //  */

    // res.json({ followers });
    const relationships = await UserInstance.findRelationships({
        alias: 'Follows',
        where: {
            target: { user_id: '1ee64b3a-3f1f-4ae6-95d5-d88ab060b481' },
        },
    });
    const followers = relationships.map(
        (follow: any) => follow.source
    );
    res.json({
        followers,
    });
}
