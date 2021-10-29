import { DataTypes, Model, Optional } from 'sequelize';
import db from '../util/database';

export interface ProjectCreationAttributes
	extends Optional<PostIterface, 'post_id'> {}
export interface PostIterface extends Model {
	post_id: string;
	tweetBody: { [key: string]: string[] | string | '' } | string;
	like: number;
	retweet: number;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
}

export const Post = db.define(
	'Post',
	{
		post_id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		tweetBody: { type: new DataTypes.STRING(6383), allowNull: false },
		like: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
		retweet: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
	},
	{
		timestamps: true,
	}
);
