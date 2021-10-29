import { Response, Request, NextFunction } from 'express';
import { User as UserModel } from '../models/UserModel';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import log from '../logger/log';

export async function createUserhandler(req: Request, res: Response) {
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(req.body.password, salt);
	const userData = { ...req.body };
	userData.password = hashed;
	try {
		const user = await UserModel.create(userData);
		await user.createTimeline();
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
