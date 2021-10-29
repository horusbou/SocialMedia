import { DataTypes, Model, Optional } from 'sequelize';
import db from '../util/database';

export interface LikesCreationAttributes
	extends Optional<LikesIterface, 'likesId'> {}
export interface LikesIterface extends Model {
	likesId: string;
	userId: string;
	postId: string;
	createdAt: Date;
	updatedAt: Date;
}

export const Like = db.define(
	'Like',
	{
		likesId: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		userId: { type: new DataTypes.STRING(), allowNull: false },
	},
	{
		timestamps: true,
	}
);
